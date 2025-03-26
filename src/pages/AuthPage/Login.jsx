import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // Import the CSS file
import authImage from "../../assets/Images/auth.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in:", { email, password });
    navigate("/profile"); // Redirect after login
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
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p>
              <Link to="/signup" className="auth-link">
                Dont have an acount?
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
