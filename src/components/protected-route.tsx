import { redirect } from "react-router-dom";
import auth from "../firebase";

export function loader() {
  const user = auth.currentUser; // return User | null
  console.log(user);

  if (user === null) {
    return redirect("/login");
  }
  return null;
}
