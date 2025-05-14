// src/features/trips/components/packing/hooks/usePacking.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as packingService from "../../../../../services/packing/packingService";
import { updateLocalItems, normalizeCurrentList } from "./usePackingHelpers";

export function usePacking() {
  const { tripId } = useParams();

  // --- State ---
  const [lists, setLists] = useState({});
  const [selectedList, setSelectedList] = useState({ name: "", id: null });
  const [newItem, setNewItem] = useState("");
  const [newListName, setNewListName] = useState("");
  const [editListName, setEditListName] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [loading, setLoading] = useState(true);

  // --- Load on mount / tripId change ---
  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    packingService
      .getPackingLists(tripId)
      .then((data) => {
        // build map keyed by list.name
        const map = data.reduce((acc, list) => {
          acc[list.name] = {
            id: list.id,
            icon: list.packingListIcon,
            items: Array.isArray(list.items) ? list.items : [],
          };
          return acc;
        }, {});
        setLists(map);

        // auto-select first list
        if (data.length) {
          const first = data[0];
          setSelectedList({ name: first.name, id: first.id });
          setEditListName(first.name);
          setEditIcon(first.packingListIcon);
        }
      })
      .catch((err) => console.error("Error fetching packing lists:", err))
      .finally(() => setLoading(false));
  }, [tripId]);

  // --- Normalize current list & compute progress ---
  const { id: selId, items } = normalizeCurrentList(selectedList.name, lists);
  const checked = items.filter((i) => i.isChecked).length;
  const progress = items.length ? (checked / items.length) * 100 : 0;

  // --- Item handlers ---
  const handleAddItem = async () => {
    if (!selId) return;
    const text = newItem.trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}`;
    setLists((prev) =>
      updateLocalItems(prev, selectedList.name, (old) => [
        ...old,
        { id: tempId, name: text, quantity: 1, isChecked: false },
      ])
    );
    setNewItem("");

    try {
      const created = await packingService.addPackingItem(tripId, selId, {
        name: text,
        quantity: 1,
      });
      setLists((prev) =>
        updateLocalItems(prev, selectedList.name, (old) =>
          old.map((i) => (i.id === tempId ? { ...i, id: created.id } : i))
        )
      );
    } catch {
      setLists((prev) =>
        updateLocalItems(prev, selectedList.name, (old) =>
          old.filter((i) => i.id !== tempId)
        )
      );
    }
  };

  const handleToggleCheck = async (itemId, wasChecked) => {
    setLists((prev) =>
      updateLocalItems(prev, selectedList.name, (old) =>
        old.map((i) => (i.id === itemId ? { ...i, isChecked: !wasChecked } : i))
      )
    );
    if (`${itemId}`.startsWith("temp-")) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await packingService.updatePackingItem(tripId, selId, itemId, {
        ...item,
        isChecked: !wasChecked,
      });
    } catch {
      // rollback
      setLists((prev) =>
        updateLocalItems(prev, selectedList.name, () => items)
      );
    }
  };

  const handleChangeQuantity = async (itemId, qty) => {
    setLists((prev) =>
      updateLocalItems(prev, selectedList.name, (old) =>
        old.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
      )
    );
    if (`${itemId}`.startsWith("temp-")) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    try {
      await packingService.updatePackingItem(tripId, selId, itemId, {
        ...item,
        quantity: qty,
      });
    } catch {
      setLists((prev) =>
        updateLocalItems(prev, selectedList.name, () => items)
      );
    }
  };

  const handleDecreaseQuantity = (id) =>
    handleChangeQuantity(
      id,
      Math.max(1, (items.find((i) => i.id === id)?.quantity || 1) - 1)
    );

  const handleIncreaseQuantity = (id) =>
    handleChangeQuantity(
      id,
      (items.find((i) => i.id === id)?.quantity || 0) + 1
    );

  const handleRemoveItem = async (itemId) => {
    const snapshot = items;
    setLists((prev) =>
      updateLocalItems(prev, selectedList.name, (old) =>
        old.filter((i) => i.id !== itemId)
      )
    );
    if (!`${itemId}`.startsWith("temp-")) {
      try {
        await packingService.removePackingItem(tripId, selId, itemId);
      } catch {
        setLists((prev) =>
          updateLocalItems(prev, selectedList.name, () => snapshot)
        );
      }
    }
  };

  // --- List handlers (unchanged) ---
  const handleAddList = async ({ name, icon, items: tpl = [] }) => {
    if (!name || !icon || lists[name]) return;
    const created = await packingService.createPackingList(tripId, {
      name,
      packingListIcon: icon,
      items: tpl,
    });
    setLists((prev) => ({
      ...prev,
      [created.name]: {
        id: created.id,
        icon: created.packingListIcon,
        items: created.items || [],
      },
    }));
    setSelectedList({ name: created.name, id: created.id });
    setNewListName("");
    setModals((m) => ({ ...m, add: false }));
  };

  const handleRenameList = async ({ name, icon }) => {
    if (name === selectedList.name) return;
    const dto = {
      id: selectedList.id,
      Name: name,
      PackingListIcon: icon,
      Items: items,
    };
    await packingService.renamePackingList(tripId, selectedList.id, dto);
    setLists((prev) => {
      const copy = { ...prev };
      delete copy[selectedList.name];
      copy[name] = { id: selectedList.id, icon, items: dto.Items };
      return copy;
    });
    setSelectedList({ name, id: selectedList.id });
    setModals((m) => ({ ...m, edit: false }));
  };

  const handleDeleteList = async () => {
    await packingService.deletePackingList(tripId, selectedList.id);
    const next = { ...lists };
    delete next[selectedList.name];
    const keys = Object.keys(next);
    setSelectedList(
      keys.length
        ? { name: keys[0], id: next[keys[0]].id }
        : { name: "", id: null }
    );
    setLists(next);
    setModals((m) => ({ ...m, delete: false }));
  };

  return {
    loading,
    lists,
    selectedList,
    newItem,
    newListName,
    editListName,
    editIcon,
    setSelectedList,
    setNewItem,
    setNewListName,
    setEditListName,
    setEditIcon,
    showModal: modals.add,
    showEditModal: modals.edit,
    showDeleteModal: modals.delete,
    setShowModal: (v) => setModals((m) => ({ ...m, add: v })),
    setShowEditModal: (v) => setModals((m) => ({ ...m, edit: v })),
    setShowDeleteModal: (v) => setModals((m) => ({ ...m, delete: v })),
    handleAddList,
    handleRenameList,
    handleDeleteList,
    handleAddItem,
    handleToggleCheck,
    handleChangeQuantity,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleRemoveItem,
    handleKeyDown: (e) => e.key === "Enter" && handleAddItem(),
    checked,
    progress,
  };
}
