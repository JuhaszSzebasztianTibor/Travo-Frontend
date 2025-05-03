import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { login } from "../../services/auth/authService";
import { isAuthenticated } from "../../utils/auth";
import "./Auth.css";
import authImage from "../../assets/Images/auth.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [generalError, setGeneral] = useState("");
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/profile" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMessage("");
    setGeneral("");

    try {
      await login(email, password);
      navigate("/profile");
    } catch (error) {
      if (error.email || error.password) {
        setFieldErrors(error);
      } else if (error.general) {
        setErrorMessage(error.general);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-image">
          <img src={authImage} alt="Login" />
        </div>

        <div className="auth-form">
          <h1>Login</h1>
          {generalError && <p className="error-message">{generalError}</p>}

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {fieldErrors.email && (
              <div className="field-error">{fieldErrors.email}</div>
            )}

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {fieldErrors.password && (
              <div className="field-error">{fieldErrors.password}</div>
            )}

            <p>
              <Link to="/signup" className="auth-link">
                Don't have an account?
              </Link>
            </p>
            <button className="auth-button" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
