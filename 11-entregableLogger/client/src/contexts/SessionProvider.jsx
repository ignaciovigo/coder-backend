import { createContext, useEffect, useState } from "react";
import CONSTANTS from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const SessionContext = createContext();

export default function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  console.log("state", currentUser, isAuthenticated);

  const getUserData = async () => {
    try {
      setIsLoading(true)
      if (!isAuthenticated) {
        const user = await fetch(CONSTANTS.USER_URL, {
          method: "GET",
          credentials: "include",
        });
        const userData = await user.json();
        if (userData?.status === "error") throw userData;
        setCurrentUser({ ...userData.payload });
        setIsAuthenticated(true);
      } else {
        return;
      }
    } catch (error) {
      setIsAuthenticated(false);
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  };

  const login = async (data) => {
    try {
      const resp = await fetch(CONSTANTS.LOGIN_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await resp.json();
      if (result.status === "error") throw result;
      await getUserData();
      navigate("/products");
      toast.success(result.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      if (!isAuthenticated) return;
      const resp = await fetch(CONSTANTS.LOGOUT_URL, {
        method: "GET",
        credentials: "include",
      });
      const result = await resp.json();
      if (result.status === "error") throw result;
      setCurrentUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <SessionContext.Provider
      value={{ currentUser, logout, login, isAuthenticated }}
    >
      {!isLoading && children}
    </SessionContext.Provider>
  );
}
