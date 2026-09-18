import { createRoot } from "react-dom/client";
import { bootI18n } from "./i18n";
import App from "./App";
import "./index.css";

await bootI18n();
createRoot(document.getElementById("root")!).render(<App />);
