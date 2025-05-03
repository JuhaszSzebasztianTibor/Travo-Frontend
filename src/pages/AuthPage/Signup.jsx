import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth/authService";
import "./Auth.css";
import authImage from "../../assets/Images/auth.jpg";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneral] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneral("");

    try {
      await register({ firstName, lastName, email, password });
      navigate("/login");
    } catch (error) {
      // field-specific
      const hasFieldErr = ["firstname", "lastname", "email", "password"].some(
        (key) => error[key]
      );
      if (hasFieldErr) {
        setFieldErrors(error);
      } else if (error.general) {
        setGeneral(error.general);
      } else {
        setGeneral("An unknown error occurred");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <div className="auth-image">
          <img src={authImage} alt="Signup" />
        </div>
        <div className="auth-form">
          <h1>Sign Up</h1>

          {generalError && <p className="error-message">{generalError}</p>}

          <form onSubmit={handleSignup}>
            <div className="name-container">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                {fieldErrors.firstname && (
                  <div className="field-error">{fieldErrors.firstname}</div>
                )}
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                {fieldErrors.lastname && (
                  <div className="field-error">{fieldErrors.lastname}</div>
                )}
              </div>
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {fieldErrors.email && (
                <div className="field-error">{fieldErrors.email}</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {fieldErrors.password && (
                <div className="field-error">{fieldErrors.password}</div>
              )}
            </div>

            <p>
              <Link to="/login" className="auth-link">
                Already have an account?
              </Link>
            </p>
            <button className="auth-button" type="submit">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
