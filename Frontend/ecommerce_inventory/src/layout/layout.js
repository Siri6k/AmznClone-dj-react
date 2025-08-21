import React, { useState, useMemo, useEffect } from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Hidden,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  BottomNavigation,
  BottomNavigationAction,
  Link,
  useMediaQuery,
  Button,
} from "@mui/material";
import nplogo from "../assets/logo2.svg";
import {
  LightMode,
  DarkMode,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
  AccountCircle,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout,
  Home,
  Code as CodeIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  AlternateEmail as AlternateEmailIcon,
  AutoAwesomeTwoTone,
  Circle,
  AddCircleOutlineOutlined,
  Dashboard,
  DashboardOutlined,
  ShoppingCartOutlined,
  StorefrontOutlined,
  GroupOutlined,
  InventoryOutlined,
  CategoryOutlined,
  ReceiptOutlined,
  WarehouseOutlined,
  ShoppingBasketRounded,
  Update,
  UpdateDisabledRounded,
  SystemUpdate,
  Shop,
  MonetizationOnOutlined,
} from "@mui/icons-material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
import "./style.scss";
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
} from "./themes";
import logo from "../assets/niplan-small.svg";
import { GlobalStyles } from "./GlobalStyle";
import TextField from "@mui/material/TextField";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Import Outlet
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  activateItem,
  expandItem,
  triggerPageChange,
} from "../redux/reducer/sidebardata";
import { logout } from "../redux/reducer/isLoggedInReducer";
import { getUser, isAuthenticated } from "../utils/Helper";

import defaultImg from "../assets/profile_default.png";
import { setPageTitle } from "../redux/reducer/titleReducer";

