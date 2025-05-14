// src/features/trips/components/packing/hooks/usePackingHelpers.js

/**
 * updateLocalItems:
 * Given the existing lists map, the name of one list, and either
 *   • a new items array, or
 *   • an updater function (oldItems => newItems)
 * returns a brand-new lists map with just that list’s items replaced.
 */
export function updateLocalItems(lists, listName, next) {
  if (!lists[listName]) return lists;

  const base = Array.isArray(lists[listName].items)
    ? lists[listName].items
    : [];
  const items = typeof next === "function" ? next(base) : next;

  return {
    ...lists,
    [listName]: { ...lists[listName], items },
  };
}

/**
 * normalizeCurrentList:
 * Given the selectedList.name and the full lists map,
 * returns a safe object { id, icon, items[] } so consumers
 * never need to guard against undefined.
 */
export function normalizeCurrentList(selectedName, lists) {
  if (selectedName && lists[selectedName]) {
    const { id, icon, items } = lists[selectedName];
    return {
      id,
      icon,
      items: Array.isArray(items) ? items : [],
    };
  }
  return { id: null, icon: "", items: [] };
}
