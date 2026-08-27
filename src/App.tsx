import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home/HomePage";
import { AdminPage } from "./pages/Admin/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
