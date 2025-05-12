import React, { useState, useEffect } from "react";
import * as packingService from "../../../../../services/paking/pakingService.js";

export function usePacking() {
  const [lists, setLists] = useState({});
  const [selectedList, setSelectedList] = useState({ name: null, id: null });
  const [newItem, setNewItem] = useState("");
  const [newListName, setNewListName] = useState("");
  const [editListName, setEditListName] = useState("");
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  // INITIAL LOAD: fetch all lists
  useEffect(() => {
    (async () => {
      try {
        const data = await packingService.fetchPackingLists();

        const map = data.reduce((acc, list) => {
          acc[list.name] = {
            id: list.id,
            category: list.category,
            items: (list.items || []).map((i) => ({
              id: i.id, // raw payload already has lowercase `id`
              name: i.name,
              quantity: i.quantity, // raw payload has lowercase `quantity`
              isChecked: i.isChecked ?? false,
            })),
          };
          return acc;
        }, {});

        console.log("🚀 MAPPED LISTS STATE:", map);
        setLists(map);

        if (data.length) {
          setSelectedList({ name: data[0].name, id: data[0].id });
        }
      } catch (err) {
        console.error("Error fetching lists:", err);
      }
    })();
  }, []);

  // Helper: update items for a given listName
  function updateLocalItems(listName, updater) {
    setLists((prev) => {
      const list = prev[listName];
      if (!list) return prev;
      const current = list.items;
      const next = typeof updater === "function" ? updater(current) : updater;
      return { ...prev, [listName]: { ...list, items: next } };
    });
  }

  // ADD ITEM
  async function handleAddItem() {
    if (!selectedList.id || !lists[selectedList.name]) return; // <- ADD THIS LINE
    const text = newItem.trim();
    if (!text) return;

    const tempId = `temp-${Date.now()}`;
    const temp = { id: tempId, name: text, quantity: 1, isChecked: false };
    updateLocalItems(selectedList.name, (old) => [...old, temp]);
    setNewItem("");

    try {
      const data = await packingService.addItemToPackingList(selectedList.id, {
        name: text,
        quantity: 1,
      });
      updateLocalItems(selectedList.name, (old) =>
        old.map((i) => (i.id === tempId ? { ...i, id: data.id } : i))
      );
    } catch (err) {
      console.error("Add failed:", err);
      updateLocalItems(selectedList.name, (old) =>
        old.filter((i) => i.id !== tempId)
      );
    }
  }

  // TOGGLE CHECK
  async function handleToggleCheck(itemId, checked) {
    console.log("🔍 handleToggleCheck called with", {
      selectedList,
      itemId,
      listsForSelected: lists[selectedList.name],
    });

    if (!selectedList.id) return;
    const list = lists[selectedList.name];
    if (!list) return;
    const isTemp = String(itemId).startsWith("temp-");

    updateLocalItems(
      selectedList.name,
      list.items.map((i) =>
        i.id === itemId ? { ...i, isChecked: !checked } : i
      )
    );
    if (isTemp) return;

    try {
      const item = list.items.find((i) => i.id === itemId);
      await packingService.updateItemInPackingList(selectedList.id, itemId, {
        ...item,
        isChecked: !checked,
      });
    } catch (err) {
      console.error("Toggle failed:", err);
      updateLocalItems(selectedList.name, list.items);
    }
  }

  // CHANGE QUANTITY
  async function handleChangeQuantity(itemId, qty) {
    console.log("🔍 handleChangeQuantity called with", {
      selectedList,
      itemId,
      qty,
      listsForSelected: lists[selectedList.name],
    });

    if (!selectedList.id) return;
    const list = lists[selectedList.name];
    if (!list) return;
    const isTemp = String(itemId).startsWith("temp-");
    const prev = list.items;

    updateLocalItems(
      selectedList.name,
      prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
    );
    if (isTemp) return;

    try {
      const item = list.items.find((i) => i.id === itemId);
      await packingService.updateItemInPackingList(selectedList.id, itemId, {
        ...item,
        quantity: qty,
      });
    } catch (err) {
      console.error("Quantity failed:", err);
      updateLocalItems(selectedList.name, prev);
    }
  }
  const handleDecreaseQuantity = (id) => {
    const list = lists[selectedList.name];
    const item = list?.items.find((i) => i.id === id);
    if (item) handleChangeQuantity(id, Math.max(1, item.quantity - 1));
  };
  const handleIncreaseQuantity = (id) => {
    const list = lists[selectedList.name];
    const item = list?.items.find((i) => i.id === id);
    if (item) handleChangeQuantity(id, item.quantity + 1);
  };

  // REMOVE ITEM
  async function handleRemoveItem(itemId) {
    if (!selectedList.id) return;
    const list = lists[selectedList.name];
    if (!list) return;
    const prev = list.items;

    updateLocalItems(
      selectedList.name,
      prev.filter((i) => i.id !== itemId)
    );
    const numeric = Number(itemId);
    if (isNaN(numeric)) return;

    try {
      await packingService.removeItemFromPackingList(selectedList.id, numeric);
    } catch (err) {
      console.error("Remove failed:", err);
      updateLocalItems(selectedList.name, prev);
    }
  }

  // LIST CRUD
  async function handleAddList() {
    const name = newListName.trim();
    if (!name || lists[name]) return;

    try {
      // 1. Create on the server
      const created = await packingService.createPackingList({
        name,
        category: 0,
        items: [],
      });

      // 2. Normalize new-list shape just like in your initial fetch
      const normalized = {
        id: created.id,
        category: created.category,
        items: (created.items || []).map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          isChecked: !!i.isChecked,
        })),
      };

      // 3. Merge into state
      setLists((prev) => ({
        ...prev,
        [created.name]: normalized,
      }));

      // 4. Select & prime edit field
      setSelectedList({ name: created.name, id: created.id });
      setEditListName(created.name);

      // 5. Tidy up
      setNewListName("");
      setModals((m) => ({ ...m, add: false }));
    } catch (err) {
      console.error("Create list failed:", err);
    }
  }

  async function handleRenameList() {
    const trimmed = editListName.trim();
    if (!trimmed || trimmed === selectedList.name) return;
    try {
      const list = lists[selectedList.name];
      const dto = {
        id: list.id,
        name: trimmed,
        category: list.category || 0,
        items: list.items,
      };
      await packingService.renamePackingList(list.id, dto);
      setLists((prev) => {
        const copy = { ...prev };
        delete copy[selectedList.name];
        return {
          ...copy,
          [trimmed]: { ...list, items: list.items, category: list.category },
        };
      });
      setSelectedList({ name: trimmed, id: list.id });
      setEditListName("");
      setModals((m) => ({ ...m, edit: false }));
    } catch (err) {
      console.error("Rename failed:", err);
    }
  }

  async function handleDeleteList() {
    if (!selectedList.id) return;
    try {
      await packingService.deletePackingList(selectedList.id);
      const next = { ...lists };
      delete next[selectedList.name];
      const names = Object.keys(next);
      const newSel = names.length
        ? { name: names[0], id: next[names[0]].id }
        : { name: null, id: null };
      setLists(next);
      setSelectedList(newSel);
      setModals((m) => ({ ...m, delete: false }));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // Derived
  const items = lists[selectedList.name]?.items || [];
  const checkedCount = items.filter((i) => i.isChecked).length;
  const progress = items.length ? (checkedCount / items.length) * 100 : 0;

  return {
    lists,
    selectedList,
    setSelectedList,
    newItem,
    setNewItem,
    newListName,
    setNewListName,
    editListName,
    setEditListName,
    showModal: modals.add,
    showEditModal: modals.edit,
    showDeleteModal: modals.delete,
    setShowModal: (s) => setModals((m) => ({ ...m, add: s })),
    setShowEditModal: (s) => setModals((m) => ({ ...m, edit: s })),
    setShowDeleteModal: (s) => setModals((m) => ({ ...m, delete: s })),
    handleAddList,
    handleRenameList,
    handleDeleteList,
    handleAddItem,
    handleToggleCheck,
    handleRemoveItem,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleChangeQuantity,
    handleKeyDown: (e) => e.key === "Enter" && handleAddItem(),
    checked: checkedCount,
    progress,
  };
}
