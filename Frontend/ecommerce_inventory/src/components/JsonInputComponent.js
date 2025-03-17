import { Box, Button, Divider, IconButton, TextField } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const JsonInputComponent = ({ fields }) => {
  const { register } = useFormContext();
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" }]);

  const handleKeyValueAdd = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };
  const handleKeyValueRemove = (index) => {
    const newKeyValuePairs = keyValuePairs.filter((_, i) => i !== index);
    setKeyValuePairs(newKeyValuePairs);
  };

  return (
    <Box mb={2}>
      <label>{fields.label}</label>
      <Divider sx={{ marginBottom: "15px", marginTop: "10px" }} />
      {keyValuePairs.map((pair, index) => (
        <Box key={index} display={"flex"} alignItems={"center"} mb={2}>
          <TextField
            fullWidth
            margin="normal"
            key={fields.name}
            {...register(`${fields.name}[${index}].key`)}
            label="Key"
            defaultValue={pair.key}
            placeholder="Key"
          />
          <TextField
            fullWidth
            margin="normal"
            key={fields.name}
            {...register(`${fields.name}[${index}].value`)}
            label="Value"
            defaultValue={pair.value}
            placeholder="Value"
          />
          <IconButton
            variant={"outlined"}
            color={"secondary"}
            onClick={() => handleKeyValueRemove(index)}
          >
            <Delete />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="outlined"
        color={"primary"}
        onClick={() => handleKeyValueAdd()}
      >
        <Add /> Add
      </Button>
      <Divider sx={{ marginBottom: "10px", marginTop: "10px" }} />
    </Box>
  );
};

export default JsonInputComponent;
