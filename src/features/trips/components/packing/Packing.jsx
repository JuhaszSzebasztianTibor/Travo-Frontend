import React from "react";
import { PackingListForm } from "./PackingListForm";
import DeleteListForm from "./DeleteListForm";
import { usePacking } from "./hooks/usePacking";
import "./Packing.css";

export default function Packing() {
  const {
    loading,
    lists,
    selectedList,
    newItem,
    newListName,
    setNewListName,
    showModal,
    showEditModal,
    showDeleteModal,
    editListName,
    editIcon,
    setSelectedList,
    setNewItem,
    setShowModal,
    setShowEditModal,
    setShowDeleteModal,
    setEditListName,
    setEditIcon,
    handleAddList,
    handleRenameList,
    handleDeleteList,
    handleAddItem,
    handleToggleCheck,
    handleRemoveItem,
    handleDecreaseQuantity,
    handleIncreaseQuantity,
    handleKeyDown,
    checked,
    progress,
  } = usePacking();

  if (loading) {
    return <div className="packing-loading">Loading packing lists…</div>;
  }

  if (!selectedList.name || !lists[selectedList.name]) {
    return (
      <div className="packing-loading">
        No packing list selected or data missing.
      </div>
    );
  }

  const sidebarEntries = Object.entries(lists).map(([name, data]) => {
    const arr = Array.isArray(data.items) ? data.items : [];
    const cnt = arr.filter((i) => i.isChecked).length;
    return { name, data, count: cnt, total: arr.length };
  });

  const items = Array.isArray(lists[selectedList.name]?.items)
    ? lists[selectedList.name].items
    : [];

  return (
    <div className="packing-page">
      <div className="packing-sidebar">
        <div className="packing-title">
          <h2>Packing list</h2>
          <button className="add-list-btn" onClick={() => setShowModal(true)}>
            <i className="fa fa-plus-circle" /> Add list
          </button>
        </div>
        <div className="category-grid">
          {sidebarEntries.map(({ name, data, count, total }) => (
            <div
              key={name}
              className={`category-card ${
                selectedList.name === name ? "selected" : ""
              }`}
              onClick={() => {
                if (!data?.id) return;
                setSelectedList({ name, id: data.id });
                setEditListName(name);
                setEditIcon(data.icon);
              }}
            >
              <i className={`${data.icon} fa-2x`} />
              <span>{name}</span>
              <small>
                {count}/{total}
              </small>
            </div>
          ))}
        </div>
      </div>

      <div className="packing-main">
        <div className="header">
          <h3>
            <i
              className={`${
                lists[selectedList.name]?.icon || "fas fa-clipboard-list"
              } fa-fw`}
            />
            {selectedList.name}
          </h3>
          <div className="header-actions">
            <button className="edit-btn" onClick={() => setShowEditModal(true)}>
              <i className="fa fa-edit" /> Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="fa fa-trash" /> Delete
            </button>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${progress}%` }} />
        </div>

        <ul className="item-list">
          {items.map((item, idx) => {
            if (!item || !item.id) return null;
            return (
              <li key={`${item.id}-${idx}`} className="item-row">
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={() => handleToggleCheck(item.id, item.isChecked)}
                />
                <span className={item.isChecked ? "checked" : ""}>
                  {item.name}
                </span>
                <span className="quantity">
                  <button onClick={() => handleDecreaseQuantity(item.id)}>
                    –
                  </button>
                  <div className="quantity-box">{item.quantity}x</div>
                  <button onClick={() => handleIncreaseQuantity(item.id)}>
                    +
                  </button>
                </span>
                <button onClick={() => handleRemoveItem(item.id)}>
                  <i className="fa fa-trash" />
                </button>
              </li>
            );
          })}
        </ul>

        <div className="add-item-input">
          <input
            type="text"
            placeholder="Add item…"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddItem}>➤</button>
        </div>
      </div>

      <PackingListForm
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode="create"
        initialName={newListName}
        initialIcon=""
        onSubmit={handleAddList}
      />
      <PackingListForm
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        initialName={editListName}
        initialIcon={editIcon}
        onSubmit={handleRenameList}
      />
      <DeleteListForm
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedList={selectedList}
        handleDeleteList={() => {
          handleDeleteList();
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}
