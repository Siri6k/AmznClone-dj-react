// src/components/AdvancedFilterPanelInline.jsx
import React from "react";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { formatFieldLabel } from "../utils/Helper";

const AdvancedFilterPanelInline = ({
  open,
  filterFields,
  onApply,
  onReset,
  loading,
}) => {
  const { control, handleSubmit, reset } = useForm();

  const handleApply = (data) => {
    const cleaned = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== null)
    );
    onApply(cleaned);
  };

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box
        sx={{
          borderRadius: 2,
          p: 2,
          mt: 2,
          boxShadow: 1,
        }}
      >
        <form onSubmit={handleSubmit(handleApply)}>
          <Grid container spacing={2}>
            {filterFields.map((field) => (
              <Grid item xs={12} sm={6} md={3} key={field.key}>
                <Controller
                  name={field.key}
                  control={control}
                  render={({ field: controllerField }) =>
                    field.option ? (
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label={formatFieldLabel(field.key)}
                        {...controllerField}
                      >
                        <MenuItem value="">---</MenuItem>
                        {field.option.map((opt) => (
                          <MenuItem key={opt.id} value={opt.id}>
                            {opt.value}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        label={formatFieldLabel(field.key)}
                        {...controllerField}
                      />
                    )
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Appliquer
            </Button>
            <Button variant="outlined" color="error" onClick={handleReset}>
              Réinitialiser
            </Button>
          </Stack>
        </form>
      </Box>
    </Collapse>
  );
};

export default AdvancedFilterPanelInline;
