import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ImagesPage from "./pages/ImagesPage";
import StatusPage from "./pages/StatusPage";
import EquipmentPage from "./pages/EquipmentPage";
import SitesPage from "./pages/SitesPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/images" element={<ImagesPage />} />
            <Route path="/status" element={<StatusPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/equipment" replace />} />
          <Route path="*" element={<Navigate to="/equipment" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
