import React, { useEffect, useState } from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepTextComponents = ({ formConfig, fieldType }) => {
  const {
    register,
    formState: { errors },
    watch,
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
        <React.Fragment key={field.name}>
          <FormControl key={field.name} fullWidth margin="normal">
            <TextField
              fullWidth
              label={field.label}
              margin="normal"
              required={field.required}
              key={field.name}
              error={!!errors[field.name]}
              type={
                field.label.toLowerCase().includes("password")
                  ? "password"
                  : "text"
              }
              defaultValue={
                (!field.label.toLowerCase().includes("password") &&
                  field.default) ||
                ""
              }
              placeholder={field.placeholder}
              {...register(field.name, { required: field.required })}
            />
          </FormControl>
          {field.label.toLowerCase().includes("password") && (
            <FormControl fullWidth margin="normal">
              <TextField
                fullWidth
                label={`Confirm ${field.label}`}
                margin="normal"
                required={field.required}
                type="password"
                error={!!errors[`${field.name}Confirmation`]}
                placeholder={`Confirm ${field.placeholder}`}
                {...register(`${field.name}Confirmation`, {
                  required: field.required,
                  validate: (value) =>
                    value === watch(field.name) || "Passwords don't match",
                })}
              />
              {errors[`${field.name}Confirmation`] && (
                <p style={{ color: "red" }}>
                  {errors[`${field.name}Confirmation`].message}
                </p>
              )}
            </FormControl>
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StepTextComponents;
