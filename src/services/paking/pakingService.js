import api from "../../api/api";

// Fetch all packing lists
export async function fetchPackingLists() {
  try {
    const { data } = await api.get("/Packing");
    console.log("Fetched lists data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching packing lists:", err);
    throw err;
  }
}

// Create a new packing list
export async function createPackingList(newList) {
  try {
    const { data } = await api.post(`/Packing`, newList);
    return data;
  } catch (err) {
    console.error("Error creating packing list:", err);
    throw err;
  }
}

// Rename a packing list
export async function renamePackingList(listId, updatedList) {
  try {
    await api.put(`/Packing/${listId}`, updatedList);
  } catch (err) {
    console.error("Error renaming packing list:", err);
    throw err;
  }
}

// Delete a packing list
export async function deletePackingList(listId) {
  try {
    await api.delete(`/Packing/${listId}`);
  } catch (err) {
    console.error("Error deleting packing list:", err);
    throw err;
  }
}

// Fetch items for a specific list
export async function fetchPackingListItems(listId) {
  try {
    const { data } = await api.get(`/Packing/${listId}`);
    return data.items;
  } catch (err) {
    console.error("Error fetching packing list items:", err);
    throw err;
  }
}

// Add item to a packing list
export async function addItemToPackingList(listId, item) {
  try {
    const { data } = await api.post(`/Packing/${listId}/items`, item);
    return data;
  } catch (err) {
    console.error("Error adding item:", err);
    throw err;
  }
}

// Update the item
export async function updateItemInPackingList(listId, itemId, updatedItem) {
  // Debug: log parameters
  console.log("updateItemInPackingList called with", {
    listId,
    itemId,
    updatedItem,
  });
  try {
    if (itemId == null) {
      throw new Error(`Invalid itemId: ${itemId}`);
    }
    const url = `/Packing/${listId}/items/${itemId}`;
    console.log("PATCH URL: ", url);
    await api.patch(url, updatedItem);
  } catch (err) {
    console.error("Error updating item:", err);
    throw err; // Ensure error is thrown
  }
}

// Remove item from a packing list
export async function removeItemFromPackingList(listId, itemId) {
  try {
    const endpoint = `/Packing/${Number(listId)}/items/${Number(itemId)}`;
    console.log("Deleting item from:", endpoint);
    await api.delete(endpoint);
  } catch (err) {
    if (err.response) {
      console.error(
        "Server responded with error:",
        err.response.status,
        err.response.data
      );
    } else {
      console.error("Network error:", err.message);
    }
    throw err;
  }
}
