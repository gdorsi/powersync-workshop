import { createRoot } from "react-dom/client";
import { SystemProvider } from "@/2_SystemProvider";
import { Schedule } from "@/4_Schedule";

import "./styles.css";

const root = createRoot(document.getElementById("app")!);
root.render(<App />);

export function App() {
  return (
    <SystemProvider>
      <Schedule />
    </SystemProvider>
  );
}
