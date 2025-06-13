import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useState } from "react";
import { keyframes } from "@emotion/react";

const pop = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
`;

const LikeChip = ({ liked, toggleLike }) => {
  const [animating, setAnimating] = useState(false);
  let isLiked = true;

  const handleClick = () => {
    setAnimating(true);
    toggleLike(); // met à jour l'état global
    setTimeout(() => setAnimating(false), 400);
    isLiked = !isLiked;
  };

  return (
    <Chip
      icon={
        isLiked ? (
          <Favorite
            sx={{
              color: "white",
              animation: animating ? `${pop} 0.4s ease-in-out` : "none",
            }}
          />
        ) : (
          <FavoriteBorder
            sx={{
              color: "error.main",
              animation: animating ? `${pop} 0.4s ease-in-out` : "none",
            }}
          />
        )
      }
      label={isLiked ? "Liked" : "Like"}
      variant={isLiked ? "filled" : "outlined"}
      color="error"
      clickable
      onClick={handleClick}
      sx={{
        px: 1.5,
        fontWeight: "bold",
        transition: "all 0.3s ease",
        bgcolor: isLiked ? "error.main" : "transparent",
        color: isLiked ? "white" : "error.main",
        "&:hover": {
          bgcolor: isLiked ? "error.dark" : "error.light",
        },
      }}
    />
  );
};

export default LikeChip;
