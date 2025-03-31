import { useFormContext } from "react-hook-form";
import { Box, Alert } from "@mui/material";
import FileInputComponent from "./FileInputComponent";

const StepFileComponents = ({ formConfig, fieldType }) => {
  return (
    <Box>
      {formConfig?.data?.file?.map((field, index) => (
        <FileInputComponent field={field} key={index} />
      ))}
    </Box>
  );
};
export default StepFileComponents;
