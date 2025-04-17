import { useState } from "react";
import { initialLists } from "../data/listsData";

export function usePacking() {
  const [lists, setLists] = useState(initialLists);
  const [selectedList, setSelectedList] = useState("Fancy Dinner");
  const [newItem, setNewItem] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const [newListName, setNewListName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editListName, setEditListName] = useState("");

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setLists((prev) => ({
      ...prev,
      [selectedList]: [
        ...(prev[selectedList] || []),
        { name: newItem.trim(), quantity: 1 },
      ],
    }));
    setNewItem("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddItem();
    }
  };

  const handleRemoveItem = (index) => {
    setLists((prev) => ({
      ...prev,
      [selectedList]: prev[selectedList].filter((_, i) => i !== index),
    }));
    setCheckedItems((prev) => {
      const updatedChecked = (prev[selectedList] || []).filter(
        (i) => i !== index
      );
      return { ...prev, [selectedList]: updatedChecked };
    });
  };

  const handleToggleCheck = (index) => {
    setCheckedItems((prev) => {
      const current = prev[selectedList] || [];
      const updated = current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index];
      return { ...prev, [selectedList]: updated };
    });
  };

  const handleAddList = () => {
    const trimmed = newListName.trim();
    if (!trimmed || lists[trimmed]) return;
    setLists((prev) => ({ ...prev, [trimmed]: [] }));
    setSelectedList(trimmed);
    setNewListName("");
  };

  const handleIncreaseQuantity = (index) => {
    setLists((prev) => {
      const updatedList = prev[selectedList].map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item
      );
      return { ...prev, [selectedList]: updatedList };
    });
  };

  const handleDecreaseQuantity = (index) => {
    setLists((prev) => {
      const updatedList = prev[selectedList].map((item, i) =>
        i === index && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      return { ...prev, [selectedList]: updatedList };
    });
  };

  const handleDeleteList = () => {
    const updatedLists = { ...lists };
    delete updatedLists[selectedList];
    setLists(updatedLists);
    const remaining = Object.keys(updatedLists)[0] || "";
    setSelectedList(remaining);
    setShowDeleteModal(false);
  };

  const handleRenameList = () => {
    const trimmed = editListName.trim();
    if (!trimmed || trimmed === selectedList || lists[trimmed]) return;
    const updated = { ...lists };
    updated[trimmed] = updated[selectedList];
    delete updated[selectedList];

    const updatedChecked = { ...checkedItems };
    updatedChecked[trimmed] = updatedChecked[selectedList] || [];
    delete updatedChecked[selectedList];

    setLists(updated);
    setCheckedItems(updatedChecked);
    setSelectedList(trimmed);
    setShowEditModal(false);
  };

  const checked = checkedItems[selectedList] || [];
  const progress = lists[selectedList]?.length
    ? (checked.length / lists[selectedList].length) * 100
    : 0;

  return {
    lists,
    selectedList,
    newItem,
    checkedItems,
    newListName,
    showModal,
    showDeleteModal,
    showEditModal,
    editListName,
    setSelectedList,
    setNewItem,
    setNewListName,
    setShowModal,
    setShowDeleteModal,
    setShowEditModal,
    setEditListName,
    handleAddItem,
    handleKeyDown,
    handleRemoveItem,
    handleToggleCheck,
    handleAddList,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleDeleteList,
    handleRenameList,
    checked,
    progress,
  };
}
