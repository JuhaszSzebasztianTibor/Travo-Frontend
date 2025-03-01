import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import authImage from "../../assets/Images/auth.jpg"; // Import the CSS file

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signing up:", { firstName, lastName, email, password });
    navigate("/"); // Redirect after signup
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side - Image */}
        <div className="auth-image">
          <img src={authImage} alt="Signup" />
        </div>

        {/* Right Side - Form */}
        <div className="auth-form">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <div className="name-container">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
