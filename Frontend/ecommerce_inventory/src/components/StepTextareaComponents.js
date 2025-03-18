import {
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

const StepTextareaComponents = ({ formConfig, fieldType }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const textAreaFields = formConfig.data.textarea;
  return (
    <Box>
      {textAreaFields.map((field, index) => (
        <FormControl key={field.name} fullWidth margin="normal">
          <TextField
            fullWidth
            label={field.label}
            margin="normal"
            key={field.name}
            error={!!errors[field.name]}
            defaultValue={field.default}
            placeholder={field.placeholder}
            rows={4}
            multiline
            {...register(field.name, { required: field.required })}
          />
        </FormControl>
      ))}
    </Box>
  );
};

export default StepTextareaComponents;
