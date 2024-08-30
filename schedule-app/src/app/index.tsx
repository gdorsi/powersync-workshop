import { createRoot } from "react-dom/client";
import { SystemProvider } from "../components/providers/SystemProvider";
import { MainPage } from "./page";

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

export function App() {
  return (
    <SystemProvider>
      <MainPage />
    </SystemProvider>
  );
}