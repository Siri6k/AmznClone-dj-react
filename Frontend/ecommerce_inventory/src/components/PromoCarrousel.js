import React from "react";
import Slider from "react-slick";
import { Box, Typography, Button, Container, Grid } from "@mui/material";
import { Save, ArrowForward, ArrowBack } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

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

  const slides = [
    {
      title: "Boostez vos ventes en ligne dès aujourd'hui !",
      subtitle:
        "Bénéficiez de <strong>0% de frais</strong> pendant 1 mois et atteignez des milliers de clients.",
      buttonText: "S'inscrire gratuitement",
    },
    {
      title: "Solution complète pour votre e-commerce",
      subtitle:
        "Tous les outils dont vous avez besoin pour vendre en ligne en un seul endroit.",
      buttonText: "Découvrir les fonctionnalités",
    },
    {
      title: "Analyses et statistiques avancées",
      subtitle:
        "Suivez vos performances et optimisez votre boutique avec nos outils d'analyse.",
      buttonText: "Voir les démos",
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
            <div key={index}>
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
            </div>
          ))}
        </Slider>
      </Container>
    </Box>
  );
};

export default PromoCarousel;
