import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import JsonInputComponent from "./JsonInputComponent";
import { useEffect } from "react";

const CommonInputComponent = ({ field, sx }) => {
  useEffect(() => {
    const selectedOption =
      field?.options?.find((option) => option.id === watch(field.name)) ||
      field?.options?.find((option) => option.id === field.default) ||
      null;
    if (selectedOption) {
      setValue(field.name, selectedOption.id);
    }
    if (field.type === "text" && "isDateTime" in field) {
      const date = new Date(field.default);
      const tzOffset = new Date().getTimezoneOffset() * 6000;
      const localTime = new Date(date.getTime() - tzOffset)
        .toISOString()
        .slice(0, 16);
      setValue(field.name, localTime);
    }
  }, []);

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useFormContext();

  return field.type === "text" ? (
    "isDate" in field ? (
      <TextField
        fullWidth
        label={field.label}
        margin="normal"
        sx={sx}
        required={field.required}
        key={field.name}
        error={!!errors[field.name]}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        placeholder={field.placeholder}
        type="date-local"
        InputLabelProps={{ shrink: true }}
      />
    ) : "isDateTime" in field ? (
      <TextField
        fullWidth
        label={field.label}
        margin="normal"
        sx={sx}
        required={field.required}
        key={field.name}
        error={!!errors[field.name]}
        {...register(field.name, { required: field.required })}
        defaultValue={field.default}
        placeholder={field.placeholder}
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
      />
    ) : (
      <TextField
        fullWidth
        label={
          field.label.includes("Percentage") ? field.label + " %" : field.label
        }
        margin="normal"
        sx={sx}
        required={field.required}
        key={field.name}
        error={!!errors[field.name]}
        defaultValue={field.default}
        placeholder={field.placeholder}
        {...register(field.name, { required: field.required })}
      />
    )
  ) : field.type === "select" ? (
    <FormControl key={field.name} fullWidth margin="normal">
      <Autocomplete
        sx={sx}
        {...register(field.name, { required: field.required })}
        options={field.options}
        getOptionLabel={(option) => option.value}
        defaultValue={
          field.options.find((option) => option.id === watch(field.name)) ||
          field.options.find((option) => option.id === field.default) ||
          null
        }
        onChange={(event, newValue) => {
          setValue(field.name, newValue ? newValue.id : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={field.label}
            variant="outlined"
            error={!!errors[field.name]}
            helperText={!!errors[field.name] && "This Field is Required"}
          />
        )}
      />
    </FormControl>
  ) : field.type === "checkbox" ? (
    <FormControl key={field.name} fullWidth margin="normal" sx={sx}>
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
  ) : field.type === "textarea" ? (
    <TextField
      fullWidth
      sx={sx}
      label={field.label}
      margin="normal"
      required={field.required}
      key={field.name}
      error={!!errors[field.name]}
      defaultValue={field.default}
      placeholder={field.placeholder}
      rows={4}
      multiline
      {...register(field.name, { required: field.required })}
    />
  ) : field.type === "json" ? (
    <JsonInputComponent fields={field} key={field.name} />
  ) : (
    <h2>Field Not Found</h2>
  );
};

export default CommonInputComponent;
