import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import App from "./App.jsx";
import "./index.css";
import { currentUser } from "./api/dummyData";

// Automatically restore user info to localStorage if deleted (Used for development)
if (!localStorage.getItem("user")) {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("token", "mock_jwt_token_12345");
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <ChakraProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ChakraProvider>
        </ReduxProvider>
    </StrictMode>,
);
