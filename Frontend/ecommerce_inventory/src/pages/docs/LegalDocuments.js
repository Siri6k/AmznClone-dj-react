import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  Toolbar,
  useMediaQuery,
  Typography,
  createTheme,
  useTheme,
  Card,
  CardMedia,
  TextField,
  ThemeProvider,
  CardContent,
  CardActions,
  Menu,
  CircularProgress,
  MenuItem,
  ListItemIcon,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
import "../../layout/style.scss";
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
import { GlobalStyles } from "../../layout/GlobalStyle";
import {
  AutoAwesomeTwoTone,
  Settings as SettingsIcon,
  Circle,
  Shop,
  ExpandMore,
  Article,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/Helper";

const LegalDocuments = () => {
  const [expanded, setExpanded] = useState(null);

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true); // State for desktop sidebar
  const [themeMode, setThemeMode] = useState("light");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    if (window.innerWidth >= 960) {
      setDesktopOpen(!desktopOpen); // Toggle desktop sidebar only when in desktop view
    } else {
      setMobileOpen(!mobileOpen);
    }
  };

  const toggleTheme = () => {
    const newTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const saveTheme = (themeI) => {
    setThemeMode(themeI.name.toLowerCase());
    localStorage.setItem("theme", themeI.name.toLowerCase());
  };
  const handleThemeMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleThemeMenuClose = () => {
    setAnchorEl(null);
  };

  const themeMenuItems = [
    {
      name: "Basic",
      color: "rgba(159, 84, 252, 1)",
      theme: basicTheme,
    },
    {
      name: "Dark",
      color: "rgba(17, 17, 17, 1)",
      theme: darkTheme,
    },
    {
      name: "Light",
      color: "rgba(159, 84, 252, 1)",
      theme: lightTheme,
    },
    {
      name: "Custom",
      color: "rgba(159, 84, 252, 1)",
      theme: customTheme,
    },
    {
      name: "Blue Light",
      color: "rgba(135, 206, 250, 1)",
      theme: blueLightTheme,
    },
    {
      name: "Blue Dark",
      color: "rgba(0, 0, 255, 1)",
      theme: blueDarkTheme,
    },
    {
      name: "Green Light",
      color: "rgba(144, 238, 144, 1)",
      theme: greenLightTheme,
    },
    {
      name: "Green Dark",
      color: "rgba(0, 100, 0, 1)",
      theme: greenDarkTheme,
    },
    {
      name: "Red Light",
      color: "rgba(255, 192, 203, 1)",
      theme: redLightTheme,
    },
    {
      name: "Red Dark",
      color: "rgba(139, 0, 0, 1)",
      theme: redDarkTheme,
    },
    {
      name: "Orange Light",
      color: "rgba(255, 222, 173, 1)",
      theme: orangeLightTheme,
    },
    {
      name: "Orange Dark",
      color: "rgba(255, 140, 0, 1)",
      theme: orangeDarkTheme,
    },
  ];

  const themeMenuUI = (
    <Menu
      id="theme-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleThemeMenuClose}
      onClick={handleThemeMenuClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <Typography variant="inherit">Theme Setting</Typography>
      </MenuItem>
      <Divider />

      {themeMenuItems.map((themeMenu) => (
        <MenuItem onClick={() => saveTheme(themeMenu)} key={themeMenu.name}>
          <ListItemIcon>
            <Circle sx={{ color: themeMenu.color }} />
          </ListItemIcon>
          <Typography variant="inherit">{themeMenu.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Données simulées - À remplacer par vos vrais textes
  const legalDocs = [
    {
      id: "conditions",
      title: "Conditions Générales de Vente",
      content: (
        <>
          <Typography paragraph>
            <strong>Version applicable au 01/01/2024</strong>
          </Typography>
          <Typography paragraph>
            Ces conditions régissent les ventes sur Maisha Market en RDC. Tout
            achat implique l'acceptation sans réserve des présentes CGV.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Article 1 - Prix
          </Typography>
          <Typography paragraph>
            Les prix sont indiqués en francs congolais (CDF) et incluent les
            taxes applicables.
          </Typography>
          {/* ... Autres articles ... */}
        </>
      ),
    },
    {
      id: "confidentialite",
      title: "Politique de Confidentialité",
      content: (
        <>
          <Typography paragraph>
            Conformément au Règlement ARPTC sur la protection des données
            personnelles.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Données collectées
          </Typography>
          <Typography paragraph>
            Nous collectons votre numéro de téléphone pour les transactions et
            la livraison.
          </Typography>
          {/* ... Autres sections ... */}
        </>
      ),
    },
    {
      id: "cookies",
      title: "Politique d'Utilisation des Cookies",
      content: (
        <>
          <Typography paragraph>
            Ce site utilise des cookies strictement nécessaires au
            fonctionnement.
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Authentification</li>
            <li>Préférences linguistiques</li>
            <li>Sécurité</li>
          </Box>
        </>
      ),
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
                <IconButton
                  className="theme-icon"
                  color="inherit"
                  aria-label="theme"
                  onClick={handleThemeMenuOpen}
                >
                  <AutoAwesomeTwoTone />
                </IconButton>
              </Toolbar>
            </AppBar>
            {themeMenuUI}

            {/* Main Content */}
            <Box
              sx={{
                maxWidth: 800,
                mx: "auto",
                p: 3,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: 1,
                my: "auto",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  color: theme.palette.primary.main,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Article fontSize="large" /> Mentions Légales
              </Typography>

              <Typography paragraph sx={{ mb: 3 }}>
                Documents conformes à la législation congolaise (Loi n°17/001
                sur le commerce électronique)
              </Typography>

              {legalDocs.map((doc) => (
                <Accordion
                  key={doc.id}
                  expanded={expanded === doc.id}
                  onChange={handleChange(doc.id)}
                  sx={{ mb: 2 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    <Typography fontWeight="bold">{doc.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Divider sx={{ mb: 2 }} />
                    {doc.content}
                    {doc.id === "conditions" && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, fontStyle: "italic" }}
                      >
                        Consultez la version complète sur{" "}
                        <Link href="#" target="_blank">
                          ce lien PDF
                        </Link>
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}

              <Typography
                variant="body2"
                sx={{ mt: 3, color: "text.secondary", textAlign: "center" }}
              >
                Dernière mise à jour : {new Date().toLocaleDateString("fr-CD")}
              </Typography>
            </Box>

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                borderTop: 1,
                borderColor: "divider",
                py: 2,
                textAlign: "center",
                mt: "auto",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
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

export default LegalDocuments;
