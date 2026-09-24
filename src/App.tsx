import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Scan from "./pages/Scan";
import NotFound from "./pages/NotFound";

// Embedded builds (e.g. a sandboxed preview host) can't use real URL paths.
const Router = import.meta.env.VITE_ROUTER === "memory" ? MemoryRouter : BrowserRouter;

const App = () => (
  <Router>
    <Toaster theme="dark" position="top-center" />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
