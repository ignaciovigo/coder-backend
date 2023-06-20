import { useContext } from "react";
import { SessionContext } from "../contexts/SessionProvider";

export const useAuth = () => {
    const currentUser = useContext(SessionContext);
    if (currentUser === undefined) {
      throw new Error("useAuth must be used within a SessionProvider");
    }
    return currentUser;
  };