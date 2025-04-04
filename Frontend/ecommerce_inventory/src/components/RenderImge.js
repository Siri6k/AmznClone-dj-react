import { Typography } from "@mui/material";
import { getImageUrl, isValidUrl } from "../utils/Helper";

const RenderImage = ({ data, name }) => {
  return data && data !== "" && isValidUrl(data) ? (
    <img
      src={getImageUrl(data)}
      alt={name}
      style={{ width: 70, height: 70, padding: "5px" }}
    />
  ) : (
    <Typography variant="body2" pt={3} pb={3}>
      No Image
    </Typography>
  );
};

export default RenderImage;
