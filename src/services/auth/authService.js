import api from "../../api/api";

export const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (err) {
    // If we got a structured errors object back
    if (err.response?.data?.errors) {
      const formatted = {};
      Object.entries(err.response.data.errors).forEach(([field, msgs]) => {
        // join array into single string
        formatted[field.toLowerCase()] = Array.isArray(msgs)
          ? msgs.join("\n")
          : msgs;
      });
      throw formatted;
    }
    // fallback general
    throw { general: err.message || "Registration failed" };
  }
};

export const login = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    window.dispatchEvent(new Event("authChange"));
    return data.user;
  } catch (err) {
    // If backend returned a structured { errors } object:
    if (err.response?.data?.errors) {
      const formatted = {};
      Object.entries(err.response.data.errors).forEach(([field, msgs]) => {
        formatted[field.toLowerCase()] = Array.isArray(msgs)
          ? msgs.join(", ")
          : msgs;
      });
      throw formatted; // e.g. { email: "...", password: "..." }
    }
    // Fallback general error:
    throw { general: err.message || "Login failed" };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("authChange"));
};
