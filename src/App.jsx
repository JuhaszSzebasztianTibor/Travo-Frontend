import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";
import PlannerLayout from "./layouts/PlannerLayout/PlannerLayout.jsx";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/AuthPage/Login.jsx";
import Signup from "./pages/AuthPage/Signup.jsx";
import Profile from "./pages/ProfilePage/ProfilePage.jsx";
import PlannerPage from "./pages/PlannerPage/PlannerPage.jsx";
import BudgetPage from "./pages/BudgetPage/BudgetPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/*Main layout*/}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />}>
            {/*<Route path="/profile/trip" />*/}
          </Route>
        </Route>

        <Route element={<PlannerLayout />}>
          <Route path="/trip/plan" element={<PlannerPage />} />
          <Route path="/trip/budget" element={<BudgetPage />} />
          <Route path="/trip/packing" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
