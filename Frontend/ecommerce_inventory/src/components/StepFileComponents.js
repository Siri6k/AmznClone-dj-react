import {
  Alert,
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepFileComponents = ({ formConfig, fieldType }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const fileFields = formConfig.data.file;
  return (
    <Box>
      {fileFields.map((field, index) => (
        <>
          <Box key={field.name} component={"div"} className="fileInput">
            <label>{field.label}</label>
            <input
              type="file"
              {...register(field.name, { required: field.required })}
            />
          </Box>
          {!!errors[field.name] && (
            <Alert variant="outlined" severity="error">
              This Field is Required
            </Alert>
          )}
        </>
      ))}
    </Box>
  );
};

export default StepFileComponents;
