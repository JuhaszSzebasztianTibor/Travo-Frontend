import "./profile.css";
import TripCard from "./TripCard";

const PastTrips = ({ trips }) => (
  <div>
    <h2>Past Trips</h2>
    <div className="trip-cards-container">
      {trips.length > 0 ? (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
      ) : (
        <p>No past trips</p>
      )}
    </div>
  </div>
);

export default PastTrips;
