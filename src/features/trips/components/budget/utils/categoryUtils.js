export const getCategoryIcon = (category) => {
  switch (category) {
    case "Sleep":
      return "fa-bed";
    case "Transport":
      return "fas fa-plane";
    case "Visit Places":
      return "fas fa-university";
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
