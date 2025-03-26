import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import "./mainLayout.css";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main-layout-container">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
