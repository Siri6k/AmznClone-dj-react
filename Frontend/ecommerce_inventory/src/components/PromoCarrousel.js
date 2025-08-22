import React from "react";
import Slider from "react-slick";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { Save, ArrowForward, ArrowBack } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { imageDummyUrls } from "../utils/Helper";

const PromoCarousel = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <ArrowForward />,
    prevArrow: <ArrowBack />,
  };

  const imageUrls = [
    "https://images.pexels.com/photos/7156883/pexels-photo-7156883.jpeg", // femme avec sac shopping
    "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg", // ordinateur avec site e-commerce
    "https://images.pexels.com/photos/4464481/pexels-photo-4464481.jpeg", // analyse de données
    "https://images.pexels.com/photos/6347727/pexels-photo-6347727.jpeg", // boutique en ligne
    "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg", // paiement en ligne
    "https://images.pexels.com/photos/4464484/pexels-photo-4464484.jpeg", // dashboard analytique
    // --- NOUVEAUX (6) ---
    "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg", // caisse enregistreuse moderne
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg", // sacs shopping colorés
    "https://images.pexels.com/photos/5691642/pexels-photo-5691642.jpeg", // livraison / colis
    "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg", // smartphone + carte bancaire
    "https://images.pexels.com/photos/6590927/pexels-photo-6590927.jpeg", // client satisfait / avis
    "https://images.pexels.com/photos/7414284/pexels-photo-7414284.jpeg", // équipe logistique entrepôt

    // Shopping & E-commerce
    "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg",
    "https://images.pexels.com/photos/7156883/pexels-photo-7156883.jpeg",
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg",
    "https://images.pexels.com/photos/6347727/pexels-photo-6347727.jpeg",
    "https://images.pexels.com/photos/5691642/pexels-photo-5691642.jpeg",

    // Mode & habillement
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    "https://images.pexels.com/photos/2983461/pexels-photo-2983461.jpeg",
    "https://images.pexels.com/photos/2983463/pexels-photo-2983463.jpeg",

    // Téléphones & électronique
    "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg",
    "https://images.pexels.com/photos/6078120/pexels-photo-6078120.jpeg",
    "https://images.pexels.com/photos/6078121/pexels-photo-6078121.jpeg",
    "https://images.pexels.com/photos/6078122/pexels-photo-6078122.jpeg",
  ];

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const shuffledImages = shuffleArray(imageUrls).slice(0, 3); // 3 slides

  const slides = [
    {
      title: "Boostez vos ventes en ligne dès aujourd'hui !",
      subtitle:
        "Bénéficiez de <strong>0% de frais</strong> pendant 1 mois et atteignez des milliers de clients.",
      buttonText: "S'inscrire gratuitement",
      bg: `url("${shuffledImages[0]}")`,
    },
    {
      title: "Solution complète pour votre e-commerce",
      subtitle:
        "Tous les outils dont vous avez besoin pour vendre en ligne en un seul endroit.",
      buttonText: "Découvrir les fonctionnalités",
      bg: `url("${shuffledImages[1]}")`,
    },
    {
      title: "Analyses et statistiques avancées",
      subtitle:
        "Suivez vos performances et optimisez votre boutique avec nos outils d'analyse.",
      buttonText: "Voir les démos",
      bg: `url("${shuffledImages[2]}")`,
    },
  ];

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "secondary",
        py: 3,
        textAlign: "center",
        backgroundImage: "none",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
      }}
    >
      <Container maxWidth="xl">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <Box
              key={index}
              sx={{
                backgroundImage: slide.bg,
                backgroundSize: "cover",
                backgroundPosition: "center",
                py: 6,
                color: "#fff",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,.5)",
                  zIndex: 1,
                },
              }}
            >
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                      {slide.title}
                    </Typography>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: slide.subtitle }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      endIcon={<Save />}
                      sx={{ borderRadius: 2, px: 4 }}
                      onClick={() => navigate("/auth")}
                    >
                      {slide.buttonText}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default PromoCarousel;
