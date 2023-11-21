import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/login";
import CreateAccount from "./routes/Create-account";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <Home /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/create-account", element: <CreateAccount /> },
]);

// const Globalstyle = createGlobalStyle`
//   ${reset}
//   * {
//       box-sizing: border-box;
//     }
//   body {
//     background-color: black;
//     color: white;
//     font-family: 'system-ui', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
// }
// `;

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
