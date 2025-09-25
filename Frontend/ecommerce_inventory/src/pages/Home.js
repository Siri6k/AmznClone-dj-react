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
} from "@mui/material";
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
import {
  Save,
  ShoppingCart,
  Search,
  AutoAwesomeTwoTone,
  Settings as SettingsIcon,
  Circle,
  Shop,
  SystemUpdate,
  AddCardRounded,
  AddCircleOutline,
  AddCircleOutlined,
  HandshakeOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { cleanUsername, getUser } from "../utils/Helper";
import Title from "../components/Title";
import ProductCard from "./product/ProductCard";
import { get } from "react-hook-form";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const { error, loading, callApi } = useApi();
  const [loaded, setLoaded] = useState(false);
  const theme = useTheme();

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

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

  const handleLoad = () => {
    setLoaded(true);
  };
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
    const url = getUser()?.phone_number ? `products/` : `products/all/`;
    const result = await callApi({
      url: url,
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

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const baseUrl = "https://niplan-market.onrender.com"; // ← ton vrai domaine ici

  const handleShare = async ({ username }) => {
    const shareData = {
      title: cleanUsername(username) + " shop - New Product",
      text:
        `*👋 Bonjour !*\n\n` +
        `✨ *Bienvenu(e) chez ${cleanUsername(username)} Boutique*\n\n` +
        `📦 Nouveaux produits disponibles !\n\n` +
        `👉 Visitez notre boutique ici : `,
      url: `${baseUrl}/shop/${username}`,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        console.error("Share failed:", err);
      });
    } else {
      // Fallback si Web Share API n’est pas supportée
      navigator.clipboard.writeText(shareData.url);
      alert("Lien copié dans le presse-papier !");
    }
  };
  return (
    <>
      <Title
        title="My Shop"
        description="Browse and manage your products"
        keywords="products, inventory, e-commerce"
        pageTitle="My Shop"
      />
      <Container
        className="main-content"
        maxWidth="xl"
        sx={{ flex: 1, padding: "20px" }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => navigate("/home")}
            startIcon={<ShoppingCart />}
          >
            Buy here
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
              Product
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 2, mt: 2 }} />
        {getUser()?.phone_number ? (
          <Box display={"flex"} justifyContent="space-between" mb={2}>
            <Typography variant="body2">Manage My Shop - Products</Typography>
            <Box className="share">
              {products.length > 0 && (
                <ShareOutlined
                  fontSize="small"
                  sx={{ mr: 1 }}
                  color="success"
                  onClick={() => handleShare({ username: getUser()?.username })}
                />
              )}
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              border: "1px solid #ffeeba",
              borderRadius: 1,
              p: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="caption"
              fontWeight="bold"
              color="warning.main"
              onClick={() => navigate("/myprofile")}
            >
              🚧 Profile Incomplete
            </Typography>
            <Typography
              variant="caption"
              sx={{ mt: 0.5, display: "block", color: "error.main" }}
            >
              Please update your profile to be able to add a product on the
              platform.
            </Typography>
          </Box>
        )}
        <Divider sx={{ mb: 2, mt: 2 }} />

        <Grid container spacing={4}>
          {products.length > 0 &&
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </Grid>
        {products.length === 0 && (
          <Grid
            container
            spacing={4}
            sx={{ mt: 4, mb: 4, justifyContent: "center" }}
          >
            <Grid item xs={12} md={6} textAlign="center">
              <Typography variant="h6" gutterBottom>
                Vous n’avez pas encore de produit en ligne
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Créez votre premier article pour commencer à vendre et être
                visible par nos milliers d’acheteurs.
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlined />}
                onClick={() => navigate("/form/product")} // ou votre route de création
              >
                Ajouter un produit
              </Button>

              <Box mt={2}>
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                  onClick={() => window.open("/guide", "_blank")}
                >
                  Besoin d’aide pour créer un produit ?
                </Link>
              </Box>
            </Grid>
          </Grid>
        )}

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
    </>
  );
};
export default Home;
