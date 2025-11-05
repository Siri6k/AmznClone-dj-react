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
import "../layout/style.scss";

import {
  Settings as SettingsIcon,
  SystemUpdate,
  AddCircleOutline,
  Home,
  ExpandLessRounded,
  ExpandMoreRounded,
  SaveAltRounded,
  FilterList,
} from "@mui/icons-material";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import useApi from "../hooks/APIHandler";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PromoCarousel from "../components/PromoCarrousel";
import {
  cleanUsername,
  formatText,
  getUser,
  isAuthenticated,
  orderOptions,
} from "../utils/Helper";
import ProductCard from "./product/ProductCard";
import Title from "../components/Title";
import ProductBuyModal from "./product/ProductBuyModal";
import { FormProvider, get, useForm } from "react-hook-form";
import TrendingSection from "../components/TrendingSection";
import TrendingSearchBar from "../components/TrendingSearchBar";
import AdvancedFilterPanel from "../components/AdvancedFilterPanel";
import AdvancedFilterPanelInline from "../components/AdvancedFilterInline";
import { set } from "date-fns";

const HomePage = ({ user_id }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [numPages, setNumPages] = useState(null);
  const { error, loading, callApi } = useApi();
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
  const [category_id, setCategoryId] = useState([]);
  const [aFilterFields, setAFilterFields] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

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
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setNumPages(null);
    setProducts([]);
    getAllProduct();
  }, [debounceSearch, ordering]);

  const onSubmitFilter = async (data) => {
    const filterData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== "")
    );
    setAFilterFields(filterData);
  };
  const getCategoryList = async () => {
    const result = await callApi({
      url: `products/categories/all/`,
      method: "GET",
    });
    if (result) {
      setCategoryId(result.data.data);
      setAFilterFields((prev) => ([ ...prev, {
        key: "category_id",
        label: "Catégorie",
        type: "select",
        options: result.data.data.map((category) => {
          return { key: category.id, value: category.name };
        }),
      }));
      console.log("category_id", filterFields);
    }
  };
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
        ...aFilterFields,
      },
    });

    if (result) {
      const fetchData = result.data.data.data || [];
      setProducts((prev) => [...prev, ...fetchData]);
      setPage((prev) => prev + 1);
      setNumPages(result.data.data.totalPages);
      setFilterFields([
        ...result.data.data.filterFields,
        { key: "price_min", label: "Prix minimum", type: "number" },
        { key: "price_max", label: "Prix maximum", type: "number" },
      ]);
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

  const resetFilter = () => {
    let fields = {};
    for (const field of filterFields) {
      fields[field.key] = null;
    }
    setFilterFields(fields);
    methods.reset(filterFields);
    setAFilterFields({});
  };

  const pageTitle = isAuthenticated() ? "My Shop" : "Niplan";

  return (
    <>
      <Title pageTitle={pageTitle} />
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
                ? getUser() &&
                  !getUser()?.phone_number && (
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
                : getUser() &&
                  !getUser()?.phone_number && (
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
              {getUser() && getUser()?.phone_number && (
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
          )}

          {/* Main Content */}
          <Container
            className="main-content"
            maxWidth="xl"
            sx={{ flex: 1, padding: "20px" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                flexWrap: "wrap",
              }}
            >
              <TrendingSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <Button
                startIcon={<FilterList />}
                variant="outlined"
                onClick={() => {
                  setFilterOpen(true);
                  getCategoryList();
                }}
                fullWidth
                sx={{
                  mt: 1,
                  maxWidth: isMobile ? "100%" : "200px",
                  mt: isMobile ? 2 : 0,
                }}
              >
                {filterOpen ? "Masquer les filtres" : "Filtres avancés"}
              </Button>
            </Box>

            <AdvancedFilterPanelInline
              open={filterOpen}
              filterFields={filterFields}
              onApply={(filters) => {
                setAFilterFields(filters);
                setPage(1);
                setProducts([]);
                getAllProduct();
              }}
              onReset={() => {
                resetFilter();
                setFilterOpen(false);
              }}
              loading={loading}
            />
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
            {!loading && products.length === 0 && (
              <Typography variant="body2" align="center" sx={{ mt: 4 }}>
                Aucun produit trouvé
              </Typography>
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
