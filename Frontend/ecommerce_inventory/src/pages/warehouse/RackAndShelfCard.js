import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  Grid,
  Chip,
  Button,
  Stack,
  Collapse,
  CardActions,
  Icon,
  IconButton,
} from "@mui/material";
import {
  EditOutlined,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import TimeAgo from "../../components/TimeAgo";
import AdditionalDetailsComponent from "../../components/AdditionalDetailsComponent";

const RackAndShelfCard = ({ data, onEditClick }) => {
  const {
    id,
    name,
    rack,
    shelf,
    floor,
    domain_user_id,
    added_by_user_id,
    warehouse_id,
    additional_details,
    created_at,
    updated_at,
  } = data;

  const [showDetails, setShowDetails] = useState(false);

  const renderDetailValue = (value) => {
    if (value === true) {
      return (
        <Button variant="outlined" size="small">
          OK
        </Button>
      );
    } else if (
      typeof value === "object" &&
      !Array.isArray(value) &&
      value !== null
    ) {
      return Object.keys(value)[0];
    } else if (Array.isArray(value)) {
      return value.length > 0 ? String(value[0]) : "—";
    } else {
      return String(value);
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        p: 2,
        maxWidth: 600,
        width: "100%",
        mx: "auto",
        mt: 2,
      }}
    >
      <CardContent>
        <box
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" gutterBottom>
            🗄️ {name || "Unnamed Rack Area"}
          </Typography>
          <IconButton onClick={() => onEditClick(id)} size="small">
            <EditOutlined color="primary" />
          </IconButton>
        </box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={1} wrap="wrap">
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>ID:</b> {"#" + id || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Rack:</b> {rack || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Shelf:</b> {shelf || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Floor:</b> {floor || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Warehouse ID:</b> {warehouse_id || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Domain User:</b> {domain_user_id || "—"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="textSecondary">
              <b>Added By:</b> {added_by_user_id || "—"}
            </Typography>
          </Grid>
        </Grid>

        <CardActions sx={{ mt: 2, p: 0 }}>
          <Button
            size="small"
            endIcon={<ExpandMoreIcon />}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Additional Details
          </Button>
        </CardActions>

        <Collapse in={showDetails} timeout="auto" unmountOnExit>
          <Card
            sx={{
              boxShadow: 1,
            }}
          >
            <Card
              sx={{
                backgroundColor: "secondary",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                📦 Additional Details
              </Typography>
              <AdditionalDetailsComponent data={additional_details} />
            </Card>
          </Card>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          spacing={1}
        >
          <Typography variant="caption" color="text.secondary">
            Created: <TimeAgo timestamp={created_at} />
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Updated: <TimeAgo timestamp={updated_at} />
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RackAndShelfCard;
