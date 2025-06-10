import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  Toolbar,
  useMediaQuery,
  Typography,
  createTheme,
  useTheme,
  Card,
  CardMedia,
  TextField,
  ThemeProvider,
  CardContent,
  CardActions,
  Menu,
  CircularProgress,
  MenuItem,
  ListItemIcon,
  Breadcrumbs,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
} from "@mui/material";
import { ThemeProvider as Emotion10ThemeProvider } from "@emotion/react";
import "../../layout/style.scss";
import {
  orangeDarkTheme,
  orangeLightTheme,
  basicTheme,
  darkTheme,
  lightTheme,
  customTheme,
  blueLightTheme,
  blueDarkTheme,
  greenLightTheme,
  greenDarkTheme,
  redLightTheme,
  redDarkTheme,
} from "../../layout/themes";
import { GlobalStyles } from "../../layout/GlobalStyle";
import {
  AutoAwesomeTwoTone,
  Settings as SettingsIcon,
  Circle,
  Shop,
  ExpandMore,
  Article,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../utils/Helper";
import Title from "../../components/Title";

const LegalDocuments = () => {
  const [expanded, setExpanded] = useState(null);

  const navigate = useNavigate();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Données simulées - À remplacer par vos vrais textes
  const legalDocs = [
    {
      id: "conditions",
      title: "Conditions Générales de Vente",
      content: (
        <>
          <Typography paragraph>
            <strong>Version applicable au 01/01/2024</strong>
          </Typography>
          <Typography paragraph>
            Ces conditions régissent les ventes sur Niplan Market en RDC. Tout
            achat implique l'acceptation sans réserve des présentes CGV.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Article 1 - Prix
          </Typography>
          <Typography paragraph>
            Les prix sont indiqués en francs congolais (CDF) et incluent les
            taxes applicables.
          </Typography>
          {/* ... Autres articles ... */}
        </>
      ),
    },
    {
      id: "confidentialite",
      title: "Politique de Confidentialité",
      content: (
        <>
          <Typography paragraph>
            Conformément au Règlement ARPTC sur la protection des données
            personnelles.
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Données collectées
          </Typography>
          <Typography paragraph>
            Nous collectons votre numéro de téléphone pour les transactions et
            la livraison.
          </Typography>
          {/* ... Autres sections ... */}
        </>
      ),
    },
    {
      id: "cookies",
      title: "Politique d'Utilisation des Cookies",
      content: (
        <>
          <Typography paragraph>
            Ce site utilise des cookies strictement nécessaires au
            fonctionnement.
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Authentification</li>
            <li>Préférences linguistiques</li>
            <li>Sécurité</li>
          </Box>
        </>
      ),
    },
  ];

  return (
    <>
      <Title
        title="Mentions Légales"
        description="Consultez les mentions légales de Niplan Market, y compris les conditions générales de vente, la politique de confidentialité et l'utilisation des cookies."
        pageTitle="Mentions Légales"
      />
      <Box component={"div"} sx={{ width: "100%" }}>
        <Box
          sx={{
            mx: "auto",
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
            my: "auto",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Article /> Mentions Légales
          </Typography>

          <Typography paragraph sx={{ mb: 3 }}>
            Documents conformes à la législation congolaise (Loi n°17/001 sur le
            commerce électronique)
          </Typography>

          {legalDocs.map((doc) => (
            <Accordion
              key={doc.id}
              expanded={expanded === doc.id}
              onChange={handleChange(doc.id)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight="bold">{doc.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                {doc.content}
                {doc.id === "conditions" && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, fontStyle: "italic" }}
                  >
                    Consultez la version complète sur{" "}
                    <Link href="#" target="_blank">
                      ce lien PDF
                    </Link>
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Typography
            variant="body2"
            sx={{ mt: 3, color: "text.secondary", textAlign: "center" }}
          >
            Dernière mise à jour : {new Date().toLocaleDateString("fr-CD")}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default LegalDocuments;