const Layout = ({ sidebarList, childPage, pageTitle }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true); // State for desktop sidebar
  const [themeMode, setThemeMode] = useState("light");
  const [openChildMenu, setOpenChildMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMenu, setThemeMenu] = useState(null);

  //const [sidebarItems, setSidebarItems] = useState(sidebarList);
  const sidebarItems = useSelector((state) => state.sidebardata.items);

  const pageTitleFromRedux = useSelector((state) => state.title.pageTitle);
  pageTitle = pageTitle || pageTitleFromRedux;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(triggerPageChange(location));
  }, [location]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "basic";
    setThemeMode(savedTheme);
    //dispatch(setPageTitle(pageTitle));
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

  const handleChildMenuToggle = () => {
    setOpenChildMenu(!openChildMenu);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuOpen = (event) => {
    setThemeMenu(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };
  const handleThemeMenuClose = () => {
    setThemeMenu(null);
  };

  const handleLogout = () => {
    // Handle logout action
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    dispatch(logout());
    navigate("/home");
  };

  const drawerWidth = isAuthenticated() ? 280 : 0;
  const handleSidebarMenuClick = (sidebarItem, index) => {
    if (sidebarItem.submenus && sidebarItem.submenus.length > 0) {
      dispatch(expandItem({ id: sidebarItem.id }));
    } else {
      dispatch(activateItem({ item: sidebarItem }));
      navigate(sidebarItem.module_url);
    }
  };

  const getIcon = (icon) => {
    switch (icon) {
      case "Add":
        return <AddCircleOutlineOutlined />;
      case "Dashboard":
        return <DashboardOutlined />;
      case "Store":
        return <ShoppingCartOutlined />;
      case "Retail":
        return <StorefrontOutlined />;
      case "AccountCircle":
        return <GroupOutlined />;
      case "Settings":
        return <SettingsIcon />;
      case "logout":
        return <Logout />;
      case "Inventory":
        return <InventoryOutlined />;
      case "Category":
        return <CategoryOutlined />;
      case "Redeem":
        return <ShoppingBasketRounded />;
      case "Warehouse":
        return <WarehouseOutlined />;
      case "GroupAdd":
        return <GroupOutlined />;
      case "Receipt":
        return <ReceiptOutlined />;
      case "ecommerce":
        return <BusinessIcon />;
      default:
        return <AccountCircle />;
    }
  };

  const drawer = (
    <div
      style={{
        borderRight: "1px solid " + theme.palette.background.paper,
        backgroundColor: theme.palette.background.paper,
        height: "100%",
        overflowY: "auto",
        padding: "16px",
      }}
      className="sidebar"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "space-evenly",
          gap: "16px",
          ml: "8px",
          marginBottom: "16px",
        }}
      >
        <img
          src="https://res.cloudinary.com/dihwey5iz/image/upload/v1755699638/logo_iicznj.png"
          alt="Niplan Logo"
          width="40"
          height="30"
        />
        <Typography
          variant="h6"
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "1.25rem",
          }}
        >
          Niplan Market
        </Typography>
      </Box>
      <List
        sx={{ "& .MuiListItem-root": { transition: "background-color 0.3s" } }}
      >
        {sidebarItems.map((sidebarItem) => (
          <React.Fragment key={sidebarItem.id}>
            <ListItem
              key={sidebarItem.id}
              onClick={() => handleSidebarMenuClick(sidebarItem)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                },
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                  borderRadius: "10px",
                },
              }}
              className={
                sidebarItem?.active && sidebarItem.submenus.length === 0
                  ? "active-sidebar"
                  : ""
              }
            >
              <ListItemIcon>{getIcon(sidebarItem.module_icon)}</ListItemIcon>
              <ListItemText primary={sidebarItem.module_name} />
              {"submenus" in sidebarItem && sidebarItem.submenus.length > 0 ? (
                <>
                  {sidebarItem?.expanded || sidebarItem?.active ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </>
              ) : (
                ""
              )}
            </ListItem>
            {"submenus" in sidebarItem && sidebarItem.submenus.length > 0 ? (
              <Collapse
                in={sidebarItem?.expanded || sidebarItem?.active}
                timeout="auto"
                unmountOnExit
              >
                <List component="div" disablePadding>
                  {sidebarItem.submenus.map((child) => (
                    <ListItem
                      sx={{ pl: 4 }}
                      key={child.module_name}
                      onClick={() => handleSidebarMenuClick(child)}
                      className={child?.active ? "active-sidebar" : ""}
                    >
                      <ListItemIcon>{getIcon(child.module_icon)}</ListItemIcon>
                      <ListItemText primary={child.module_name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            ) : (
              ""
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      onClick={handleProfileMenuClose}
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
      <MenuItem onClick={() => navigate("/myprofile")}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">Profile</Typography>
      </MenuItem>
      <MenuItem onClick={() => navigate("/settings")}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">Settings</Typography>
      </MenuItem>
      <MenuItem>
        <ListItemIcon>
          <NotificationsIcon fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">Notifications</Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">Logout</Typography>
      </MenuItem>
    </Menu>
  );

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
  let profilePic = defaultImg;
  if (isAuthenticated()) {
    profilePic =
      getUser()?.profile_pic &&
      getUser()?.profile_pic !== "null" &&
      Array.isArray(getUser()?.profile_pic)
        ? getUser()?.profile_pic[getUser().profile_pic.length - 1]
        : defaultImg;
  }
  return (
    <Emotion10ThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Box
            component="nav"
            sx={{
              width: { sm: desktopOpen ? drawerWidth : 0 },
              flexShrink: { sm: 0 },
            }}
            aria-label="mailbox folders"
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="persistent"
              open={desktopOpen}
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: desktopOpen ? drawerWidth : 0,
                  transition: "width 0.3s",
                },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              transition: "margin-left 0.3s",
              marginLeft: { xs: 0, sm: desktopOpen ? `${drawerWidth}px` : 0 },
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
              {isAuthenticated() ? (
                <Toolbar>
                  {isMobile ? (
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerToggle}
                    >
                      <MenuIcon />
                    </IconButton>
                  ) : (
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={handleDrawerToggle}
                      sx={{ mr: 2 }}
                    >
                      <MenuIcon />
                    </IconButton>
                  )}

                  <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                    onClick={() => navigate("/dashboard")}
                  >
                    {pageTitle || "Niplan"}
                  </Typography>

                  <Box sx={{ flexGrow: 1 }} />
                  {isMobile
                    ? !getUser()?.phone_number && (
                        <IconButton
                          color="error"
                          aria-label="open drawer"
                          onClick={() => navigate("/myprofile")}
                        >
                          <SystemUpdate />
                        </IconButton>
                      )
                    : !getUser()?.address && (
                        <IconButton
                          color="error"
                          aria-label="open drawer"
                          onClick={() => navigate("/myprofile")}
                        >
                          <SystemUpdate /> Update Profile
                        </IconButton>
                      )}
                  {getUser()?.profile_pic ? (
                    <img
                      src={profilePic}
                      className="shimmer"
                      onClick={handleProfileMenuOpen}
                      style={{
                        borderRadius: "50%",
                        width: "40px", // ou la taille désirée
                        height: "40px", // doit être égal à width pour un cercle parfait
                        objectFit: "cover", // corrigé de "cover: 'fit'" qui n'est pas valide
                        display: "block", // évite l'espace sous l'image
                      }}
                    />
                  ) : (
                    <IconButton
                      className="profile-icon"
                      color="inherit"
                      aria-label="profile"
                      onClick={handleProfileMenuOpen}
                    >
                      <AccountCircle />
                    </IconButton>
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
              ) : (
                <Toolbar>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <IconButton
                      size="large"
                      color="inherit"
                      onClick={() => navigate("/home")}
                    >
                      {/* Use a custom icon or logo here */}
                      <img
                        src="https://res.cloudinary.com/dihwey5iz/image/upload/v1755699638/logo_iicznj.png"
                        alt="Niplan Logo"
                        width="40"
                        height="40"
                      />
                    </IconButton>
                    <Box component="span" onClick={() => navigate("/home")}>
                      {pageTitle || "Niplan"}
                    </Box>
                  </Typography>
                  <Box sx={{ flexGrow: 1 }} />

                  {!isAuthenticated() && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mr: 1 }}
                      onClick={() => navigate("/auth")}
                      startIcon={<MonetizationOnOutlined />}
                    >
                      sell here
                    </Button>
                  )}
                  {isAuthenticated() && (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{ mr: 1 }}
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("refresh");
                        dispatch(logout());
                        navigate("/home");
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
              )}
            </AppBar>
            {profileMenu}
            {themeMenuUI}
            <section className="main-content" style={{ padding: "20px" }}>
              {childPage ? childPage : <Outlet />}
            </section>
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
                onClick={() => navigate("/contact")}
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

export default React.memo(Layout);
