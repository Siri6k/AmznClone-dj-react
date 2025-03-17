import { Box } from "@mui/material";
import { useFormContext } from "react-hook-form";
import JsonInputComponent from "./JsonInputComponent";

const StepJsonComponents = ({ formConfig, fieldType }) => {
  const { register } = useFormContext();
  const jsonFields = formConfig.data.json;

  return (
    <Box>
      {jsonFields.map((field, index) => (
        <JsonInputComponent fields={field} key={field.name} />
      ))}
    </Box>
  );
};

export default StepJsonComponents;
