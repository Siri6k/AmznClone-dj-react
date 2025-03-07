import React, { useEffect, useState } from "react";

import {
  TextField,
  Button,
  Tab,
  Tabs,
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  LinearProgress,
} from "@mui/material";

import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            {selectedTab === 0 ? "Login" : "Signup"}
          </Typography>

          <Tabs value={selectedTab} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Signup" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {selectedTab === 0 ? <LoginForm /> : <SignupForm />}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { callApi, error, loading } = useApi();

  const doLogin = async (e) => {
    e.preventDefault();
    // Call the login API
    let response = await callApi({
      url: "http://localhost:8000/api/auth/login/",
      method: "POST",
      body: {
        username: e.target.username.value,
        password: e.target.password.value,
      },
    });
    if (response?.data?.access) {
      localStorage.setItem("token", response.data.access);
      toast.success("Login successfully");
      navigate("/home");
    } else {
      toast.error("Invalid Credentials");
    }
    console.log(response);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <form onSubmit={doLogin}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          margin="normal"
          variant="outlined"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        {loading ? (
          <LinearProgress style={{ width: "100%" }} />
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        )}
      </form>
    </Box>
  );
};

const SignupForm = () => {
  const navigate = useNavigate();
  const { callApi, error, loading } = useApi();

  const doSignup = async (e) => {
    e.preventDefault();
    // Call the login API
    let response = await callApi({
      url: "http://localhost:8000/api/auth/signup/",
      method: "POST",
      body: {
        username: e.target.username.value,
        password: e.target.password.value,
        email: e.target.email.value,
        profile_pic:
          "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png",
      },
    });
    if (response?.data?.access) {
      localStorage.setItem("token", response.data.access);
      toast.success("Signup successfully");
      navigate("/home");
    } else {
      toast.error("Signup failed");
    }
    console.log(response);
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <form onSubmit={doSignup}>
        <TextField
          label="Username"
          name="username"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          name="email"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        {loading ? (
          <LinearProgress style={{ width: "100%" }} />
        ) : (
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Signup
          </Button>
        )}
      </form>
    </Box>
  );
};

export default AuthScreen;
