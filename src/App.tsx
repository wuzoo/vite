import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import CreateAccount from "./routes/Create-account";
import Globalstyle from "./GlobalStyle";
import LoadingScreen from "./components/Loading-screen";
import auth from "./firebase";
import { styled } from "styled-components";
import ProtectedRoute from "./components/protected-route";
import EditModal from "./components/edit-modal";
import { RecoilRoot, useRecoilValue } from "recoil";
import { EditClicked } from "./atoms/atom";

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
`;

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <Home /> },
      { path: "profile", element: <Profile /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/create-account", element: <CreateAccount /> },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const init = async () => {
    // wait for firebase about user authentication
    await auth.authStateReady(); // auth 상태가 준비될때까지 기다리고, 최초 인증 상태가 완료될 때 실행되는 Promise를 리턴
    // firebase가 쿠키와 토큰을 읽을 시간
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <RecoilRoot>
      <EditModal />
      <Wrapper>
        <Globalstyle />
        {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
      </Wrapper>
    </RecoilRoot>
  );
}

export default App;
