import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Typography,
  Chip,
  Paper,
  Fade,
  ClickAwayListener,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const TrendingSearchBar = ({ searchQuery, setSearchQuery }) => {
  const [showTrending, setShowTrending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Données trending simulées
  const trendingKeywords = [
    "iPhone 15 Pro Max",
    "Chaussures Nike Air",
    "Montres intelligentes",
    "Laptop gaming",
    "Accessoires iPhone",
    "Sacs à main femme",
    "Casque Bluetooth",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Recherche:", searchQuery);
    setShowTrending(false);
  };

  const handleTrendingClick = (keyword) => {
    setSearchQuery(keyword);
    setShowTrending(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setShowTrending(false)}>
      <Box
        sx={{
          mx: "auto",
          mt: 1,
          position: "relative",
          width: { xs: "100%", sm: "80%", md: "60%" },
          mb: showTrending && !searchQuery ? "180px" : 0,
        }}
      >
        <Paper
          elevation={isFocused ? 4 : 1}
          sx={{
            borderRadius: 3,
            transition: "all 0.3s ease",
            overflow: "hidden",
          }}
        >
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher des produits, marques et plus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowTrending(true)}
              onClick={() => setShowTrending(true)}
              onBlur={() => setIsFocused(false)}
              onFocusCapture={() => setIsFocused(true)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" sx={{ mr: 1 }}>
                      <SearchIcon sx={{ color: "primary.main" }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                  backgroundColor: "background.paper",
                  borderRadius: 3,
                },
              }}
            />
          </form>
        </Paper>

        <Fade in={showTrending && !searchQuery}>
          <Paper
            elevation={4}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              mt: 1,
              borderRadius: 2,
              maxHeight: 300,
              overflow: "auto",
              zIndex: 1000,
            }}
          >
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TrendingUpIcon sx={{ color: "primary.main", mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "text.primary" }}
                >
                  Tendances actuelles
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {trendingKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    variant="outlined"
                    size="small"
                    onClick={() => handleTrendingClick(keyword)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "white",
                      },
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Suggestions filtrées lors de la saisie */}
        {searchQuery && (
          <Fade in={Boolean(searchQuery)}>
            <Paper
              elevation={4}
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                borderRadius: 2,
                maxHeight: 300,
                overflow: "auto",
                zIndex: 1000,
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Suggestions pour "{searchQuery}"
                </Typography>
                {trendingKeywords
                  .filter((keyword) =>
                    keyword.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((keyword, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1,
                        cursor: "pointer",
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderRadius: 1,
                        },
                      }}
                      onClick={() => handleTrendingClick(keyword)}
                    >
                      <Typography variant="body2">{keyword}</Typography>
                    </Box>
                  ))}
              </Box>
            </Paper>
          </Fade>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default TrendingSearchBar;
