// VisitLogger.js
import { useEffect } from "react";
import useApi from "../hooks/APIHandler";
import { getAnonId, getUser } from "../utils/Helper";

const VisitLogger = () => {
  const { error, loading, callApi } = useApi();
  const anon_id = getAnonId();

  useEffect(() => {
    SaveVisit();
  }, []);

  const SaveVisit = async () => {
    // Récupération des cookies
    const allCookies = document.cookie.split("; ").reduce((acc, current) => {
      const [key, value] = current.split("=");
      acc[key] = value;
      return acc;
    }, {});

    // Envoi vers le backend
    if (getUser()) {
      return;
    }
    const result = await callApi({
      url: "save-visit/",
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookies: allCookies,
        anon_id: getAnonId(),
      }),
    });
    if (result) {
      console.log("Visite enregistrée avec succès");
    } else {
      console.error("Erreur lors de l'enregistrement de la visite");
    }
  };

  return null; // Pas besoin de rendre quoi que ce soit
};

export default VisitLogger;
