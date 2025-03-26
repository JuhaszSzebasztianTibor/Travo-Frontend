import "./profile.css";
import TripCard from "./TripCard";

const UpcomingTrips = ({ trips }) => (
  <div>
    <h2>Upcoming Trips</h2>
    <div className="trip-cards-container">
      {trips.length > 0 ? (
        trips.map((trip) => <TripCard key={trip.id} trip={trip} />)
      ) : (
        <p>No upcoming trips</p>
      )}
    </div>
  </div>
);

export default UpcomingTrips;
