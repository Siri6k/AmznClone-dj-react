import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
  CardActions,
  Grid,
} from "@mui/material";
import {
  DetailsOutlined,
  Note,
  Shop,
  ShopOutlined,
  ViewAgendaOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };
  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
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
            image={product.image[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            sx={{ height: 100, objectFit: "cover" }}
            onLoad={handleLoad}
          />
        }
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
            {new Intl.NumberFormat("fr-CD", {
              style: "currency",
              currency: "CDF",
            }).format(product.initial_selling_price)}
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: "space-evenly" }}>
          <Button
            size="small"
            color="success"
            variant="contained"
            startIcon={<ShopOutlined />}
            onClick={handleViewDetails}
          >
            Buy Now
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="outlined"
            startIcon={<ViewAgendaOutlined />}
            onClick={handleViewDetails}
          >
            Details
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default ProductCard;
