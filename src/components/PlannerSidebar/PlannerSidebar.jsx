// src/components/PlannerSidebar/PlannerSidebar.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import Plane from "../../assets/Images/travoplane.png";
import Modal from "../Modal/Modal";
import TripForm from "../../features/profile/modal/TripForm";
import api from "../../api/api";
import "./plannerSidebar.css";

const PlannerSidebar = () => {
  const { tripId } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditOpen) return;

    setLoading(true);
    api
      .get(`/Trips/${tripId}`)
      .then((res) => {
        const t = res.data;
        setInitialValues({
          name: t.tripName || "",
          startDate: t.startDate?.slice(0, 10) || "",
          endDate: t.endDate?.slice(0, 10) || "",
          description: t.description || "",
          imageUrl: t.image || "",
          imageFile: null,
        });
      })
      .catch(() => navigate("/error"))
      .finally(() => setLoading(false));
  }, [isEditOpen, tripId, navigate]);

  const handleUpdateTrip = async (formData) => {
    const form = new FormData();
    form.append("TripName", formData.name);
    form.append("StartDate", formData.startDate);
    form.append("EndDate", formData.endDate);
    form.append("Description", formData.description);
    if (formData.imageFile) {
      form.append("ImageFile", formData.imageFile);
    } else {
      form.append("ImageUrl", formData.imageUrl);
    }

    try {
      await api.put(`/Trips/${tripId}`, form);
      setIsEditOpen(false);
      navigate(`/trip/plan/${tripId}`);
    } catch {
      alert("Failed to update trip. Please try again.");
    }
  };

  return (
    <div className="planner-sidebar">
      <NavLink to="/profile">
        <img src={Plane} alt="Plane" className="plane-img" />
      </NavLink>

      <ul>
        <li>
          <NavLink
            to={`/trip/view/${tripId}`}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fa fa-eye"></i>
            <span>View</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to={`/trip/plan/${tripId}`}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Plan</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to={`/trip/budget/${tripId}`}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fas fa-wallet"></i>
            <span>Budget</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to={`/trip/packing/${tripId}`}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            <i className="fa fa-shirt"></i>
            <span>Packing</span>
          </NavLink>
        </li>

        <li className="last-link">
          <button className="edit-btn" onClick={() => setIsEditOpen(true)}>
            <i className="fas fa-edit"></i>
          </button>
        </li>
      </ul>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {loading || !initialValues ? (
          <div>Loading...</div>
        ) : (
          <TripForm
            key={tripId}
            onSubmit={handleUpdateTrip}
            initialValues={initialValues}
            submitLabel="Update Trip"
          />
        )}
      </Modal>
    </div>
  );
};

export default PlannerSidebar;
