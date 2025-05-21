import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout.jsx";
import PlannerLayout from "./layouts/PlannerLayout/PlannerLayout.jsx";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/AuthPage/Login.jsx";
import Signup from "./pages/AuthPage/Signup.jsx";
import Profile from "./pages/ProfilePage/ProfilePage.jsx";
import PlannerPage from "./pages/PlannerPage/PlannerPage.jsx";
import BudgetPage from "./pages/BudgetPage/BudgetPage.jsx";
import PackingPage from "./pages/PackingPage/PackingPage.jsx";
import ProtectedRoute from "./hooks/ProtectedRoute.jsx";
import PublicOnlyRoute from "./hooks/PublicOnlyRoute.jsx";
import ViewPage from "./pages/ViewPage/viewPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/*Main layout*/}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PublicOnlyRoute>
                <Home />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          ></Route>
        </Route>

        <Route element={<PlannerLayout />}>
          <Route
            path="/trip/view/:tripId"
            element={
              <ProtectedRoute>
                <ViewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/plan/:tripId"
            element={
              <ProtectedRoute>
                <PlannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/budget/:tripId"
            element={
              <ProtectedRoute>
                <BudgetPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip/packing/:tripId"
            element={
              <ProtectedRoute>
                <PackingPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
