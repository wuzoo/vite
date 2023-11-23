import { styled } from "styled-components";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../firebase";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 200px 0px;
`;
const Form = styled.form`
  margin-top: 50px;
  margin-bottom: 10px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;
  &[type="submit"] {
    cursor: pointer;
    &: hover {
      opacity: 0.8;
    }
  }
`;
const Title = styled.h1`
  font-size: 42px;
`;
const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;
const Switcher = styled.div`
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    if (isLoading || email === "" || password === "") return;
    try {
      setIsLoading(true);
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credential);
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setIsLoading(false);
    }
    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Login into X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
          onChange={onChange}
        />
        <Input
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
          onChange={onChange}
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Log in"} />
      </Form>
      {error !== "" ? <Error>{error.split("Firebase:")}</Error> : ""}
      <Switcher>
        Don't you have a account ?{" "}
        <Link to="/create-account">Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
