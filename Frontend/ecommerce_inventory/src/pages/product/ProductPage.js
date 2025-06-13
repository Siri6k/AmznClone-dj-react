import React, { useState, useEffect } from "react";
import { Box, LinearProgress, Typography } from "@mui/material";
import useApi from "../../hooks/APIHandler";
import { useParams } from "react-router-dom";
import ProductDetail from "./ProductDetail";
import Title from "../../components/Title";

const ProductPage = () => {
  const { id } = useParams();
  const { error, loading, callApi } = useApi();
  const [data, setData] = useState(null);
  let liked = false;

  useEffect(() => {
    getProductDetails();
  }, [liked]);

  const getProductDetails = async () => {
    try {
      const result = await callApi({
        url: `products/detail/${id}/`, // or products/detail/${id}/
        method: "GET",
      });

      if (result) {
        const fetchData = result.data.data || [];
        setData(fetchData);
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };
  const getTitleLength = () => {
    if (typeof window === "undefined") return 30; // SSR fallback

    if (window.innerWidth < 400) return 7;
    if (window.innerWidth < 500) return 8;
    if (window.innerWidth < 600) return 11;
    if (window.innerWidth < 768) return 16;
    if (window.innerWidth < 1024) return 20;
    return 30; // Full desktop
  };

  return (
    <>
      <Title
        title={
          loading ? "Loading..." : `Manage ${data?.product?.name || "Product"}`
        }
        description={
          loading
            ? "Loading product details"
            : data?.product?.description?.substring(0, 100)
        }
        pageTitle={
          loading || !data
            ? "Product Detail"
            : `${data?.product?.name?.substring(0, getTitleLength())}${
                data?.product?.name?.length > getTitleLength() ? "..." : ""
              }`
        }
      />
      <Box component="div" sx={{ width: "100%" }}>
        {loading && <LinearProgress />}
        {error && (
          <Typography color="error">Error loading product details</Typography>
        )}
        {!loading && !data && <Typography>Product not found</Typography>}
        {data && <ProductDetail data={data} liked={liked} callApi={callApi}/>}
      </Box>
    </>
  );
};

export default ProductPage;
