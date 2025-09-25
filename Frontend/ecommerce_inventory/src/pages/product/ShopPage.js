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
  Collapse,
  Autocomplete,
  Chip,
} from "@mui/material";
import "../../layout/style.scss";

import {
  Settings as SettingsIcon,
  SystemUpdate,
  AddCircleOutline,
  Home,
  ExpandLessRounded,
  ExpandMoreRounded,
  SaveAltRounded,
  HandshakeOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState, useCallback, useMemo, use } from "react";
import useApi from "../../hooks/APIHandler";
import { useNavigate, useParams } from "react-router-dom";
import PromoCarousel from "../../components/PromoCarrousel";
import {
  cleanUsername,
  formatText,
  getUser,
  imageDummyUrls,
  isAuthenticated,
  orderOptions,
} from "../../utils/Helper";
import ProductCard from "./ProductCard";
import Title from "../../components/Title";
import ProductBuyModal from "./ProductBuyModal";
import { FormProvider, get, useForm } from "react-hook-form";
import TrendingSearchBar from "../../components/TrendingSearchBar";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const { error, loading, callApi } = useApi();
  let { username } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    control,
    reset,
  } = methods;

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);
  const [filterFields, setFilterFields] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [aFilterFields, setAFilterFields] = useState(null);

  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data after 1 second
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setNumPages(null);
    setProducts([]);
    getShopProducts();
  }, [debounceSearch, ordering]);

  const onSubmitFilter = async (data) => {
    const filterData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== "")
    );
    setAFilterFields(filterData);
  };

  const getShopProducts = useCallback(async () => {
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
      url: `products/shop/${username}/`,
      method: "GET",
      params: {
        page: page,
        pageSize: 12,
        search: debounceSearch,
        ordering: order,
        ...aFilterFields,
      },
    });
    if (result) {
      const fetchData = result.data.data.data || [];
      setProducts((prev) => [...prev, ...fetchData]);
      setPage((prev) => prev + 1);
      setNumPages(result.data.data.totalPages);
      setFilterFields(result.data.data.filterFields);
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
    getShopProducts();
  }, [getShopProducts]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const resetFilter = () => {
    let fields = {};
    for (const field of filterFields) {
      fields[field.key] = null;
    }
    setFilterFields(fields);
    methods.reset(filterFields);
    setAFilterFields({});
  };

  const pageTitle = cleanUsername(username) + " shop";
  const randomIndex = Math.floor(Math.random() * imageDummyUrls.length);
  const profilePic =
    (products.length > 0 &&
      Array.isArray(products[0]?.added_by_user_id?.profile_pic) &&
      products[0]?.added_by_user_id?.profile_pic?.length > 1 &&
      products[0]?.added_by_user_id?.profile_pic[
        products[0]?.added_by_user_id?.profile_pic?.length - 1
      ]) ||
    imageDummyUrls[randomIndex];

  return (
    <>
      <Title title={pageTitle} pageTitle={pageTitle} />
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
          <Box
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
              "& .track": {
                display: "inline-flex",
                animation: "scroll 10s linear infinite",
              },
              "@keyframes scroll": {
                "0%": { transform: "translateX(0%)" },
                "100%": { transform: "translateX(-50%)" },
              },
            }}
          >
            <Box className="track" sx={{}}>
              <HandshakeOutlined sx={{ mx: 1 }} color="success" />
              <Typography variant="h5" component="span">
                Welcome to {cleanUsername(username)}'s Shop
              </Typography>
              {/* doublon pour boucle fluide */}
              <HandshakeOutlined sx={{ mx: 1 }} color="success" />
              <Typography variant="h5" component="span">
                Welcome to {cleanUsername(username)}'s Shop
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Container
            className="main-content"
            maxWidth="xl"
            sx={{
              flex: 1,
              padding: "20px",
            }}
          >
            <Box
              sx={{
                p: 2,
                mb: 2,
                borderRadius: 3,
                backgroundImage: `url(${profilePic})`, // Remplacez par le chemin de votre image
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundColor: "rgba(255,255,255,.36)", // 36 % white tint
                backgroundBlendMode: "lighten",
              }}
            >
              <TrendingSearchBar
                searchQuery={search}
                setSearchQuery={setSearch}
              />
            </Box>
            <Divider sx={{ mb: 2, mt: 2 }} />

            <Grid container spacing={4} mt={1}>
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

export default ShopPage;
