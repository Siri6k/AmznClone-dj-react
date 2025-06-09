import React, { useState } from "react";
import defaultImg from "../../assets/profile_default.png";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  Divider,
  Stack,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import LanguageIcon from "@mui/icons-material/Language";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {
  PhoneIphone,
  PhoneAndroid,
  WhatsApp,
  AnnouncementTwoTone,
  Announcement,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

const ProfileCard = ({ profile }) => {
  const [loaded, setLoaded] = useState(false);

  const profilePic = Array.isArray(profile.profile_pic)
    ? profile.profile_pic[0] // Si c'est un tableau, prends le premier élément
    : defaultImg || "https://picsum.photos/100"; // Sinon, affiche l'image par défaut

  const handleLoad = () => {
    setLoaded(true);
  };
  const last_login = new Date(profile.last_login);
  const timeAgo = formatDistanceToNow(last_login, { addSuffix: true });

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "auto",
        borderRadius: 3,
        mt: 2,
      }}
    >
      {!loaded && <CardMedia className="shimmer" />}
      {
        <CardMedia
          component="img"
          image={profilePic}
          alt={profile.username}
          sx={{ height: 200, objectFit: "cover" }}
          onLoad={handleLoad}
        />
      }
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {profile.username}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          <EmailIcon fontSize="small" /> {profile.email}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          <LocationOnIcon fontSize="small" /> {profile.city}, {profile.province}
          , {profile.country}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} padding={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <PhoneIphone fontSize="small" /> Phone Number:
            </Typography>
            <Chip label={profile.phone_number || "N/A"} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <WhatsApp fontSize="small" /> WhatsApp Number:
            </Typography>
            <Chip
              label={profile.whatsapp_number || profile.phone_number || "N/A"}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <Announcement fontSize="small" /> Birthday:
            </Typography>
            <Chip label={profile.birthdate || "N/A"} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <AccountCircleIcon fontSize="small" /> Role:
            </Typography>
            <Chip label={profile.role || "N/A"} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <LanguageIcon fontSize="small" /> Language:
            </Typography>
            <Chip label={profile.language || "N/A"} size="small" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              <MonetizationOnIcon fontSize="small" /> Currency:
            </Typography>
            <Chip label={profile.currency || "N/A"} size="small" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" spacing={1} justifyContent="space-between">
          <Chip
            label={`Status: ${profile.account_status || "Active"}`}
            color="primary"
          />

          <Chip
            label={`Plan: ${profile.plan_type || "Free"}`}
            color="secondary"
          />
          <Chip label={`Last Login: ${timeAgo || "Now"}`} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
