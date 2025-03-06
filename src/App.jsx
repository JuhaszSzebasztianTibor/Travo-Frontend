import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/AuthPage/Login.jsx";
import Signup from "./pages/AuthPage/Signup.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
