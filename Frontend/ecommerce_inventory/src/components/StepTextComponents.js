import { useEffect, useState } from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepTextComponents = ({ formConfig, fieldType }) => {
  const {
    register,
    formState: { errors },
    reset,
  } = useFormContext();
  const [textFields, setTextFields] = useState(formConfig.data.text);
  useEffect(() => {
    setTextFields(formConfig.data.text);
    const defaultValue = formConfig.data.text.reduce((acc, field) => {
      acc[field.name] = field.default || ""; // Set default value if provided
      return acc;
    }, {});
    reset(defaultValue); // Reset form with default values
  }, [formConfig.data.text]);

  return (
    <Box>
      {textFields.map((field, index) => (
        <FormControl key={field.name} fullWidth margin="normal">
          <TextField
            fullWidth
            label={field.label}
            margin="normal"
            required={field.required}
            key={field.name}
            error={!!errors[field.name]}
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
