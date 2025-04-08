import "./profile.css";
import { formatDate } from "../../utils/formDate";

const TripCard = ({ trip }) => {
  return (
    <div className="trip-card">
      <img src={trip.image} alt={trip.destination} className="trip-image" />
      <div className="trip-card-content">
        <div className="trip-card-header">
          <h3>{trip.destination}</h3>
          <p>{formatDate(trip.date)}</p>
        </div>
        <p>{trip.description}</p>
      </div>
    </div>
  );
};

export default TripCard;
