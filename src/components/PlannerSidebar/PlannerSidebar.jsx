import React from "react";
import { Link } from "react-router-dom";

import Plane from "../../assets/Images/travoplane.png";
import "./plannerSidebar.css";

const PlannerSidebar = () => {
  return (
    <div className="planner-sidebar">
      <Link to="/profile">
        <img src={Plane} alt="Plane" className="plane-img" />
      </Link>
      <ul>
        <li>
          <Link to="trip/view">
            <i className="fa fa-eye"></i> <span>View</span>
          </Link>
        </li>
        <li>
          <Link to="trip/plan">
            <i className="fas fa-map-marker-alt"></i> <span>Plan</span>
          </Link>
        </li>
        <li>
          <Link to="trip/budget">
            <i className="fas fa-wallet"></i> <span>Budget</span>
          </Link>
        </li>
        <li>
          <Link to="trip/packing">
            <i className="fa fa-shirt"></i> <span>Packing</span>
          </Link>
        </li>
        <li>
          <Link to="trip/edit">
            <i className="fas fa-edit"></i>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PlannerSidebar;
