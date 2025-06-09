import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Chip,
  useTheme,
  Paper,
  InputAdornment,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Snackbar,
} from "@mui/material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
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
} from "../../layout/themes";
import "../../layout/style.scss";

import {
  Phone,
  WhatsApp,
  Email,
  LocationOn,
  Send,
  CheckCircle,
  Shop,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { GlobalStyles } from "../../layout/GlobalStyle";

import { getUser } from "../../utils/Helper";
import { useSelector } from "react-redux";

const ContactPage = () => {
  const navigate = useNavigate();
  const [themeMode, setThemeMode] = useState("light");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "basic";
    setThemeMode(savedTheme);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
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
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, ajoutez votre logique d'envoi (API, emailjs, etc.)
    console.log("Formulaire soumis:", formData);
    setOpenSnackbar(true);
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  const contactMethods = [
    {
      icon: <Phone fontSize="large" color="primary" />,
      title: "Appel Direct",
      value: "+243 81 234 5678",
      action: "tel:+243812345678",
      color: theme.palette.primary.main,
    },
    {
      icon: <WhatsApp fontSize="large" color="success" />,
      title: "WhatsApp",
      value: "+243 89 953 0506",
      action: "https://wa.me/243899530506",
      color: theme.palette.success.main,
    },
    {
      icon: <Email fontSize="large" color="secondary" />,
      title: "Email",
      value: "contact@niplan-market.cd",
      action: "mailto:contact@niplan-market.cd",
      color: theme.palette.secondary.main,
    },
    {
      icon: <LocationOn fontSize="large" color="error" />,
      title: "Bureau",
      value: "123 Av. Commerce, Kinshasa",
      action: "https://adamchrisk.vercel.app/",
      color: theme.palette.error.main,
    },
  ];

  return (
    <Emotion10ThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          {/* Navbar */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              //transition: "margin-left 0.3s",
              //marginLeft: { xs: 0, sm: desktopOpen ? `${drawerWidth}px` : 0 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppBar
              position="sticky"
              sx={{
                backgroundColor: theme.palette.background.default,
                backgroundImage: "none",
                borderBottomWidth: "1px",
                borderBottomStyle: "solid",
                borderBottomColor: theme.palette.background.paper,
              }}
              className="appbar"
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1, // Adds spacing between icon and text
                  }}
                >
                  <IconButton
                    size="large"
                    color="inherit"
                    sx={{ mr: 1 }}
                    onClick={() => navigate("/home")}
                  >
                    <Shop />
                  </IconButton>
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
                    onClick={() => navigate("/home")}
                  >
                    Niplan Market
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      display: {
                        xs: "inline",
                        lg: "none",
                        sm: "none",
                        md: "none",
                      },
                    }}
                    onClick={() => navigate("/home")}
                  >
                    Niplan
                  </Box>
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                {!getUser() && (
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </Button>
                )}
                {getUser() && (
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/auth");
                    }}
                  >
                    Logout
                  </Button>
                )}
              </Toolbar>
            </AppBar>

            <Box
              sx={{
                maxWidth: 1200,
                mx: "auto",
                p: { xs: 2, md: 4 },
                backgroundColor: theme.palette.background.default,
              }}
            >
              {/* En-tête */}
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.dark,
                  textAlign: "center",
                  mb: 4,
                }}
              >
                Contactez Notre Équipe
              </Typography>

              <Typography
                variant="subtitle1"
                sx={{
                  textAlign: "center",
                  mb: 5,
                  color: theme.palette.text.secondary,
                }}
              >
                Nous sommes disponibles 7j/7 de 8h à 20h pour vous accompagner
              </Typography>

              {/* Méthodes de contact */}
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {contactMethods.map((method, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box sx={{ mb: 2 }}>{method.icon}</Box>
                      <Typography
                        variant="h6"
                        sx={{ mb: 1, fontWeight: "medium" }}
                      >
                        {method.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          color: method.color,
                          fontWeight: "bold",
                        }}
                      >
                        {method.value}
                      </Typography>
                      <Button
                        variant="outlined"
                        href={method.action}
                        target="_blank"
                        sx={{
                          mt: "auto",
                          borderColor: method.color,
                          color: method.color,
                          "&:hover": {
                            backgroundColor: `${method.color}10`,
                            borderColor: method.color,
                          },
                        }}
                      >
                        Contacter
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 5 }}>
                <Chip label="OU" />
              </Divider>

              {/* Formulaire de contact */}
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  maxWidth: 700,
                  mx: "auto",
                  p: { xs: 2, md: 4 },
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Send fontSize="medium" /> Envoyez-nous un message
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Votre nom complet"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Numéro de téléphone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+243</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adresse email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Votre message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      multiline
                      rows={4}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontWeight: "bold",
                      }}
                    >
                      Envoyer le message
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Confirmation d'envoi */}
              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  icon={<CheckCircle fontSize="inherit" />}
                  severity="success"
                  variant="filled"
                  sx={{ width: "100%" }}
                >
                  Message envoyé! Nous vous répondrons sous 24h.
                </Alert>
              </Snackbar>
              <Divider sx={{ my: 5 }} />
              <Typography
                variant="body2"
                color="text.secondary"
                mt={5}
                textAlign="center"
                onClick={() => navigate("/home")}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                © {new Date().getFullYear()} - Niplan Market. Tous droits
                réservés.
              </Typography>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Emotion10ThemeProvider>
  );
};

export default ContactPage;
