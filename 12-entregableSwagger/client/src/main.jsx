import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import SessionProvider from "./contexts/SessionProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <SessionProvider>
            <App />
        </SessionProvider>
    </BrowserRouter>
);
