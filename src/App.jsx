import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout/Layout.jsx";
import Home from "./pages/Home/Home.jsx";
import Login from "./pages/AuthPage/Login.jsx";
import Signup from "./pages/AuthPage/Signup.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
