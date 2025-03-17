import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepSwitchComponents = ({ formConfig, fieldType }) => {
  const { register } = useFormContext();
  const checkboxFields = formConfig.data.checkbox;
  return (
    <Box>
      {checkboxFields.map((field, index) => (
        <FormControl key={field.name} fullWidth margin="normal">
          <FormControlLabel
            control={
              <Switch
                {...register(field.name, { required: field.required })}
                defaultValue={field.default}
              />
            }
            label={field.label}
          ></FormControlLabel>
        </FormControl>
      ))}
    </Box>
  );
};

export default StepSwitchComponents;
