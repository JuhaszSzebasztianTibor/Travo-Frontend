import Navbar from "../../components/Navbar/Navbar";
import "./layout.css";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container">{children}</main>
    </>
  );
};

export default MainLayout;
