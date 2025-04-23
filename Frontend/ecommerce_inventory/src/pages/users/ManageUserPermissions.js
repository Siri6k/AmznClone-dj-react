import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { Save } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import useApi from "../../hooks/APIHandler";
import { toast } from "react-toastify";

const ManageUserPermissions = ({ user_id }) => {
  const [allowAll, setAllowAll] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const { error, loading, callApi } = useApi();
  const theme = useTheme();

  const savePermissions = async () => {
    let response = await callApi({
      url: `auth/userpermission/${user_id}/`,
      method: "POST",
      body: permissions,
    });
    console.log(response);
    toast.success("Permission Updated Successfully");
  };

  const getUserPermissions = async () => {
    let response = await callApi({
      url: `auth/userpermission/${user_id}/`,
    });
    setPermissions(response.data.data);
  };

  useEffect(() => {
    getUserPermissions();
  }, []);

  const changePermission = (index) => {
    let temp = [...permissions];
    temp[index].children.map((child) => {
      child.is_permission = temp[index].is_permission === 1 ? 0 : 1;
    });
    temp[index].is_permission = temp[index].is_permission === 1 ? 0 : 1;
    setAllowAll(false);
    setPermissions(temp);
  };

  const toggleAllPermission = () => {
    let temp = [...permissions];
    temp.map((permission) => {
      permission.is_permission = allowAll ? 0 : 1;
      permission.children.map((child) => {
        child.is_permission = allowAll ? 0 : 1;
      });
    });
    setPermissions(temp);
    setAllowAll(!allowAll);
  };

  const changePermissionChild = (parent_id, child_id, value) => {
    let temp = [...permissions];
    temp.forEach((permission) => {
      if (permission.module_id === parent_id) {
        permission.children.forEach((child) => {
          if (child.module_id === child_id) {
            child.is_permission = value === 0 ? 1 : 0;
          }
        });
        permission.is_permission = permission.children.some(
          (child) => child.is_permission === 1
        )
          ? 1
          : 0;
      }
    });
    setAllowAll(false);
    setPermissions(temp);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5" mb={2}>
          User Permission
        </Typography>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={allowAll}
                onChange={() => {
                  toggleAllPermission();
                }}
              />
            }
            label="Allow All"
          />
          <Button
            startIcon={<Save />}
            variant="contained"
            onClick={savePermissions}
          >
            Save
          </Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {permissions.map((permission, index) => {
          return (
            <React.Fragment>
              <Grid
                key={permission.id}
                item
                xs={12}
                lg={12}
                display={"flex"}
                justifyContent={"space-between"}
                sx={{ background: theme.palette.background.paper }}
              >
                <Typography variant="body1">
                  {permission.module_name}
                </Typography>
                <Switch
                  checked={permission.is_permission}
                  onChange={() => {
                    changePermission(index);
                  }}
                />
              </Grid>
              {permission.children.map((child, index) => {
                return (
                  <Grid
                    key={child.id}
                    item
                    xs={12}
                    lg={12}
                    display={"flex"}
                    justifyContent={"space-between"}
                    sx={{ background: theme.palette.background.default }}
                  >
                    <Typography variant="body1" sx={{ paddingLeft: "15px" }}>
                      {child.module_name}
                    </Typography>
                    <Switch
                      checked={child.is_permission}
                      onChange={() => {
                        changePermissionChild(
                          child.parent_id_id,
                          child.module_id,
                          child.is_permission
                        );
                      }}
                    />
                  </Grid>
                );
              })}
              <Grid xs={12}>
                <Divider />
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ManageUserPermissions;
