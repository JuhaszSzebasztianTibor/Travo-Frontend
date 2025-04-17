export const tripData = [
  {
    id: 1,
    tripName: "Trip to London",
    startDate: "2025-02-28",
    endDate: "2025-03-11",
    destinations: [
      { id: 1, name: "London", nights: 3, activities: 0, transport: null },
      { id: 2, name: "Paris", nights: 4, activities: 2, transport: "Train" },
      { id: 3, name: "Brussels", nights: 3, activities: 1, transport: "Bus" },
    ],
    activities: 0,
    transport: null,
  },
  {
    id: 2,
    tripName: "Italy Tour",
    startDate: "2025-04-15",
    endDate: "2025-04-28",
    destinations: [
      { id: 1, name: "London", nights: 3, activities: 0, transport: null },
      { id: 2, name: "Paris", nights: 4, activities: 2, transport: "Train" },
      { id: 3, name: "Brussels", nights: 3, activities: 1, transport: "Bus" },
    ],
    activities: 2,
    transport: "Train",
  },
  {
    id: 3,
    tripName: "Scandinavian Escape",
    startDate: "2025-06-01",
    endDate: "2025-06-14",
    destinations: [
      { id: 1, name: "Rome", nights: 3, activities: 0, transport: null },
      { id: 2, name: "Madrid", nights: 4, activities: 2, transport: "Train" },
      { id: 3, name: "Barcelona", nights: 3, activities: 1, transport: "Bus" },
    ],
    activities: 1,
    transport: "Flight",
  },
];
