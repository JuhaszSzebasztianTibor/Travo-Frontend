import { Outlet } from "react-router-dom";
import PlannerSidebar from "../../components/PlannerSidebar/PlannerSidebar.jsx";

import "./plannerLayout.css";

const PlannerLayout = () => {
  return (
    <>
      <div className="planner-layout-container">
        <PlannerSidebar />
        <main className="main-plannerlayout-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default PlannerLayout;
