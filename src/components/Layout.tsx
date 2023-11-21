import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h2>This is Layout</h2>
      <Outlet />
    </>
  );
}
