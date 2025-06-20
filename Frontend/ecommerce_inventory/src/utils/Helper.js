import { jwtDecode } from "jwt-decode";

import StepSelectComponents from "../components/StepSelectComponents";
import StepSwitchComponents from "../components/StepSwitchComponents";
import StepTextareaComponents from "../components/StepTextareaComponents";
import StepJsonComponents from "../components/StepJsonComponents";
import StepFileComponents from "../components/StepFileComponents";
import StepTextComponents from "../components/StepTextComponents";
import useApi from "../hooks/APIHandler";
import axios from "axios";
import config from "./config";
import { toast } from "react-toastify";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const refresh = localStorage.getItem("refresh");
  if (!token) {
    return false;
  }

  const anon_id = getUser()?.anon_id;
  localStorage.setItem("anon_id", anon_id || getAnonId());
  try {
    const decodedToken = jwtDecode(token);
    const decodedRefreshToken = jwtDecode(refresh);
    const currentTime = Date.now() / 1000;
    if (decodedRefreshToken.exp < currentTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      return false;
    }
    if (decodedToken.exp < currentTime) {
      refreshToken();
      getUser();
      return true;
    }
    return decodedToken.exp > currentTime;
  } catch (err) {
    return false;
  }
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) {
    return null;
  }

  const gUrl = config.API_URL + "auth/token/refresh/";

  const headers = {
    "Content-Type": "application/json",
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  };

  try {
    const response = await axios.request({
      url: gUrl,
      method: "POST",
      data: { refresh: refresh },
      headers: headers,
    });

    if (response?.status === 200) {
      localStorage.setItem("token", response.data.access);
      if (response.data.refresh) {
        localStorage.setItem("refresh", response.data.refresh);
      }
      return {
        token: response.data.access,
        refresh: response.data.refresh || refresh,
      };
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      return null;
    }
  } catch (err) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    return null;
  }
};

export const getUser = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken;
  } catch (err) {
    return null;
  }
};

export const isValidUrl = (url) => {
  try {
    if (Array.isArray(url)) {
      let image = url.filter(
        (item) => item.match(/\.(jpeg|jpg|gif|png)$/i) != null
      );
      if (image.length > 0) {
        new URL(image[0]);
      } else {
        if (url.length > 0) {
          new URL(url[0]);
        }
      }
    } else if (checkIsJson(url) && JSON.parse(url).length > 0) {
      let image = JSON.parse(url).filter(
        (item) => item.match(/\.(jpeg|jpg|gif|png)$/i) != null
      );
      new URL(image[0]);
    } else {
      new URL(url);
    }
    return true;
  } catch (err) {
    return false;
  }
};

export const getImageUrl = (url) => {
  if (Array.isArray(url)) {
    let image = url.filter(
      (item) => item.match(/\.(jpeg|jpg|gif|png)$/i) != null
    );
    if (image.length > 0) {
      return image[0];
    } else {
      if (url.length > 0) {
        return url[0];
      } else {
        return url;
      }
    }
  } else if (checkIsJson(url) && JSON.parse(url).length > 0) {
    let image = JSON.parse(url).filter(
      (item) => item.match(/\.(jpeg|jpg|gif|png)$/i) != null
    );
    return image[0];
  } else {
    return url;
  }
};

export const checkIsJson = (str) => {
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
};

export const getFormTypes = () => {
  return [
    {
      component: StepSelectComponents,
      label: "Basic Details",
      fieldType: "select",
    },
    {
      component: StepSwitchComponents,
      label: "Checklist",
      fieldType: "checkbox",
    },
    {
      component: StepTextComponents,
      label: "General Information",
      fieldType: "text",
    },
    {
      component: StepTextareaComponents,
      label: "Detailed information",
      fieldType: "textarea",
    },
    {
      component: StepJsonComponents,
      label: "Additionnal Details",
      fieldType: "json",
    },
    {
      component: StepFileComponents,
      label: "Documents & Files",
      fieldType: "file",
    },
  ];
};

export const formatText = (key) => {
  return key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " ");
};

export const getFormType = () => {
  return ["select", "text", "textarea", "checkbox", "json", "file"];
};

export const getFileNameFromUrl = (url) => {
  const parseUrl = new URL(url);
  const pathname = parseUrl.pathname;
  const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
  return filename;
};

export const getFileMimeTypeFromFileName = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  const mimeTypes = {
    txt: "text/plain",
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    jpg: "image/jpg",
    png: "image/png",
    jpeg: "image/jpeg",
    mp3: "audio/mpeg",
  };
  if (extension in mimeTypes) {
    return mimeTypes[extension];
  } else {
    return "other/other";
  }
};

export const formatDateSimple = (isoString) => {
  const date = new Date(isoString);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = String(date.getUTCFullYear()).slice(-2);
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");

  return `${day}-${month}-20${year} ${hours}:${minutes}`;
};

export const normalizedPhoneNumber = (phone_number) => {
  // Remove all non-digit characters first
  let rawPhone = phone_number.replace(/\D/g, "");

  // Handle local numbers (starting with 0 or without country code)
  if (rawPhone.startsWith("0")) {
    return "+243" + rawPhone.slice(1);
  } else if (!rawPhone.startsWith("+") && rawPhone.length > 0) {
    // For numbers without any prefix, assume it's Congo number
    return "+243" + rawPhone;
  }
  // For numbers already with +, just return the digits with +
  // (the replace(/\D/g, "") has already removed all non-digits)
  return "+" + rawPhone;
};

// utils/cookies.js
export function getAnonId() {
  let id = localStorage.getItem("anon_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("anon_id", id);
  }
  return id;
}

export const productInteraction = async (data) => {
  const anon_id = getAnonId();
  const { action, product_id, like } = data;
  if (!product_id) {
    return null;
  }
  const gUrl = config.API_URL + `products/interaction/${product_id}/`;
  const header = {};
  header["Authorization"] = localStorage.getItem("token")
    ? `Bearer ${localStorage.getItem("token")}`
    : "";
  try {
    const response = await axios.request({
      url: gUrl,
      method: "POST",
      body: { action: action, anon_id: anon_id },
      headers: header,
    });
    if (data?.action === "like") {
      toast(response.message);
      return !like;
    }
  } catch (err) {
    return false;
  }
};

export const formatCount = (count) => {
  if (count < 1000) return `${count}`;
  if (count < 1_000_000) return `${(count / 1000).toFixed(1)}k`;
  if (count < 1_000_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${(count / 1_000_000_000).toFixed(1)}B`;
};

export const orderOptions = [
  { label: "Les plus récents", value: "-id" },
  { label: "Les plus likés", value: "-like_count" },
  { label: "Les plus vus", value: "-view_count" },
  { label: "Les plus partagés", value: "-share_count" },
];
