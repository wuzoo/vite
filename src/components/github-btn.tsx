import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import auth from "../firebase";

const Button = styled.span`
  margin-top: 50px;
  width: 100%;
  background-color: white;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  color: black;
  cursor: pointer;
`;
const Logo = styled.img`
  height: 25px;
`;
export default function GithubButton() {
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github.svg" />
      Continue with Github
    </Button>
  );
}
