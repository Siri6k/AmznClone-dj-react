import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepSelectComponents = ({ formConfig, fieldType }) => {
  const { register } = useFormContext();
  const selectFields = formConfig.data.select;
  return (
    <Box>
      {selectFields.map((field, index) => (
        <FormControl key={field.name} fullWidth margin="normal">
          <InputLabel>{field.label}</InputLabel>
          <Select
            {...register(field.name, { required: field.required })}
            defaultValue={field.default}
            label={field.label}
          >
            {field.options.map((option, index) => (
              <MenuItem key={option.id} value={option.id}>
                {option.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
    </Box>
  );
};

export default StepSelectComponents;
