import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { LoginPage } from "./components/LoginPage";
import { HomePage } from "./components/HomePage";

function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/*" element={<HomePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
