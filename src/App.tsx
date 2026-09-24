import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Scan from "./pages/Scan";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Toaster theme="dark" position="top-center" />
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
