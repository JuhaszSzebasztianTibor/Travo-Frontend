import React from "react";
import { Link, useParams } from "react-router-dom"; // import useParams to get the tripId from the URL
import Plane from "../../assets/Images/travoplane.png";
import "./plannerSidebar.css";

const PlannerSidebar = () => {
  const { tripId } = useParams(); // Assuming tripId is part of the URL

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
          <Link to={`/trip/edit/${tripId}`}>
            <i className="fas fa-edit"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PlannerSidebar;
