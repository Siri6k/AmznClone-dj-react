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
import { useEffect, useState } from "react";

const FileInputComponent = ({ field }) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const { callApi, loading } = useApi();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (!selectedFiles.length && watch(field.name)) {
      console.log(watch(field.name));
      const fileArray = Array.from(watch(field.name) || []);
      setSelectedFiles(fileArray);
      const preview = fileArray.map((file, index) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.type.split("/")[0],
      }));
      console.log(preview);
      setFilePreviews(preview);
      setFileUploaded(false);
    }
  }, [watch(field.name)]);

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
      setValue(field.name, JSON.stringify(response?.data?.urls));
      toast.success(response?.data?.message);
      setFileUploaded(true);
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
            <Typography variant="body1" p={2}>
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
              {...register(field.name, { required: field.required })}
            />
          </Box>
          {!!errors[field.name] && (
            <Alert variant="outlined" severity="error">
              This Field is Required
            </Alert>
          )}
        </Box>
      )}
      {selectedFiles.length > 0 &&
        !fileUploaded &&
        (loading ? (
          <LinearProgress sx={{ width: "100%" }} />
        ) : (
          <Box mt={2} sx={{ display: "flex", justifyContent: "space-around" }}>
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
    </>
  );
};
export default FileInputComponent;
