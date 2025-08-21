import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";

const Error404Page = () => {
  const navigate = useNavigate();

  return (
    <>
      <Title
        title="Page Not Found"
        description="Page not found. The page you are looking for does not exist."
        keywords="404, error, page not found, ecommerce, Niplan"
        pageTitle="Error 404"
      />

      {/* 404 visual block */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          px: 2,
        }}
      >
        {/* Big animated emoji */}
        <Typography
          variant="h1"
          sx={{ mb: 1, animation: "bounce 1.5s infinite" }}
        >
          🤖
        </Typography>

        {/* 404 with gradient */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "5rem", md: "8rem" },
            fontWeight: 900,
            background: "linear-gradient(45deg,#FF6B35,#1A1A1A)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1,
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ mb: 1, color: "#666" }}>
          Oops&nbsp;😅 — cette page n’existe pas&nbsp;!
        </Typography>

        {/* SVG decorative wave */}
        <svg
          width="100"
          height="50"
          viewBox="0 0 100 50"
          style={{ marginBottom: 20 }}
        >
          <path
            d="M0 25 Q25 0 50 25 T100 25 L100 50 L0 50 Z"
            fill="#FF6B35"
            opacity=".3"
          />
        </svg>

        {/* Home button */}
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/home")}
          sx={{
            borderRadius: 28,
            px: 4,
            py: 1.5,
            boxShadow: "0 4px 12px rgba(0,0,0,.15)",
          }}
        >
          Revenir à l'accueil
        </Button>
      </Box>
    </>
  );
};

export default Error404Page;
