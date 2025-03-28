import { useFormContext } from "react-hook-form";
import { Box, Alert } from "@mui/material";

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
          <Box component={"div"} className="fileInput" key={index}>
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
