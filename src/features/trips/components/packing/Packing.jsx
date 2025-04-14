import React from "react";
import AddListForm from "./AddListForm";
import EditListForm from "./EditListForm";
import DeleteListForm from "./DeleteListForm";
import { usePacking } from "./hooks/usePacking";
import "./Packing.css";

const iconMap = {
  Baby: "fa-baby",
  Beach: "fa-umbrella-beach",
  Business: "fa-briefcase",
  "Fancy Dinner": "fa-utensils",
};

const Packing = () => {
  const {
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
    handleRemoveItem,
    handleToggleCheck,
    handleAddList,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleDeleteList,
    handleRenameList,
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
          {Object.entries(lists).map(([name, items]) => {
            const checkedCount = checkedItems[name]?.length || 0;
            return (
              <div
                key={name}
                className={`category-card ${
                  selectedList === name ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedList(name);
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
                  {checkedCount}/{items.length}
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
                iconMap[selectedList] || "fa-clipboard-list"
              } fa-fw`}
            />
            {selectedList}
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
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>

        <ul className="item-list">
          {lists[selectedList]?.map((item, index) => {
            const isChecked = checked.includes(index);
            return (
              <li key={index} className="item-row">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleCheck(index)}
                />
                <span className={isChecked ? "checked" : ""}>{item.name}</span>
                <span className="quantity">
                  <button onClick={() => handleDecreaseQuantity(index)}>
                    -
                  </button>
                  <div className="quantity-box">{item.quantity}x</div>
                  <button onClick={() => handleIncreaseQuantity(index)}>
                    +
                  </button>
                </span>
                <button onClick={() => handleRemoveItem(index)}>
                  <i className="fa fa-trash"></i>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="add-item-input">
          <input
            type="text"
            placeholder="Add item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
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

      {/* Delete Confirmation Modal */}

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
};

export default Packing;
