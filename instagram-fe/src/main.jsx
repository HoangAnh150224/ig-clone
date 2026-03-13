import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store";
import App from "./App.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ReduxProvider store={store}>
            <ChakraProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </BrowserRouter>
            </ChakraProvider>
        </ReduxProvider>
    </StrictMode>,
);
