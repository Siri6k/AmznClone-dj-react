import { useFormContext } from "react-hook-form";
import {
  Box,
  Alert,
  Typography,
  IconButton,
  Button,
  LinearProgress,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";
import { toast } from "react-toastify";

import useApi from "../hooks/APIHandler";
import { useEffect, useMemo, useState } from "react";
import {
  checkIsJson,
  getFileMimeTypeFromFileName,
  getFileNameFromUrl,
} from "../utils/Helper";
import JsonInputComponent from "./JsonInputComponent";

const FileInputComponent = ({ field }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    resetField,
  } = useFormContext();
  const { callApi, loading } = useApi();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const stableOldFiles = useMemo(
    () => (Array.isArray(field.default) ? field.default : []),
    [field.default]
  );
  const [fileUploaded, setFileUploaded] = useState(false);
  const [oldFilePreviews, setOldFilePreviews] = useState([]);
  const [newFilesUrl, setNewFilesUrl] = useState([]);

  useEffect(() => {
    if (stableOldFiles.length > 0) {
      setFileUploaded(true);

      const preview = stableOldFiles.map((file, index) => ({
        url: new URL(file),
        name: getFileNameFromUrl(file),
        type: getFileMimeTypeFromFileName(getFileNameFromUrl(file)).split(
          "/"
        )[0],
      }));

      setOldFilePreviews(preview);
    }
  }, [stableOldFiles]);

  // Prévisualisation des nouveaux fichiers
  const currentFiles = watch(field.name);
  useEffect(() => {
    const files = Array.from(currentFiles || []).filter(
      (f) => f instanceof File
    );
    if (files.length > 0) {
      setSelectedFiles(files);

      const preview = files.map((file, index) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.split("/")[0],
      }));
      setFilePreviews(preview);
      setFileUploaded(false);
    }
  }, [currentFiles]);

  // Nettoyage des URLs temporaires
  useEffect(() => {
    return () => {
      filePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [filePreviews]);

  // Construction finale des URLs
  useEffect(() => {
    const finalUrl = [...stableOldFiles, ...newFilesUrl];
    setValue(field.name, finalUrl.length ? finalUrl : []);
  }, [stableOldFiles, newFilesUrl, setValue, field.name]);

  const handleDeleteImageOld = (index) => {
    //Delete actual file
    const updatedFiles = [...stableOldFiles];
    updatedFiles.splice(index, 1);
    stableOldFiles = updatedFiles;

    // Delete actual preview
    const updatedPreviews = [...oldFilePreviews];
    updatedPreviews.splice(index, 1);
    setOldFilePreviews(updatedPreviews);

    setFileUploaded(false);
  };

  const handleDeleteImage = (index) => {
    //Delete actual file
    const updatedFiles = [...filePreviews];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);

    // Delete actual preview
    const updatedPreviews = [...filePreviews];
    updatedPreviews.splice(index, 1);
    setFilePreviews(updatedPreviews);

    setFileUploaded(false);
  };

  useEffect(() => {
    buildFileUrls();
  }, [stableOldFiles, newFilesUrl]);

  const buildFileUrls = () => {
    const finalUrl = [...stableOldFiles, ...newFilesUrl];
    if (finalUrl.length > 0) {
      setValue(field.name, finalUrl);
    } else {
      resetField(field.name);
    }
  };

  const uploadFiles = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const response = await callApi({
        url: "uploads/",
        method: "POST",
        body: formData,
        header: { "Content-Type": "multipart/form-data" },
      });
      if (response?.data?.message) {
        setNewFilesUrl(response?.data?.urls);
        toast.success(response?.data?.message);

        setFileUploaded(true);
      }
    } catch (err) {
      toast.error(err.message);
      setFileUploaded(false);
    }
  };

  const deleteAllFiles = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
    setFileUploaded(false);
  };

  return (
    <>
      {filePreviews.length > 0 &&
        filePreviews.map((file, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            mb={2}
          >
            {file.type === "image" ? (
              <img
                src={file.url}
                alt={file.name}
                style={{ width: "60px", height: "60px" }}
              />
            ) : (
              <DescriptionIcon sx={{ width: "60px", height: "60px" }} />
            )}
            <Typography
              variant="body1"
              p={2}
              sx={{ width: "230px", wordWrap: "break-word" }}
            >
              {file.name}
            </Typography>

            <IconButton
              onClick={() => handleDeleteImage(index)}
              sx={{ color: "red" }}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}

      {!filePreviews.length && (
        <Box p={1} mb={1}>
          <Typography variant="title">{field.label}</Typography>
          <Box component={"div"} className="fileInput" mt={1}>
            <input
              type="file"
              multiple
              {...register(field.name, {
                required: field.required && stableOldFiles.length === 0,
              })}
            />
          </Box>
        </Box>
      )}

      {selectedFiles.length > 0 &&
        !fileUploaded &&
        (loading ? (
          <LinearProgress sx={{ width: "100%" }} />
        ) : (
          <Box
            mt={2}
            sx={{ display: "flex", justifyContent: "space-around" }}
            mb={2}
          >
            <Button onClick={uploadFiles} variant="contained" color="primary">
              Upload All Files
            </Button>
            <Button
              onClick={deleteAllFiles}
              variant="contained"
              color="primary"
            >
              Delete All Files
            </Button>
          </Box>
        ))}
      {oldFilePreviews.length > 0 && (
        <Typography mt={2} variant="h6">
          Modify Old Files
        </Typography>
      )}
      {oldFilePreviews.length > 0 &&
        oldFilePreviews.map((file, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            mb={2}
          >
            {file.type === "image" ? (
              <img
                src={file.url}
                alt={file.name}
                style={{ width: "60px", height: "60px" }}
              />
            ) : (
              <DescriptionIcon sx={{ width: "60px", height: "60px" }} />
            )}
            <Typography
              variant="body1"
              p={2}
              sx={{ width: "230px", wordWrap: "break-word" }}
            >
              {file.name}
            </Typography>

            <IconButton
              onClick={() => handleDeleteImageOld(index)}
              sx={{ color: "red" }}
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      {!!errors[field.name] && (
        <Alert
          variant="outlined"
          severity="error"
          sx={{ marginTop: "10px", marginBottom: "10px" }}
        >
          This Field is Required and Upload the Files if Already Selected
        </Alert>
      )}
    </>
  );
};
export default FileInputComponent;
