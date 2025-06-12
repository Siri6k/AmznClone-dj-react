import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
  Grid,
  Stack,
  Chip,
  Skeleton,
  Box,
} from "@mui/material";
import {
  ShopOutlined,
  ViewAgendaOutlined,
  PersonOutline,
  PhoneOutlined,
  UpdateRounded,
  AddOutlined,
  AddCircleOutline,
  Edit,
  DashboardCustomizeOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TimeAgo from "../../components/TimeAgo";
import { getUser } from "../../utils/Helper";

import { useTheme, useMediaQuery } from "@mui/material";

const ProductCard = ({ product, setSelectedProduct, setShowBuyModal }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleViewDetails = () => navigate(`/product/${product.id}`);

  const imageSrc = product.image?.[0] || "https://via.placeholder.com/300";

  const username = product.added_by_user_id?.username || "Inconnu";
  const id = "profile@" + product.added_by_user_id?.id;

  const priceFormatted = new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "CDF",
  }).format(product.price);

  const isMyproduct =
    getUser() && getUser().username === product.added_by_user_id.username;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {!loaded && (
          <Skeleton variant="rectangular" height={150} animation="wave" />
        )}
        <CardMedia
          component="img"
          image={imageSrc}
          alt={product.name}
          sx={{
            height: 150,
            objectFit: "cover",
            display: loaded ? "block" : "none",
          }}
          onLoad={handleLoad}
          onClick={handleViewDetails}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            noWrap
            onClick={handleViewDetails}
          >
            {product.name}
          </Typography>

          <Typography variant="h6" color="primary" onClick={handleViewDetails}>
            {priceFormatted}
          </Typography>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "space-evenly",
            mt: "auto",
            flexWrap: { sm: "wrap-reverse", lg: "nowrap" },
            gap: 1, // espace entre les boutons
          }}
        >
          {!isMyproduct ? (
            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                setShowBuyModal(true);
                setSelectedProduct(product);
              }}
              sx={{
                width: { xs: "100%", sm: "auto", lg: "60%", md: "70%" }, // full width en mobile
              }}
            >
              Buy Now
            </Button>
          ) : (
            <Button
              size="small"
              color="success"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/form/product/${product.id}`)}
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Update
            </Button>
          )}

          <Button
            size="small"
            color="secondary"
            variant="outlined"
            startIcon={<DashboardCustomizeOutlined />}
            onClick={handleViewDetails}
            sx={{
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Details
          </Button>
        </CardActions>

        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack spacing={1}>
            <TimeAgo timestamp={product.updated_at} />
          </Stack>
          <Stack spacing={1}>
            <Typography
              variant="body2"
              onClick={() => navigate(`/profile/${id}`)}
            >
              <PersonOutline fontSize="small" /> {username}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
