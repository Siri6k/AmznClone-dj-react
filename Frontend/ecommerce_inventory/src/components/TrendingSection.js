// components/TrendingSection.jsx
import React, { useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import ProductCard from "../pages/product/ProductCard";
import { useTrendingProducts } from "../utils/Helper";

const TrendingSection = ({ title, type, limit = 6 }) => {
  const { products, loading, fetch } = useTrendingProducts(type, limit);

  useEffect(() => {
    fetch();
  }, [type, limit]);

  if (loading) return null; // ou un Skeleton

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h8" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {products.map((p) => (
          <Grid item xs={6} sm={4} md={2} key={p.id}>
            <ProductCard
              product={p}
              setSelectedProduct={() => {}}
              setShowBuyModal={() => {}}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingSection;
