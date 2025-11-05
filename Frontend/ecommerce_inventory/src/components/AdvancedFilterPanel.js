import {
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";

const AdvancedFilterPanel = ({
  open,
  onClose,
  filterFields,
  onApply,
  onReset,
  loading,
}) => {
  const { control, handleSubmit, reset } = useForm();

  const handleApply = (data) => {
    onApply(data);
  };

  const handleReset = () => {
    reset({});
    onReset();
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 320, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Filtres Avancés
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <form onSubmit={handleSubmit(handleApply)}>
          <Stack spacing={2}>
            {filterFields.map((field) => (
              <Controller
                key={field.key}
                name={field.key}
                control={control}
                render={({ field: controllerField }) =>
                  field.option ? (
                    <TextField
                      select
                      label={field.key}
                      {...controllerField}
                      fullWidth
                    >
                      {field.option.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.value}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <TextField
                      label={field.key}
                      {...controllerField}
                      fullWidth
                    />
                  )
                }
              />
            ))}
          </Stack>

          <Divider sx={{ my: 3 }} />
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              Appliquer
            </Button>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleReset}
            >
              Réinitialiser
            </Button>
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

export default AdvancedFilterPanel;
