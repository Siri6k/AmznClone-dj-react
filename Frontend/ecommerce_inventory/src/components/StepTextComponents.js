import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useFormContext, useWatch } from "react-hook-form";

const StepTextComponents = ({ formConfig, fieldType }) => {
  const {
    register,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    reset,
    setValue,
  } = useFormContext();
  const [textFields, setTextFields] = useState(formConfig.data.text);
  useEffect(() => {
    setTextFields(formConfig.data.text);
    const defaultValue = formConfig.data.text.reduce((acc, field) => {
      acc[field.name] = field.name.toLowerCase().includes("password")
        ? ""
        : field.default; // Set default value if provided
      return acc;
    }, {});
    reset(defaultValue); // Reset form with default values
  }, [formConfig.data.text]);

  const passwordValue = useWatch({ name: "password" });

  return (
    <Box>
      {textFields.map((field, index) => (
        <React.Fragment key={field.name}>
          {field.name.toLowerCase().includes("phone") && (
            <>
              <Typography variant="body2">Other informations</Typography>
              <Divider sx={{ mt: 2 }} fullWidth />
            </>
          )}
          <FormControl key={field.name} fullWidth margin="normal">
            {field.name.toLowerCase().includes("confirm-password") ? (
              <TextField
                fullWidth
                label={field.label}
                margin="normal"
                required={field.required}
                key={field.name}
                error={!!errors[field.name]}
                type="password"
                defaultValue={field.default}
                placeholder={field.placeholder}
                {...register(field.name, {
                  required: field.required,
                })}
                onChange={(e) => {
                  const value = e.target.value;
                  clearErrors(field.name);
                  if (value !== watch("password")) {
                    setError(field.name, {
                      type: "manual",
                      message: "Passwords do not match",
                    });
                  } else {
                    clearErrors(field.name);
                  }
                }}
                helperText={
                  errors[field.name] ? errors[field.name].message : ""
                }
              />
            ) : (
              <TextField
                fullWidth
                label={field.label}
                margin="normal"
                required={field.required}
                key={field.name}
                type={
                  "isDate" in field
                    ? "date"
                    : "isDateTime" in field
                    ? "datetime-local"
                    : field.name.toLowerCase().includes("password")
                    ? "password"
                    : "text"
                }
                error={!!errors[field.name]}
                defaultValue={
                  "isDateTime" in field || "isDate" in field
                    ? new Date(field.default).toISOString().slice(0, 16)
                    : field.default
                }
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder={field.placeholder}
                helperText={
                  errors[field.name] ? errors[field.name].message : ""
                }
                {...register(field.name, { required: field.required })}
                onChange={(e) => {
                  const value = e.target.value;
                  clearErrors(field.name);
                  if (field.name.toLowerCase().includes("password")) {
                    if (value.length < 8) {
                      setError(field.name, {
                        type: "manual",
                        message: "Password must be at least 8 characters",
                      });
                    } else if (field.name.toLowerCase().includes("email")) {
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (!emailRegex.test(value)) {
                        setError(field.name, {
                          type: "manual",
                          message: "Invalid email address",
                        });
                      }
                    }
                  }
                }}
              />
            )}
          </FormControl>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StepTextComponents;
