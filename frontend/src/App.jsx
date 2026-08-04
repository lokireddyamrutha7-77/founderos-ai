import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Workspace from "./pages/Workspace";
import Login from "./pages/Login";
import Memory from "./pages/Memory";

// Wraps any route that requires the user to be logged in. If auth is still
// loading, show a simple loading state. If there's no user, redirect to
// /login instead of rendering the protected page.
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-20 text-neutral-400">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memory"
            element={
              <ProtectedRoute>
                <Memory />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
