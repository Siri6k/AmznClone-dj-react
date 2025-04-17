import React from "react";
import { Typography, Box, Chip, Stack, Button } from "@mui/material";
import { Circle } from "@mui/icons-material";

// Helper to clean up key labels
const formatKey = (key) => {
  if (!key) return "";
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); // Capitalize first letters
};

const AdditionalDetailsComponent = ({ data }) => {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <Typography variant="body2">No additional details available.</Typography>
    );
  }

  // Normalize data: if object, convert to array of { key, value }
  const normalizedData = Array.isArray(data)
    ? data
    : Object.entries(data).map(([key, value]) => ({ key, value }));

  return (
    <Stack spacing={1}>
      {normalizedData.map((item, index) => {
        let displayValue;

        if (item.value === true) {
          displayValue = (
            <Button variant="contained" size="small" color="success">
              OK
            </Button>
          );
        } else if (item.value === false) {
          displayValue = (
            <Chip label="No" size="small" color="error" variant="contained" />
          );
        } else if (Array.isArray(item.value)) {
          displayValue = item.value.length > 0 ? item.value[0] : "—";
        } else if (typeof item.value === "object" && item.value !== null) {
          displayValue = Object.keys(item.value)[0] || "—";
        } else {
          displayValue = String(item.value);
        }

        return (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Circle sx={{ fontSize: 10, color: "primary.main" }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500 }}
              color="textSecondary"
            >
              <b>{formatKey(item.key)}:</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center" }}
              color="textSecondary"
            >
              {displayValue}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
};

export default AdditionalDetailsComponent;
