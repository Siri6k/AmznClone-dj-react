import { Home, HomeMiniOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: "center", marginTop: "100px" }}>
      <h1>404 Error</h1>
      <h2>Page Not Found</h2>
      <Button
        style={{ mt: 2 }}
        variant="contained"
        color="primary"
        onClick={() => navigate("/home")}
        startIcon={<Home />}
      >
        Back Home
      </Button>
    </Box>
  );
};

export default Error404Page;
