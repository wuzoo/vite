import { Navigate } from "react-router-dom";
import auth from "../firebase";
// import { getRedirectResult, GithubAuthProvider } from "firebase/auth";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = auth.currentUser;

  // getRedirectResult(auth).then((result: any) => {
  //   const credential = GithubAuthProvider.credentialFromResult(result);

  //   // The signed-in user info.
  //   if (credential) {
  //     user = result.user;
  //   }
  // });

  // Redirect로 깃헙 로그인을 할 시에는 token을 활용해야 함.

  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
