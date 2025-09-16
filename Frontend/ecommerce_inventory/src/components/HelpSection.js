import { Typography, Box, Paper } from "@mui/material";

export default function HelpSection({ id, title, children }) {
  return (
    <Paper id={id} elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ pl: 1 }}>{children}</Box>
    </Paper>
  );
}
