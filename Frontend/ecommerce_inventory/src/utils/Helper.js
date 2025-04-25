import { jwtDecode } from "jwt-decode";

import StepSelectComponents from "../components/StepSelectComponents";
import StepSwitchComponents from "../components/StepSwitchComponents";
import StepTextareaComponents from "../components/StepTextareaComponents";
import StepJsonComponents from "../components/StepJsonComponents";
import StepFileComponents from "../components/StepFileComponents";
import StepTextComponents from "../components/StepTextComponents";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
    }
    return decodedToken.exp > currentTime;
  } catch (err) {
    return false;
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
