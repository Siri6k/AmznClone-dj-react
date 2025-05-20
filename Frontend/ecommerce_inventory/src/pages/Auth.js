import React, { useState, useMemo, useEffect } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
  Checkbox,
  ThemeProvider,
  Link,
  FormControlLabel,
  createTheme,
  LinearProgress,
} from "@mui/material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
import { useTheme } from "@mui/system";
import {
  orangeDarkTheme,
  orangeLightTheme,
  basicTheme,
  darkTheme,
  lightTheme,
  customTheme,
  blueLightTheme,
  blueDarkTheme,
  greenLightTheme,
  greenDarkTheme,
  redLightTheme,
  redDarkTheme,
} from "../layout/themes";
import { GlobalStyles } from "../layout/GlobalStyle";
import { useNavigate } from "react-router-dom";
import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducer/isLoggedInReducer";
import { FormProvider, useForm } from "react-hook-form";

import defaultImg from "../assets/profile_default.png";

const Auth = () => {
  const [tab, setTab] = useState(0);
  const [themeMode, setThemeMode] = useState("basic");
  const navigate = useNavigate();
  const { callApi, error, loading } = useApi();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "basic";
    setThemeMode(savedTheme);
  }, []);

  let theme = useMemo(() => {
    switch (themeMode) {
      case "basic":
        return createTheme(basicTheme);
      case "dark":
        return createTheme(darkTheme);
      case "light":
        return createTheme(lightTheme);
      case "custom":
        return createTheme(customTheme);
      case "blue light":
        return createTheme(blueLightTheme);
      case "blue dark":
        return createTheme(blueDarkTheme);
      case "green light":
        return createTheme(greenLightTheme);
      case "green dark":
        return createTheme(greenDarkTheme);
      case "red light":
        return createTheme(redLightTheme);
      case "red dark":
        return createTheme(redDarkTheme);
      case "orange light":
        return createTheme(orangeLightTheme);
      case "orange dark":
        return createTheme(orangeDarkTheme);
      default:
        return createTheme(lightTheme);
    }
  }, [themeMode]);

  const goHome = () => {
    navigate("/ReactMUIDashboard/");
  };

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const doLogin = async (e) => {
    e.preventDefault();
    // Call the login API
    let response = await callApi({
      url: "auth/login/",
      method: "POST",
      body: {
        username: e.target.username.value,
        password: e.target.password.value,
      },
    });
    if (response?.data?.access) {
      localStorage.setItem("token", response.data.access);
      toast.success("Login successfully");
      dispatch(login());
      navigate("/dashboard");
    } else {
      toast.error("Invalid Credentials");
    }
    console.log(response);
  };

  const doSignup = async (data) => {
    let response = await callApi({
      url: "auth/signup/",
      method: "POST",
      body: {
        username: data.username,
        password: data.password,
        email: data.email,
        profile_pic: [
          "https://niplan-drc.s3.amazonaws.com/uploads/0c96e58f828bd11700054ecbdce3ff426deddbadda620c51_profile_default.png",
        ],
      },
    });
    if (response?.data?.access) {
      localStorage.setItem("token", response.data.access);
      toast.success("Signup successfully");
      dispatch(login());
      dispatch(login());
      navigate("/dashboard");
    } else {
      toast.error("Signup failed");
    }
    console.log(response);
  };

  return (
    <Emotion10ThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Card sx={{ maxWidth: 400, width: "100%" }}>
            <CardContent>
              <Box
                sx={{ display: "flex", justifyContent: "center", mb: 2 }}
                onClick={() => navigate("/home")}
              >
                <img
                  src={"https://picsum.photos/100"}
                  alt="Logo"
                  style={{ borderRadius: "50%" }}
                />
              </Box>
              <Typography
                variant="h5"
                align="center"
                onClick={() => navigate("/home")}
                gutterBottom
              >
                Niplan
              </Typography>
              <Tabs value={tab} onChange={handleChange} centered>
                <Tab label="Sign In" />

                <Tab label="Sign Up" />
              </Tabs>
              {tab === 0 && (
                <Box component="form" sx={{ mt: 2 }} onSubmit={doLogin}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email/Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                  />
                  {loading ? (
                    <LinearProgress sx={{ width: "100%" }} />
                  ) : (
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                  )}
                </Box>
              )}
              {tab === 1 && (
                <Box
                  component="form"
                  sx={{ mt: 2 }}
                  onSubmit={handleSubmit(doSignup)}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                      maxLength: {
                        value: 20,
                        message: "Password must be less than 20 characters",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    onChange={(e) => {
                      const value = e.target.value;
                      clearErrors("password");
                      if (value.length < 8) {
                        setError("password", {
                          type: "manual",
                          message: "Password must be at least 8 characters",
                        });
                      } else if (value.length > 20) {
                        setError("password", {
                          type: "manual",
                          message: "Password must be less than 20 characters",
                        });
                      } else {
                        clearErrors("password");
                      }
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmpassword"
                    type="password"
                    {...register("confirmpassword", {
                      required: "Confirm Password is required",
                    })}
                    error={!!errors.confirmpassword}
                    helperText={errors.confirmpassword?.message}
                    onChange={(e) => {
                      const value = e.target.value;
                      clearErrors("confirmpassword");
                      if (value !== watch("password")) {
                        setError("confirmpassword", {
                          type: "manual",
                          message: "Passwords do not match",
                        });
                      } else {
                        clearErrors("confirmpassword");
                      }
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...register("terms", {
                          required: "You must agree to the terms and policies",
                        })}
                        color="primary"
                      />
                    }
                    label={
                      <span>
                        I agree to the{" "}
                        <span
                          style={{
                            color: theme.palette.primary.main,
                            fontWeight: "bold",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/policies")}
                        >
                          Terms and Policies
                        </span>
                      </span>
                    }
                  />

                  {errors.terms && (
                    <p style={{ color: "red" }}>{errors.terms.message}</p>
                  )}
                  {loading ? (
                    <LinearProgress sx={{ width: "100%" }} />
                  ) : (
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign Up
                    </Button>
                  )}
                </Box>
              )}
            </CardContent>
            <Box
              sx={{
                textAlign: "center",
                py: 2,
                borderTop: "1px solid",
                borderColor: theme.palette.divider,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © 2025 Niplan. All rights reserved.
              </Typography>
            </Box>
          </Card>
        </Box>
      </ThemeProvider>
    </Emotion10ThemeProvider>
  );
};

export default Auth;
