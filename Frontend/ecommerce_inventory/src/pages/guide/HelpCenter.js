// src/pages/HelpCenter.jsx
import {
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Alert,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HelpSection from "../../components/HelpSection";
import HelpAccordion from "../../components/HelpAccordion";
import { ExpandMore, IcecreamOutlined, WhatsApp } from "@mui/icons-material";
import HelpCarousel from "../../components/HelpCarousel";
import { imageHelpUrls } from "../../utils/Helper";

const steps = [
  { id: "basic", title: "1. Basic Details – Catégorie, Devise " },
  {
    id: "general",
    title: "2. General Information – Nom, Prix, Ville, Quantité",
  },
  { id: "detailed", title: "3. Detailed Information – Description" },
  { id: "additional", title: "4. Additional Details – Champs clé / valeur" },
  { id: "documents", title: "5. Documents & Files – Images, Upload, Delete" },
  { id: "submit", title: "6. Soumettre le produit" },
  { id: "tips", title: "Astuces rapides" },
  { id: "support", title: "Besoin d’aide ?" },
];

export default function HelpCenter() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Centre d’aide – Publier un produit
      </Typography>

      {/* ➜ Carousel étape par étape */}
      <HelpCarousel />
      <Accordion sx={{ mb: 2, mt: 2 }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Images d'illustrations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack
            spacing={2}
            sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
          >
            {imageHelpUrls.map((url, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{ p: 2, display: "flex", justifyContent: "center" }}
              >
                <img
                  src={url}
                  alt={`Help illustration ${index + 1}`}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Paper>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>
      <>
        <Typography variant="h7" mt={2} mb={1}>
          Astuces
        </Typography>

        <Typography component="ul" variant="body2">
          <li>Photos nettes et lumineuses = + 40 % de ventes.</li>
          <li>Prix ronds (10 000 CDF) convertissent mieux.</li>
          <li>Répondez aux questions dans l’onglet Messages sous 24 h.</li>
          <li>Activez une promo flash pour donner un coup de pouce.</li>
        </Typography>
      </>
      {/* Footer */}
      <Alert
        icon={<HelpOutlineIcon />}
        severity="info"
        sx={{ mt: 4, mb: 2, bottom: 4 }}
      >
        Si vous ne trouvez pas votre réponse:{" "}
        <Link
          href="https://chat.whatsapp.com/FTHebnqzfCdJldoxuDRRAZ?mode=ems_copy_t"
          underline="hover"
          target="_blank"
        >
          Nous joindre sur WhatsApp
        </Link>
      </Alert>
    </Container>
  );
}

/* ------------------------------------------------------------------ */
/* Contenu texte (on le garde ici pour la lisibilité)                  */
/* ------------------------------------------------------------------ */
const content = {
  basic: (
    <>
      <Typography paragraph variant="body2">
        <IcecreamOutlined />
        Sélectionnez la <strong>catégorie la plus précise</strong> : vos
        acheteurs utilisent les filtres.
      </Typography>
      <Typography paragraph variant="body2">
        <IcecreamOutlined />
        <strong>Devise</strong> : choisissez CDF ou USD .{" "}
        <p>
          <em>
            Par defaut, la devise sur la plateforme est le Franc Congolais CDF.
          </em>
        </p>
      </Typography>
    </>
  ),
  general: (
    <>
      <Typography paragraph variant="body2">
        <strong>Nom du produit</strong> : 60 caractères max, sans emoji. Ex.
        « Robe en lin beige taille M ».
      </Typography>
      <Typography paragraph variant="body2">
        <strong>Prix</strong> : chiffre uniquement, pas d’espace, pas de devise.
        Ex. <code>45000</code>.
      </Typography>
      <Typography paragraph variant="body2">
        <strong>Ville</strong> : lieu où vous êtes prêt à livrer. Pré-rempli
        avec « Kinshasa ».
      </Typography>
      <Typography paragraph variant="body2">
        <strong>Quantité</strong> : stock disponible. Mettez 0 pour indiquer «
        épuisé ».
      </Typography>
    </>
  ),
  detailed: (
    <>
      <Typography paragraph variant="body2">
        Décrivez votre article de façon <strong>exhaustive</strong> : matière,
        dimensions, état, histoire, défauts éventuels.
      </Typography>
      <Typography paragraph variant="body2">
        Minimum 30 caractères. Plus vous détaillez, plus vous vendez !
      </Typography>
    </>
  ),
  additional: (
    <>
      <Typography paragraph variant="body2">
        Ajoutez des spécifications sous forme <strong>clé / valeur</strong> :
        couleur, taille, poids, marque, garantie…
      </Typography>
      <Typography paragraph variant="body2">
        Utilisez le bouton <strong>+ ADD</strong> pour créer une nouvelle ligne
        ou la corbeille pour supprimer.
      </Typography>
    </>
  ),
  documents: (
    <>
      <Typography paragraph variant="body2">
        <strong>2 images minimum</strong>, 6 maximum. Formats acceptés : JPG,
        PNG, WebP. Taille max 5 Mo par fichier.
      </Typography>
      <Typography paragraph variant="body2">
        Cliquez sur <strong>« Select fichiers »</strong> ou glissez-déposez. Une
        fois sélectionnées, cliquez sur <strong>« UPLOAD ALL FILES »</strong>.
      </Typography>
      <Typography paragraph variant="body2">
        <strong>« DELETE ALL FILES »</strong> efface la sélection avant upload.
      </Typography>
    </>
  ),
  submit: (
    <>
      <Typography paragraph variant="body2">
        Vérifiez tous vos champs, puis cliquez sur <strong>SUBMIT</strong>.
      </Typography>
      <Typography paragraph variant="body2">
        Votre produit passe en revue (temps moyen : 5 min) puis devient visible
        si le statut est ACTIVE.
      </Typography>
    </>
  ),
  tips: (
    <>
      <Typography component="ul" variant="body2">
        <li>Photos nettes et lumineuses = + 40 % de ventes.</li>
        <li>Prix ronds (10 000 CDF) convertissent mieux.</li>
        <li>Répondez aux questions dans l’onglet Messages sous 24 h.</li>
        <li>Activez une promo flash pour donner un coup de pouce.</li>
      </Typography>
    </>
  ),
  support: (
    <>
      <Typography paragraph variant="body2">
        Chat en direct (9 h-23 h UTC-2){"   "}
      </Typography>
      <Typography paragraph variant="body2">
        <Link
          href="https://chat.whatsapp.com/FTHebnqzfCdJldoxuDRRAZ?mode=ems_copy_t"
          underline="hover"
          target="_blank"
        >
          <WhatsApp color="green" fontSize="small" /> Nous joindre sur WhatsApp
        </Link>
      </Typography>
    </>
  ),
};
