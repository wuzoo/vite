import { Navigate } from "react-router-dom";
import auth from "../firebase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser; // return User | null
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
