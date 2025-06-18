import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CardMedia,
  Stack,
  Skeleton,
} from "@mui/material";
import { AddCircleOutline, WhatsApp } from "@mui/icons-material";
import { normalizedPhoneNumber } from "../../utils/Helper";

const ProductBuyModal = ({ product, setShowBuyModal }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleClose = () => setShowBuyModal(false);
  let phoneNumber =
    product?.whatsapp_number || product?.added_by_user_id?.whatsapp_number;
  phoneNumber = normalizedPhoneNumber(phoneNumber);
  phoneNumber = phoneNumber.replace(/\D/g, ""); // nettoie le numéro

  //Whatsapp Handling
  const baseUrl = "https://niplan-market.com"; // ← ton vrai domaine ici
  const productUrl = `${baseUrl}/product/${product.id}`;
  const message = `Bonjour, je suis intéressé par le produit "${product.name}" au prix de ${product.price} CDF.\nLien: ${productUrl}`;
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  return (
    <>
      <Stack spacing={2}>
        {!loaded && (
          <Skeleton variant="rectangular" height={250} animation="wave" />
        )}

        <CardMedia
          component="img"
          image={product.image?.[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          sx={{
            height: 250,
            objectFit: "cover",
            display: loaded ? "block" : "none",
          }}
        />
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="body1" color="primary">
          {new Intl.NumberFormat("fr-CD", {
            style: "currency",
            currency: "CDF",
          }).format(product.price)}
        </Typography>
        <Typography variant="body2">{product.description}</Typography>
      </Stack>

      <DialogActions
        sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
      >
        <Button onClick={handleClose} color="error">
          Annuler
        </Button>
        {phoneNumber ? (
          <Button
            color="success"
            startIcon={<WhatsApp />}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </Button>
        ) : (
          <Typography color="error" sx={{ px: 2 }}>
            Numéro WhatsApp non disponible
          </Typography>
        )}
      </DialogActions>
      <Button
        size="normal"
        color="success"
        variant="contained"
        sx={{ mt: 2 }}
        startIcon={<AddCircleOutline />}
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        fullWidth
      >
        Buy
      </Button>
    </>
  );
};

export default ProductBuyModal;
