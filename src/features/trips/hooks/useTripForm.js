import { useState, useEffect, useRef } from "react";

const useTripForm = (onSubmit) => {
  const [tripData, setTripData] = useState({
    name: "",
    country: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    imageFile: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const handleFileChange = (e) => {
    setTripData({ ...tripData, imageFile: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(tripData);
  };

  return {
    tripData,
    searchTerm,
    showDropdown,
    dropdownRef,
    setTripData,
    setSearchTerm,
    setShowDropdown,
    handleChange,
    handleFileChange,
    handleSubmit,
  };
};

export default useTripForm;
