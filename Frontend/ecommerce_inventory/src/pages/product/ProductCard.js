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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import TimeAgo from "../../components/TimeAgo";
import { getUser } from "../../utils/Helper";

const ProductCard = ({ product, setSelectedProduct, setShowBuyModal }) => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleViewDetails = () => navigate(`/product/${product.id}`);

  const imageSrc = product.image?.[0] || "https://via.placeholder.com/300";

  const username = product.added_by_user_id?.username || "Inconnu";
  const phone = product.added_by_user_id?.whatsapp_number;

  const priceFormatted = new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "CDF",
  }).format(product.price);

  const isMyproduct =
    getUser() && getUser().username === product.added_by_user_id.username;

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

        <CardActions sx={{ justifyContent: "space-evenly", mt: "auto" }}>
          {!isMyproduct && (
            <Button
              size="normal"
              color="success"
              variant="contained"
              startIcon={<AddCircleOutline />}
              onClick={() => {
                setShowBuyModal(true);
                setSelectedProduct(product);
              }}
            >
              Buy
            </Button>
          )}
          {isMyproduct && (
            <Button
              size="normal"
              color="success"
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/form/product/${product.id}`)}
            >
              Update
            </Button>
          )}
          <Button
            size="normal"
            color="secondary"
            variant="outlined"
            startIcon={<ViewAgendaOutlined />}
            onClick={handleViewDetails}
          >
            Details
          </Button>
        </CardActions>

        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack spacing={1}>
            <TimeAgo timestamp={product.updated_at} />
          </Stack>
          <Stack spacing={1}>
            <Typography variant="body2">
              <PersonOutline fontSize="small" /> {username}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
