// src/components/HelpCarousel.jsx
import Carousel from "react-material-ui-carousel";
import {
  Paper,
  Typography,
  Stack,
  Link,
  Box,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  AddCircleOutline,
  ArrowBack,
  ArrowBackOutlined,
  ArrowForward,
  ArrowForwardOutlined,
  Delete,
  ExpandMore,
  IcecreamOutlined,
  ThumbUpAltOutlined,
  WhatsApp,
} from "@mui/icons-material";
import { imageHelpUrls } from "../utils/Helper";
import Image from "./Image";
const steps = [
  { id: "basic", title: "1. Basic Details" },

  {
    id: "general",
    title: "2. General Information",
  },
  { id: "detailed", title: "3. Detailed Information" },
  { id: "additional", title: "4. Additional Details" },
  { id: "documents", title: "5. Documents & Files" },
  { id: "submit", title: "6. Soumettre le produit" },
  { id: "tips", title: "Astuces rapides" },
  { id: "support", title: "Besoin d’aide ?" },
];

const content = {
  basic: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} /> Sélectionnez la{" "}
        <strong>Catégorie la plus précise</strong>: Habillement, Electroniques,
        etc.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>Devise</strong> : choisissez CDF ou USD. Par défaut :{" "}
        <em>CDF</em>.
      </Typography>
    </>
  ),

  general: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>Nom du produit</strong> : Ex. « Robe en soie beige taille M » 60
        caractères max, sans emoji.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>Prix</strong> : chiffre uniquement, pas d’espace, pas de devise.
        Ex. <code>45000</code>.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>Ville</strong> : lieu où vous êtes prêt à livrer. Par ex. «
        Kinshasa ».
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>Quantité</strong> : stock disponible. Mettez 0 pour indiquer «
        épuisé ».
      </Typography>
    </>
  ),

  detailed: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Décrivez votre article de façon <strong>exhaustive</strong> : matière,
        dimensions, état, histoire, défauts éventuels.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Minimum 30 caractères. Plus vous détaillez, plus vous vendez !
      </Typography>
    </>
  ),

  additional: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Ajoutez des spécifications sous forme <strong>clé / valeur</strong> :
        ex. couleur-rouge, poids-2kg, marque-Apple, garantie-2ans.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Utilisez le bouton <strong>+ ADD</strong> pour créer une nouvelle ligne
        ou <Delete color="error" fontSize="small" /> pour supprimer la ligne.
      </Typography>
    </>
  ),
  documents: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>2 images minimum</strong>, 6 maximum. Formats acceptés : JPG,
        PNG, WebP. Taille max 5 Mo par fichier.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Cliquez sur <strong>« Select fichiers »</strong> ou glissez-déposez. Une
        fois sélectionnées, cliquez sur <strong>« UPLOAD ALL FILES »</strong>.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        <strong>« DELETE ALL FILES »</strong> efface la sélection avant upload.
      </Typography>
    </>
  ),
  submit: (
    <>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Vérifiez tous vos champs, puis cliquez sur <strong>SUBMIT</strong>.
      </Typography>
      <Typography paragraph variant="body2">
        <ThumbUpAltOutlined color="success" mr={2} />
        Votre produit passe en revue (temps moyen : 5 min) puis devient visible
        si le statut est ACTIVE.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 1 }}
        onClick={() => (window.location.href = "/form/product")}
        startIcon={<AddCircleOutline />}
      >
        Ajoutez un produit
      </Button>
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
        Chat en direct (9 h-23 h UTC-2)
      </Typography>
      <Typography paragraph variant="body2">
        <Link
          href="https://chat.whatsapp.com/FTHebnqzfCdJldoxuDRRAZ?mode=ems_copy_t"
          underline="hover"
          target="_blank"
        >
          <WhatsApp color="success" fontSize="small" sx={{ mr: 1 }} />
          Nous joindre sur WhatsApp
        </Link>
      </Typography>
    </>
  ),
};

export default function HelpCarousel() {
  return (
    <Carousel
      animation="slide"
      autoPlay={false}
      indicators
      fullHeightHover={false}
      navButtonsProps={{ style: { fontSize: 16, padding: 4 } }}
    >
      {steps.map((step) => (
        <Paper key={step.id} sx={{ p: 4, pb: 8, mt: 2 }}>
          {" "}
          {/* pb: 8 = espace pour flèches */}
          <Typography variant="h6" gutterBottom mb={2}>
            {step.title}
          </Typography>
          <Box>{content[step.id]}</Box>
        </Paper>
      ))}
    </Carousel>
  );
}
