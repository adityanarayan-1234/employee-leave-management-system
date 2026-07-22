import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/employees/me")
      .then((res) => setEmployee(res.data.employee))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("employee");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, employeeData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("employee", JSON.stringify(employeeData));
    setEmployee(employeeData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("employee");
    setEmployee(null);
  };

  const value = {
    employee,
    isAuthenticated: !!employee,
    isAdmin: employee?.role === "admin",
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
