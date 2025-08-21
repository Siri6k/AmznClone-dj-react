import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Paper,
  Tab,
  Tabs,
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  ExpandMore,
  Star,
  ShoppingCart,
  Favorite,
  Share,
  Image,
  QuestionAnswer,
  ThumbsUpDown,
  Visibility,
} from "@mui/icons-material";
import useApi from "../../hooks/APIHandler";
import { get } from "react-hook-form";
import { useParams } from "react-router-dom";
import TimeAgo from "../../components/TimeAgo";
import {
  formatCount,
  formatDateSimple,
  getAnonId,
  getUser,
  normalizedPhoneNumber,
} from "../../utils/Helper";
import LikeChip from "../../components/LikeChip";
import { toast } from "react-toastify";

const ProductDetail = ({ data, callApi }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState("panel1");
  const [currentImg, setCurrentImg] = useState(0);

  const { product, reviews, questions, like, share } = data;
  const [liked, setLiked] = useState(like);
  const [shared, setShared] = useState(share);
  const [viewCount, setViewCount] = useState(product.view_count || 0);
  const [likeCount, setLikeCount] = useState(product.like_count || 0);
  const [shareCount, setShareCount] = useState(product.share_count || 0);

  const baseUrl = "https://niplan-market.onrender.com"; // ← ton vrai domaine ici
  const productUrl = `${baseUrl}/product/${product.id}`;
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };
  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
  const isMyproduct =
    getUser() && getUser().username === product.added_by_user_id.username;
  let phoneNumber =
    product?.whatsapp_number || product?.added_by_user_id?.whatsapp_number;
  phoneNumber = normalizedPhoneNumber(phoneNumber);
  phoneNumber = phoneNumber.replace(/\D/g, ""); // nettoie le numéro

  //Whatsapp Handling
  const message =
    `*👋 Bonjour !*\n\n` +
    `Je suis intéressé par le produit suivant :\n\n` +
    `*${product.name}*\n\n` +
    `💰 _Prix_ : \`${new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: "CDF",
    }).format(product.price ?? 0)}\`\n` +
    `📦 _Disponibilité_ : ✅ En stock\n\n` +
    `📸 Aperçu : ${
      product?.image?.[0] || "https://via.placeholder.com/300"
    }\n\n` +
    `🔗 Voir le produit : ${productUrl}\n\n` +
    `-------------------------\n` +
    `Merci de confirmer votre intérêt 🙏`;

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  // Fallback si le numéro n'est pas défini
  let whatsapp_number =
    product?.whatsapp_number || product?.added_by_user_id?.whatsapp_number;

  const toggleLike = async () => {
    try {
      const id = product.id;
      const liking = await callApi({
        url: `products/interaction/${id}/`, // or products/detail/${id}/
        method: "POST",
        body: { action: "like", anon_id: getAnonId() },
      });
      if (liking) {
        setLikeCount(liked ? likeCount - 1 : likeCount + 1); // Update like count
        setLiked(!liked); // Toggle the liked state
        toast.success(liked ? "Product liked!" : "Product unliked!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error("Failed to fetch product:", err);
    }
  };

  const handleShare = async (product) => {
    const shareData = {
      title: product.name,
      text:
        `*👋 Bonjour !*\n\n` +
        `📦 Nouveau produit disponible !\n\n` +
        `✨ *${product.name}*\n\n` +
        `💰 Prix : ${new Intl.NumberFormat("fr-CD", {
          style: "currency",
          currency: "CDF",
        }).format(product.price)}\n\n` +
        `📸 Aperçu : ${
          product?.image?.[0] || "https://via.placeholder.com/300"
        }\n\n` +
        `👉 Découvrez plus ici : `,
      url: `${baseUrl}/product/${product.id}`,
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
    if (!shared) {
      try {
        const id = product.id;
        const sharing = await callApi({
          url: `products/interaction/${id}/`, // or products/detail/${id}/
          method: "POST",
          body: { action: "share", anon_id: getAnonId() },
        });
        if (sharing) {
          setShareCount((prev) => prev + 1);
          setShared(true);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Views */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" mb={2}>
        {/* Views */}
        <Tooltip title="Views">
          <Chip
            icon={<Visibility fontSize="small" />}
            label={`${formatCount(viewCount)} view${
              viewCount === 1 ? "" : "s"
            }`}
            variant="outlined"
            color="success"
            sx={{ px: 1, fontWeight: 500 }}
          />
        </Tooltip>
        <Tooltip title="likes">
          <Chip
            icon={<Favorite fontSize="small" />}
            label={`${formatCount(product.like_count)} like${
              product.like_count === 1 ? "" : "s"
            }`}
            variant="outlined"
            color="error"
            sx={{ px: 1, fontWeight: 500, fontSize: "0.8rem" }}
          />
        </Tooltip>
      </Stack>
      <Grid container spacing={4}>
        {/* Main Product Image - Will reorder itself */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 1, md: 1 }, // First on mobile, first on desktop (left)
            // Alternative if you want it to appear second on mobile:
            // order: { xs: 2, md: 1 }
          }}
        >
          <Card sx={{ mb: 2 }}>
            {/* Main Image */}
            {!loaded && <CardMedia className="shimmer" />}
            <CardMedia
              component="img"
              image={product.image[currentImg]}
              alt={product.name}
              height="250"
              sx={{
                height: { xs: 200, md: 400 }, // Adjust height for different screens
                objectFit: "cover",
                width: "100%",
                cursor: "zoom-in",
              }}
              onLoad={handleLoad}
              onClick={() => window.open(product.image[currentImg], "_blank")}
            />
          </Card>

          {/* Thumbnail Grid */}
          <Grid container spacing={1}>
            {product.image.length > 1 && (
              <Grid container spacing={1}>
                {product.image.map((img, idx) => (
                  <Grid item key={idx} xs={3}>
                    <Card
                      onClick={() => setCurrentImg(idx)}
                      sx={{
                        cursor: "pointer",
                        border:
                          idx === currentImg ? "2px solid #FF6B35" : "none",
                      }}
                    >
                      <CardMedia component="img" height={60} image={img} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Product Info - Will reorder itself */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            order: { xs: 2, md: 2 }, // Second on mobile, second on desktop (right)
            // Alternative if you want it to appear first on mobile:
            // order: { xs: 1, md: 2 }
          }}
        >
          {/* Rest of your product info content remains exactly the same */}
          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Rating
              value={averageRating}
              precision={0.5}
              readOnly
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              ({reviews.length} reviews)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {new Intl.NumberFormat("fr-CD", {
              style: "currency",
              currency: "CDF",
            }).format(product.price)}
          </Typography>

          {/*<Chip
            label={product.status}
            color={product.status === "ACTIVE" ? "success" : "error"}
            size="small"
            sx={{ mb: 2 }}
          />*/}

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Highlights 
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Highlights
            </Typography>
            <Grid container spacing={1}>
              {product.highlights.map((highlight, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2">
                    <strong>{highlight.key}:</strong> {highlight.value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
          */}

          {/* Additional Details */}

          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Details
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Quantity:</strong> {product.quantity}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>SKU:</strong> {product.sku}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Seller:</strong> {product.added_by_user_id.username}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Contact:</strong>{" "}
                  {normalizedPhoneNumber(whatsapp_number)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Country:</strong> {product.added_by_user_id.country}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>City:</strong>{" "}
                  {product?.city || product?.added_by_user_id?.city}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Date:</strong> {formatDateSimple(product.created_at)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Update:</strong>{" "}
                  <TimeAgo timestamp={product.updated_at} />
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Warranty */}
          {product?.additionnal_details?.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Additional Details
              </Typography>
              <Grid container spacing={1}>
                {product?.additionnal_details.map((detail, index) => (
                  <Grid item xs={6} key={index}>
                    <Typography variant="body2">
                      <strong>{detail.key}:</strong> {detail.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Action Buttons */}
          {!isMyproduct && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                mt: 4,
                gap: 1,
              }}
            >
              <Chip
                icon={<ShoppingCart />}
                label="Buy Now"
                color="primary"
                clickable
                component="a" // 👉 important pour s'assurer que c'est un lien
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ px: 1 }}
              />{" "}
              <IconButton
                onClick={toggleLike}
                aria-label="like"
                sx={{
                  borderRadius: "9999px",
                  padding: "4px 12px",
                  backgroundColor: liked ? "#fdecea" : "#f3f4f6",
                  color: liked ? "#d32f2f" : "#374151",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                <Favorite
                  size={16}
                  fill={liked ? "#d32f2f" : "none"}
                  strokeWidth={2}
                  style={{ marginRight: 4 }}
                />
                {formatCount(likeCount)} like{likeCount === 1 ? "" : "s"}
              </IconButton>
              <Chip
                icon={<Share />}
                label={`Share (${formatCount(shareCount)})`}
                variant="outlined"
                color="success"
                clickable
                sx={{ px: 1 }}
                onClick={() => handleShare(product)}
              />
            </Box>
          )}
          {isMyproduct && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                mt: 4,
              }}
            >
              <Chip
                icon={<Share />}
                label="Share"
                variant="outlined"
                color="success"
                clickable
                sx={{ px: 2 }}
                onClick={() => handleShare(product)}
              />
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
        </Grid>
      </Grid>

      {/* Tabs for Description, Reviews, Q&A */}
      <Box sx={{ width: "100%", mt: 4 }}>
        <Tabs
          value={value}
          onChange={handleTabChange}
          aria-label="product tabs"
          variant="fullWidth"
        >
          <Tab label="Description" icon={<Image />} />
          <Tab label={`Reviews (${reviews.length})`} icon={<Star />} />
          <Tab
            label={`Questions (${questions.length})`}
            icon={<QuestionAnswer />}
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 2 }}>
        {value === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            {/*
              <div
                dangerouslySetInnerHTML={{ __html: product.html_description }}
              />
              */}
            {product.additionnal_details &&
              product.additionnal_details[0].key && (
                <>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Others Details
                  </Typography>
                  <List dense>
                    {product.additionnal_details.map((spec, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={spec.key}
                          secondary={spec.value}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}
          </Box>
        )}

        {value === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>

            {reviews.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No reviews yet.
              </Typography>
            ) : (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography variant="h4" sx={{ mr: 1 }}>
                    {averageRating.toFixed(1)}
                  </Typography>
                  <Box>
                    <Rating value={averageRating} precision={0.1} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      Based on {reviews.length} reviews
                    </Typography>
                  </Box>
                </Box>

                {reviews.length > 0 &&
                  reviews.map((review) => (
                    <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar sx={{ width: 40, height: 40, mr: 1 }}>
                          {review.review_user_id.charAt(1)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {review.review_user_id}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: "auto" }}
                        >
                          {new Date(review.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {review.reviews}
                      </Typography>
                      {review.review_images &&
                        review.review_images.length > 0 && (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {review.review_images.map((img, idx) => (
                              <CardMedia
                                key={idx}
                                component="img"
                                height="80"
                                image={img}
                                alt={`Review image ${idx + 1}`}
                                sx={{ width: 80, borderRadius: 1 }}
                              />
                            ))}
                          </Box>
                        )}
                    </Paper>
                  ))}
              </>
            )}
          </Box>
        )}

        {value === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Questions & Answers
            </Typography>

            {questions.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No questions yet.
              </Typography>
            ) : (
              <List>
                {questions.length > 0 &&
                  questions.map((question) => (
                    <Accordion key={question.id} defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1">
                          {question.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1">
                          {question.answer}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 1, display: "block" }}
                        >
                          Answered by {question.answer_user_id} on{" "}
                          {new Date(question.created_at).toLocaleDateString()}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
              </List>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductDetail;
