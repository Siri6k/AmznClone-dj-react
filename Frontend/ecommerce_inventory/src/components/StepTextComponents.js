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

const StepTextComponents = ({ formConfig, fieldType }) => {
  const { register } = useFormContext();
  const textFields = formConfig.data.text;
  return (
    <Box>
      {textFields.map((field, index) => (
        <FormControl key={field.name} fullWidth margin="normal">
          <TextField
            fullWidth
            label={field.label}
            margin="normal"
            key={field.name}
            defaultValue={field.default}
            placeholder={field.placeholder}
            {...register(field.name, { required: field.required })}
          />
        </FormControl>
      ))}
    </Box>
  );
};

export default StepTextComponents;
