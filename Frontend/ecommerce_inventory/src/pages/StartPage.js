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
  TextField,
  ThemeProvider,
  CardContent,
  CardActions,
  Menu,
  CircularProgress,
  MenuItem,
  ListItemIcon,
  Breadcrumbs,
  Dialog,
  DialogContent,
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
  AutoAwesomeTwoTone,
  Settings as SettingsIcon,
  Circle,
  Shop,
  Star,
  SystemUpdate,
  HomeMiniOutlined,
  AddCircleOutline,
  Home,
} from "@mui/icons-material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PromoCarousel from "../components/PromoCarrousel";
import { getUser, isAuthenticated } from "../utils/Helper";
import ProductCard from "./product/ProductCard";
import Title from "../components/Title";
import ProductBuyModal from "./product/ProductBuyModal";

const HomePage = ({ user_id }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const { error, loading, callApi } = useApi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    // Fetch data after 1 second
    const timer = setTimeout(() => {
      if (numPages) {
        setPage(1);
        setProducts([]);
      }
      setDebounceSearch(search);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProduct();
  }, [debounceSearch, ordering]);

  const getAllProduct = useCallback(async () => {
    if (!hasMore || loading) return;
    if (numPages && page > numPages) return;
    let order = "-id";
    if (ordering && ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: `products/all/`,
      method: "GET",
      params: {
        page: page,
        pageSize: 12,
        search: debounceSearch,
        ordering: order,
      },
    });
    if (result) {
      const fetchData = result.data.data.data || [];
      setProducts((prev) => [...prev, ...fetchData]);
      setPage((prev) => prev + 1);
      setNumPages(result.data.data.totalPages);
    }
  }, [page, hasMore, loading, callApi]);

  const handleScroll = useCallback(() => {
    setSearchOpen(false);
    //close search input on scroll
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

  const pageTitle = isAuthenticated() ? "My Shop" : "Niplan";

  return (
    <>
      <Title />
      <Box component={"div"} sx={{ width: "100%" }}>
        {/* Navbar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!isAuthenticated() && <PromoCarousel />}
          {isAuthenticated() && (
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/dashboard")}
                startIcon={<Home />}
              >
                my shop
              </Button>
              {isMobile
                ? !getUser()?.phone_number && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => navigate("/myprofile")}
                      startIcon={<SystemUpdate />}
                    >
                      Profile
                    </Button>
                  )
                : !getUser()?.phone_number && (
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => navigate("/myprofile")}
                      startIcon={<SystemUpdate />}
                    >
                      Profile
                    </Button>
                  )}
              {getUser()?.phone_number && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => navigate("/form/product")}
                  startIcon={<AddCircleOutline />}
                >
                  Add Product
                </Button>
              )}
            </Box>
          )}

          {/* Main Content */}
          <Container
            className="main-content"
            maxWidth="xl"
            sx={{ flex: 1, padding: "20px" }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Typography variant="body2" >
                Featured Products
              </Typography>
            </Breadcrumbs>

            <Divider sx={{ mb: 2, mt: 2 }} />

            <Grid container spacing={4}>
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  setSelectedProduct={setSelectedProduct}
                  setShowBuyModal={setShowBuyModal}
                />
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
        </Box>
        {showBuyModal && (
          <Dialog
            open={showBuyModal}
            maxWidth={"lg"}
            onClose={() => setShowBuyModal(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogContent>
              <ProductBuyModal
                product={selectedProduct}
                setShowBuyModal={setShowBuyModal}
              />
              <Divider sx={{ margin: "5px 0" }} />
            </DialogContent>
          </Dialog>
        )}
      </Box>
    </>
  );
};

export default HomePage;
