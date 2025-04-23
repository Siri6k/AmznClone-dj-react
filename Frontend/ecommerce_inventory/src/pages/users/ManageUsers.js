import React, { useState, useEffect, use, useRef } from "react";
import useApi from "../../hooks/APIHandler";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid2,
  Breadcrumbs,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
  Divider,
  Button,
  Rating,
  Autocomplete,
  Switch,
  Collapse,
  Dialog,
  DialogContent,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Grid from "@mui/material/Grid";

import {
  Add,
  AddCircle,
  Circle,
  Close,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  PanoramaRounded,
  SaveAltRounded,
  Security,
  ViewCompact,
} from "@mui/icons-material";

import RenderImage from "../../components/RenderImge";
import TimeAgo from "../../components/TimeAgo";
import Image from "../../components/Image";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FileInputComponent from "../../components/FileInputComponent";
import { formatText } from "../../utils/Helper";
import ManageUserPermissions from "./ManageUserPermissions";

const ManageUsers = () => {
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [filterFields, setFilterFields] = useState([]);
  const [showAdvanceSearch, setShowAdvanceSearch] = useState(false);
  const [aFilterFields, setAFilterFields] = useState([]);
  const [openPermission, setOpenPermission] = useState(false);
  const [openPermissionUserId, setOpenPermissionUserId] = useState(null);

  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [columns, setColumns] = useState([]);

  const [userList, setUserList] = useState([]);
  const { error, loading, callApi } = useApi();
  //const [url, setUrl] = useState("");
  const divImage = useRef();
  const navigate = useNavigate();
  const methods = useForm();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    control,
    reset,
  } = methods;

  useEffect(() => {
    // Fetch data after 1 second
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const onSubmitAddReview = async (data) => {
    /* const result = await callApi({
      url: `auth/userList/`,
      method: "POST",
      body: data,
    });
    if (result) {
      reset();
      getUsers();
      setShowAddReview(false);
    }*/
  };

  const onSubmitFilter = async (data) => {
    const filterData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== "")
    );
    setAFilterFields(filterData);
  };

  const getUsers = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: `auth/userList/`,
      method: "GET",
      params: {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: debounceSearch,
        ordering: order,
        ...aFilterFields,
      },
    });
    if (result) {
      const fetchData = result.data.data.data || [];
      setData(fetchData);
      setTotalItems(result.data.data.totalItems);
      generateColumns(fetchData);
      setFilterFields(result.data.data.filterFields);
    }
  };

  const resetFilter = () => {
    let fields = {};
    for (const field of filterFields) {
      fields[field.key] = null;
    }
    setFilterFields(fields);
    methods.reset(filterFields);
    setAFilterFields({});
  };
  const toggleStatus = async (id, status) => {
    const result = await callApi({
      url: `auth/updateUser/${id}/`,
      method: "PATCH",
      body: { account_status: status },
    });
    if (result) {
      getUsers();
    }
  };

  const [modelTitle, setModelTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [jsonData, setJsonData] = useState([]);

  const showJSONData = (item, title) => {
    setModelTitle(title);
    setOpen(true);
    setJsonData(item);
  };
  const onEditClick = (params) => {
    navigate(`/form/users/${params.row.id}`);
  };

  const generateColumns = (data) => {
    if (data.length > 0 && typeof data[0] === "object") {
      let columns = [
        {
          field: "action",
          headerName: "Action",
          width: 100,
          sortable: false,
          renderCell: (params) => {
            return (
              <>
                <IconButton
                  onClick={() => {
                    onEditClick(params);
                    navigate(0);
                  }}
                >
                  <Edit color="primary" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setOpenPermissionUserId(params.row.id);
                    setOpenPermission(true);
                  }}
                >
                  <Security color="primary" />
                </IconButton>
              </>
            );
          },
        },
      ];
      for (const key in data[0]) {
        if (key === "profile_pic") {
          columns.push({
            field: key,
            headerName: "Profile",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Box display={"flex"}>
                  <RenderImage
                    data={params.row.profile_pic}
                    name={params.row.name}
                  />
                  <IconButton
                    onClick={() => {
                      setSelectedImages(params.row.profile_pic);
                      setShowImages(true);
                      setShowAddReview(false);
                    }}
                  >
                    <PanoramaRounded />
                  </IconButton>
                </Box>
              );
            },
          });
        } else if (key === "rating") {
          columns.push({
            field: "rating",
            headerName: "Rating",
            width: 180,
            renderCell: (params) => {
              return (
                <Box display={"flex"} mt={2}>
                  <Rating value={params.row.rating} readOnly />
                  <Typography>({params.row.rating})</Typography>
                </Box>
              );
            },
          });
        } else if (key === "account_status") {
          columns.push({
            field: key,
            headerName: "Status",
            width: 150,
            renderCell: (params) => {
              return params.row.account_status === "Active" ? (
                <Switch
                  checked={true}
                  onClick={() => toggleStatus(params.row.id, "Inactive")}
                />
              ) : (
                <Switch
                  checked={false}
                  onClick={() => toggleStatus(params.row.id, "Active")}
                />
              );
            },
          });
        } else {
          columns.push({
            field: key,
            headerName:
              key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
            width: 150,
          });
        }
      }

      columns = columns.map((column) => {
        if (
          column.field === "social_media_links" ||
          column.field === "addition_details"
        ) {
          return {
            field: column.field,
            headerName:
              column.field.charAt(0).toUpperCase() +
              column.field.slice(1).replaceAll("_", " "),
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Button
                  onClick={() =>
                    showJSONData(
                      params.row[column.field],
                      column.field.charAt(0).toUpperCase() +
                        column.field.slice(1).replaceAll("_", " ")
                    )
                  }
                  startIcon={<ViewCompact />}
                  variant="contained"
                >
                  View
                </Button>
              );
            },
          };
        }

        if (column.field === "created_at" || column.field === "updated_at") {
          return {
            field: column.field,
            headerName:
              column.field.charAt(0).toUpperCase() +
              column.field.slice(1).replaceAll("_", " "),
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return <TimeAgo timestamp={params.row[column.field]} />;
            },
          };
        }

        return column;
      });

      setColumns(columns);
    }
  };

  useEffect(() => {
    if (showImages || showAddReview) {
      divImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedImages, showAddReview]);

  useEffect(() => {
    getUsers();
  }, [paginationModel, debounceSearch, ordering, aFilterFields]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography variant="body2" onClick={() => navigate("/home")}>
            Home
          </Typography>
          <Typography variant="body2" onClick={() => navigate("/manage/users")}>
            Manage (Customer/Supplier/Admin/Staff)
          </Typography>
        </Breadcrumbs>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={() => {
            navigate("/form/users");
          }}
        >
          Add Users
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={showImages || showAddReview ? 7 : 12}
          lg={showImages || showAddReview ? 9 : 12}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} lg={9} md={8} sm={7}>
              <TextField
                label="search"
                variant="outlined"
                margin="normal"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} lg={3} md={4} sm={5}>
              {showAdvanceSearch ? (
                <Button
                  sx={{ mt: { lg: 3, sm: 3, md: 3 }, mb: { xs: 3 } }}
                  variant="outlined"
                  onClick={() => setShowAdvanceSearch(false)}
                  startIcon={<ExpandLessRounded />}
                  fullWidth
                >
                  advance search
                </Button>
              ) : (
                <Button
                  sx={{ mt: { lg: 3, sm: 3, md: 3 }, mb: { xs: 3 } }}
                  variant="outlined"
                  onClick={() => setShowAdvanceSearch(true)}
                  fullWidth
                  startIcon={<ExpandMoreRounded />}
                >
                  advance search
                </Button>
              )}
            </Grid>
          </Grid>
          <Collapse in={showAdvanceSearch}>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmitFilter)}>
                <Grid container spacing={2}>
                  {filterFields.length > 0 &&
                    filterFields.map((field, index) => (
                      <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        mb={2}
                      >
                        {field.option ? (
                          <Autocomplete
                            {...register(field.key)}
                            sx={{ mt: 2 }}
                            options={field.option}
                            getOptionLabel={(option) => option.value}
                            defaultValue={
                              field.option.find(
                                (option) => option.id === watch(field.name)
                              ) || null
                            }
                            onChange={(event, newValue) => {
                              setValue(field.key, newValue ? newValue.id : "");
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={formatText(field.key)}
                                variant="outlined"
                              />
                            )}
                          />
                        ) : (
                          <TextField
                            label={formatText(field.key)}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register(field.key)}
                          />
                        )}
                      </Grid>
                    ))}
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button
                      sx={{ mt: { lg: 3, sm: 3, md: 3 }, mb: { xs: 3 } }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      startIcon={<SaveAltRounded />}
                      fullWidth
                    >
                      Apply Filter
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Button
                      sx={{ mt: { lg: 3, sm: 3, md: 3 }, mb: { xs: 3 } }}
                      variant="contained"
                      color="primary"
                      type="button"
                      fullWidth
                      onClick={resetFilter}
                    >
                      Reset Filter
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </FormProvider>
          </Collapse>
          <DataGrid
            rows={data}
            columns={columns}
            rowHeight={75}
            autoHeight={true}
            sortingOrder={["asc", "desc"]}
            sortModel={ordering}
            onSortModelChange={handleSorting}
            paginationMode="server"
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: paginationModel },
            }}
            pageSizeOptions={[5, 10, 20]}
            pagination
            rowCount={totalItems}
            loading={loading}
            rowSelection={false}
            onPaginationModelChange={(pagedetails) => {
              setPaginationModel({
                page: pagedetails.page,
                pageSize: pagedetails.pageSize,
              });
            }}
            slots={{
              loadingOverlay: LinearProgress,
              toolbar: GridToolbar,
            }}
          />
        </Grid>

        {showImages && (
          <Grid
            item
            xs={12}
            sm={5}
            lg={3}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">Review Images</Typography>
              <IconButton onClick={() => setShowImages(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider />
            {selectedImages.length > 0 &&
              selectedImages.map((image, index) => (
                <Box
                  key={index}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  margin={2}
                >
                  <Image src={image} style={{ width: "100%" }} />
                </Box>
              ))}
          </Grid>
        )}
        {showAddReview && (
          <Grid
            item
            xs={12}
            sm={5}
            lg={3}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">Add Users</Typography>
              <IconButton onClick={() => navigate("form/users")}>
                <Close />
              </IconButton>
            </Box>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmitAddReview)}>
                <TextField
                  label="Review"
                  variant="outlined"
                  margin="normal"
                  sx={{ marginBottom: "15px" }}
                  fullWidth
                  {...register("reviews", {
                    required: true,
                  })}
                  error={!!errors.reviews}
                  helperText={!!error["reviews"] && "This Field is required"}
                />
                <Controller
                  name="rating"
                  control={control}
                  defaultValue={0}
                  sx={{ marginBottom: "15px" }}
                  render={({ field }) => (
                    <Rating
                      {...field}
                      name="rating"
                      defaultValue={0}
                      precision={0.5}
                      size="large"
                    />
                  )}
                />
                {!!errors["rating"] && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ marginBottom: "15px" }}
                  >
                    This field is required
                  </Typography>
                )}
                <Autocomplete
                  {...register("review_user_id", { required: true })}
                  options={userList}
                  getOptionLabel={(option) => option.value}
                  defaultValue={
                    userList.find(
                      (option) => option.id === watch("rewiew_user_id")
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setValue("review_user_id", newValue ? newValue.id : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Review User"}
                      variant="outlined"
                      sx={{ marginBottom: "15px" }}
                      error={!!errors["review_user_id"]}
                      helperText={
                        !!errors["review_user_id"] && "This Field is Required"
                      }
                    />
                  )}
                />
                <FileInputComponent
                  field={{
                    name: "review_images",
                    required: true,
                    label: "Review Images",
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginBottom: "15px", marginTop: "15px" }}
                  startIcon={<SaveAltRounded />}
                  fullWidth
                >
                  Add Review
                </Button>
              </form>
            </FormProvider>
          </Grid>
        )}
      </Grid>
      <Dialog
        open={open}
        onClose={() => {
          setJsonData([]);
          setOpen(false);
        }}
        maxWidth={"lg"}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography variant="h5">{modelTitle}</Typography>
          <Divider sx={{ margin: "10px 0" }} />
          {!jsonData && <Typography>No {modelTitle}</Typography>}
          {jsonData &&
            jsonData.length > 0 &&
            jsonData.map((item, index) => (
              <React.Fragment key={index}>
                <Typography variant="body1">
                  <Circle sx={{ fontSize: "10px", marginRight: "10px" }} />
                  {item.key} : {item.value}
                </Typography>
                <Divider sx={{ margin: "5px 0" }} />
              </React.Fragment>
            ))}
        </DialogContent>
      </Dialog>
      <Dialog
        open={openPermission}
        onClose={() => {
          setOpenPermissionUserId(null);
          setOpenPermission(false);
        }}
        fullWidth={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <ManageUserPermissions user_id={openPermissionUserId} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
