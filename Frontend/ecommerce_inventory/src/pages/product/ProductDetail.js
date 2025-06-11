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
} from "@mui/material";
import {
  ExpandMore,
  Star,
  ShoppingCart,
  Favorite,
  Share,
  Image,
  QuestionAnswer,
} from "@mui/icons-material";
import useApi from "../../hooks/APIHandler";
import { get } from "react-hook-form";
import { useParams } from "react-router-dom";
import TimeAgo from "../../components/TimeAgo";
import { formatDateSimple, normalizedPhoneNumber } from "../../utils/Helper";

const ProductDetail = ({ data }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [expanded, setExpanded] = useState("panel1");

  const { product, reviews, questions } = data;

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

  return (
    <Box sx={{ p: 3 }}>
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
            {!loaded && <CardMedia className="shimmer" />}
            <CardMedia
              component="img"
              image={product.image[0]}
              alt={product.name}
              height="300"
              sx={{
                height: { xs: 200, md: 400 }, // Adjust height for different screens
                objectFit: "cover",
                width: "100%",
              }}
              onLoad={handleLoad}
            />
          </Card>

          {/* Thumbnail Grid */}
          <Grid container spacing={1}>
            {product.image.slice(0, 4).map((img, index) => (
              <Grid item xs={3} key={index}>
                <Card>
                  {!loaded && <CardMedia className="shimmer" />}
                  <CardMedia
                    component="img"
                    height="100"
                    image={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    sx={{
                      height: { xs: 60, sm: 80, md: 100 },
                      objectFit: "cover",
                    }}
                    onLoad={handleLoad}
                  />
                </Card>
              </Grid>
            ))}
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
                  {normalizedPhoneNumber(
                    product.added_by_user_id.whatsapp_number
                  )}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>Country:</strong> {product.added_by_user_id.country}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  <strong>City:</strong> {product.added_by_user_id.city}
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
          {product.additionnal_details && (
            <Box sx={{ mb: 2 }}>
              {product.addition_details.map((detail, index) => (
                <Typography key={index} variant="body2">
                  <strong>{detail.key}:</strong> {detail.value}
                </Typography>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              mt: 4,
            }}
          >
            <Chip
              icon={<ShoppingCart />}
              label="Buy Now"
              color="primary"
              clickable
              sx={{ px: 2 }}
            />
            <Chip
              icon={<Favorite />}
              label="like"
              variant="outlined"
              color="error"
              clickable
              sx={{ px: 2 }}
            />
            <Chip
              icon={<Share />}
              label="Share"
              variant="outlined"
              color="success"
              clickable
              sx={{ px: 2 }}
            />
          </Box>
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
            <div
              dangerouslySetInnerHTML={{ __html: product.html_description }}
            />

            {product.specifications && product.specifications[0].key && (
              <>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Specifications
                </Typography>
                <List dense>
                  {product.specifications.map((spec, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={spec.key} secondary={spec.value} />
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
