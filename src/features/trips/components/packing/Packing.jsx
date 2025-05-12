import React from "react";
import AddListForm from "./AddListForm";
import EditListForm from "./EditListForm";
import DeleteListForm from "./DeleteListForm";
import { usePacking } from "./hooks/usePacking";
import "./Packing.css";

const iconMap = {
  Food: "fas fa-hamburger",
  Baby: "fa-baby",
  Beach: "fa-umbrella-beach",
  Business: "fa-briefcase",
  Essentials: "fas fa-exclamation-circle",
  "Fancy Dinner": "fa-utensils",
};

export default function Packing() {
  const {
    lists,
    selectedList,
    newItem,
    newListName,
    showModal,
    showEditModal,
    showDeleteModal,
    editListName,
    setSelectedList,
    setNewItem,
    setNewListName,
    setShowModal,
    setShowEditModal,
    setShowDeleteModal,
    setEditListName,
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

  return (
    <div className="packing-page">
      <div className="packing-sidebar">
        <div className="packing-title">
          <h2>Packing list</h2>
          <button className="add-list-btn" onClick={() => setShowModal(true)}>
            <i className="fa fa-plus-circle"></i> Add list
          </button>
        </div>
        <div className="category-grid">
          {Object.entries(lists).map(([name, listData]) => {
            const count = listData.items.filter((i) => i.isChecked).length;
            return (
              <div
                key={name}
                className={`category-card ${
                  selectedList.name === name ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedList({ name, id: listData.id });
                  setEditListName(name);
                }}
              >
                <i
                  className={`fa ${
                    iconMap[name] || "fas fa-clipboard-list"
                  } fa-2x`}
                />
                <span>{name}</span>
                <small>
                  {count}/{listData.items.length}
                </small>
              </div>
            );
          })}
        </div>
      </div>

      <div className="packing-main">
        <div className="header">
          <h3>
            <i
              className={`fa ${
                iconMap[selectedList.name] || "fa-clipboard-list"
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
          {lists[selectedList.name]?.items.map((item, index) => (
            <li key={`${item.id}-${index}`} className="item-row">
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
          ))}
        </ul>

        <div className="add-item-input">
          <input
            type="text"
            placeholder="Add item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAddItem}>➤</button>
        </div>
      </div>

      <AddListForm
        showModal={showModal}
        setShowModal={setShowModal}
        newListName={newListName}
        setNewListName={setNewListName}
        handleAddList={handleAddList}
      />
      <EditListForm
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editListName={editListName}
        setEditListName={setEditListName}
        handleRenameList={handleRenameList}
      />
      <DeleteListForm
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedList={selectedList}
        handleDeleteList={handleDeleteList}
      />
    </div>
  );
}
