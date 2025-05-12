import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Plane from "../../assets/Images/travoplane.png";
import Modal from "../Modal/Modal";
import TripForm from "../../features/profile/modal/TripForm";
import api from "../../api/api"; // Use the configured API instance
import "./plannerSidebar.css";

const PlannerSidebar = () => {
  const { tripId } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEditOpen) return;

    const fetchTrip = async () => {
      setLoading(true);
      try {
        // 1. Use the api instance instead of axios directly
        const res = await api.get(`/Trips/${tripId}`);

        if (!res.data) {
          console.error("No trip data received");
          return;
        }

        const trip = res.data;

        setInitialValues({
          name: trip.tripName || "",
          startDate: trip.startDate ? trip.startDate.slice(0, 10) : "",
          endDate: trip.endDate ? trip.endDate.slice(0, 10) : "",
          description: trip.description || "",
          imageUrl: trip.image || "",
          imageFile: null,
        });
      } catch (error) {
        console.error("Failed to fetch trip:", error);
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
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
      // 2. Verify endpoint casing matches backend route
      await api.put(`/Trips/${tripId}`, form);
      setIsEditOpen(false);
      navigate(`/trip/plan/${tripId}`);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update trip. Please try again.");
    }
  };
  return (
    <div className="planner-sidebar">
      <Link to="/profile">
        <img src={Plane} alt="Plane" className="plane-img" />
      </Link>
      <ul>
        <li>
          <Link to={`/trip/view/${tripId}`}>
            <i className="fa fa-eye"></i> <span>View</span>
          </Link>
        </li>
        <li>
          <Link to={`/trip/plan/${tripId}`}>
            <i className="fas fa-map-marker-alt"></i> <span>Plan</span>
          </Link>
        </li>
        <li>
          <Link to={`/trip/budget/${tripId}`}>
            <i className="fas fa-wallet"></i> <span>Budget</span>
          </Link>
        </li>
        <li>
          <Link to={`/trip/packing/${tripId}`}>
            <i className="fa fa-shirt"></i> <span>Packing</span>
          </Link>
        </li>
        <li>
          <Link to="#" onClick={() => setIsEditOpen(true)}>
            <i className="fas fa-edit"></i>
          </Link>
        </li>
      </ul>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {initialValues ? (
          <TripForm
            key={tripId} // force re-mount when tripId changes
            onSubmit={handleUpdateTrip}
            initialValues={initialValues}
            submitLabel="Update Trip"
          />
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
    </div>
  );
};

export default PlannerSidebar;
