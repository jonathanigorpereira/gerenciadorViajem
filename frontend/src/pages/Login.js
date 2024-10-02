import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { FaGoogle } from "react-icons/fa";

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1a1a2e;
  padding: 0;
  margin: 0;
  overflow: hidden;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const LoginForm = styled.div`
  background-color: #162447;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  color: #e9f5e9;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 30px;
    max-width: 90%;
  }

  @media (max-width: 480px) {
    padding: 20px;
    max-width: 100%;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #e0e0e0;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #0f3460;
  background-color: #1b1b2f;
  color: white;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: #3282b8;
    outline: none;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background-color: #0f3460;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #3282b8;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 14px;
  }
`;

const GoogleButton = styled(Button)`
  background-color: #db4437;
  margin-top: 15px;

  &:hover {
    background-color: #c23321;
  }

  svg {
    margin-right: 10px;
  }
`;

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-top: 8px solid #ffffff;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: ${spin} 0.8s linear infinite;
`;

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Login = ({ onLogin }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsVisible(false);
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsVisible(false);
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "http://localhost:3333/api/v1/auth/google";
    }, 500);
  };

  return (
    <Container isVisible={isVisible}>
      {!isLoading ? (
        <LoginForm>
          <Title>Login</Title>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Input type="text" placeholder="Email" required />
            <Input type="password" placeholder="Senha" required />
            <Button type="submit">Entrar</Button>
          </form>
          <GoogleButton onClick={handleGoogleLogin}>
            <FaGoogle size={20} />
            Login com Google
          </GoogleButton>
        </LoginForm>
      ) : (
        <Loader>
          <Spinner /> {/* Spinner maior e com mais contraste */}
        </Loader>
      )}
    </Container>
  );
};

export default Login;
