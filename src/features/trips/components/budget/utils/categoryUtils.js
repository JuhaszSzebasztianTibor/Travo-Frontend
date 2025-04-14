export const getCategoryIcon = (category) => {
  switch (category) {
    case "Sleep":
      return "fa-bed";
    case "Transport":
      return "fa-car";
    case "Visit Places":
      return "fa-map-marker-alt";
    case "Eat & Drinks":
      return "fa-utensils";
    default:
      return "fa-ellipsis-h";
  }
};

export const categories = [
  "Sleep",
  "Transport",
  "Visit Places",
  "Eat & Drinks",
  "Other",
];
