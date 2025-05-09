import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Toolbar,
  useMediaQuery,
  Typography,
  createTheme,
  useTheme,
  Card,
  CardMedia,
  ThemeProvider,
  CardContent,
  CardActions,
  CircularProgress,
  MenuItem,
  ListItemIcon,
  Breadcrumbs,
} from "@mui/material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
import "../layout/style.scss";
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
import logo from "../assets/logo.svg";
import { GlobalStyles } from "../layout/GlobalStyle";
import {
  Save,
  ShoppingCart,
  Search,
  Menu,
  AutoAwesomeTwoTone,
  Settings as SettingsIcon,
  Circle,
  Shop,
} from "@mui/icons-material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HomePage = ({ user_id }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { error, loading, callApi } = useApi();
  const [loaded, setLoaded] = useState(false);
  const handleLoad = () => {
    setLoaded(true);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProduct();
  }, []);

  const getAllProduct = useCallback(async () => {
    if (!hasMore || loading) return;
    let order = "-id";
    /*if (ordering && ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }*/
    const result = await callApi({
      url: `products/all/`,
      method: "GET",
      params: {
        page: page,
        pageSize: 12,
        // search: debounceSearch,
        ordering: order,
      },
    });
    if (result) {
      const fetchData = result.data.data.data || [];
      setProducts((prev) => [...prev, ...fetchData]);
      setPage((prev) => prev + 1);
    }
  }, [page, hasMore, loading, callApi]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    getAllProduct();
  }, [getAllProduct]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true); // State for desktop sidebar
  const [themeMode, setThemeMode] = useState("light");
  const [openChildMenu, setOpenChildMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMenu, setThemeMenu] = useState(null);

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
    console.log(event.currentTarget);
    setThemeMenu(event.currentTarget);
  };
  const handleThemeMenuClose = () => {
    setThemeMenu(null);
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
      anchorEl={themeMenu}
      open={Boolean(themeMenu)}
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
              //transition: "margin-left",
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
                  <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
                    <Shop />
                  </IconButton>
                  <Box
                    component="span"
                    sx={{ display: { xs: "none", sm: "inline" } }}
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
                  >
                    Niplan
                  </Box>
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton size="large" color="inherit">
                    <Search />
                  </IconButton>
                  <IconButton size="large" color="inherit">
                    <ShoppingCart />
                  </IconButton>
                  <Button
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={() => navigate("/auth")}
                  >
                    Login
                  </Button>
                  <IconButton
                    className="theme-icon"
                    color="inherit"
                    aria-label="theme"
                    onClick={handleThemeMenuOpen}
                  >
                    <AutoAwesomeTwoTone />
                  </IconButton>
                </Box>
              </Toolbar>
            </AppBar>
            {themeMenu && themeMenuUI}

            {/* Main Content */}
            <Container
              className="main-content"
              maxWidth="xl"
              sx={{ flex: 1, padding: "20px" }}
            >
              <Breadcrumbs aria-label="breadcrumb">
                <Typography variant="body2" onClick={() => navigate("/home")}>
                  Featured Products
                </Typography>
              </Breadcrumbs>
              <Divider sx={{ mb: 2, mt: 2 }} />
              <Grid container spacing={4}>
                {products.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      {!loaded && <CardMedia className="shimmer" />}
                      {
                        <CardMedia
                          component="img"
                          image={
                            product.image[0] ||
                            "https://via.placeholder.com/300"
                          }
                          alt={product.name}
                          sx={{ height: 200, objectFit: "cover" }}
                          onLoad={handleLoad}
                        />
                      }
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {product.name}
                        </Typography>
                        <Typography>
                          {product.description?.substring(0, 100)}...
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                          $ {product.initial_selling_price}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="primary">
                          Add to Cart
                        </Button>
                        <Button size="small" color="secondary">
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                  <CircularProgress />
                </Box>
              )}

              {!hasMore && (
                <Typography variant="body1" align="center" sx={{ my: 4 }}>
                  No more products to load
                </Typography>
              )}
            </Container>

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
              <Typography variant="body2" color="text.secondary">
                Niplan - Version 1.0.0 (2025)
              </Typography>
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </Emotion10ThemeProvider>
  );
};

export default HomePage;
