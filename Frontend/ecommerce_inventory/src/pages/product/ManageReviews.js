import { useState, useEffect, use, useRef } from "react";
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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Grid from "@mui/material/Grid";

import {
  Add,
  AddCircle,
  Close,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  PanoramaRounded,
  SaveAltRounded,
} from "@mui/icons-material";

import RenderImage from "../../components/RenderImge";
import TimeAgo from "../../components/TimeAgo";
import Image from "../../components/Image";
import { Controller, FormProvider, useForm } from "react-hook-form";
import FileInputComponent from "../../components/FileInputComponent";

const ManageReviews = ({ product_id }) => {
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
    const result = await callApi({
      url: `products/createProductReview/${product_id}/`,
      method: "POST",
      body: data,
    });
    if (result) {
      reset();
      getReviews();
      setShowAddReview(false);
    }
  };

  const getReviews = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: `products/productReviews/${product_id}/`,
      method: "GET",
      params: {
        page: paginationModel.page + 1,
        pageSize: paginationModel.pageSize,
        search: debounceSearch,
        ordering: order,
      },
    });
    if (result) {
      const fetchData = result.data.data.data || [];
      setData(fetchData);
      setTotalItems(result.data.data.totalItems);
      generateColumns(fetchData);
    }
  };

  const toggleStatus = async (id, status) => {
    setShowAddReview(false);
    const result = await callApi({
      url: `products/updateProductReview/${product_id}/${id}/`,
      method: "PATCH",
      body: { status: status },
    });
    if (result) {
      getReviews();
    }
  };

  const generateColumns = (data) => {
    if (data.length > 0 && typeof data[0] === "object") {
      let columns = [];
      for (const key in data[0]) {
        if (key === "review_images") {
          columns.push({
            field: key,
            headerName: "Review Images",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Box display={"flex"}>
                  <RenderImage
                    data={params.row.review_images}
                    name={params.row.name}
                  />
                  <IconButton
                    onClick={() => {
                      setSelectedImages(params.row.review_images);
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
        } else if (key === "status") {
          columns.push({
            field: key,
            headerName: "Status",
            width: 150,
            renderCell: (params) => {
              return params.row.status === "ACTIVE" ? (
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => toggleStatus(params.row.id, "INACTIVE")}
                >
                  ACTIVE
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => toggleStatus(params.row.id, "ACTIVE")}
                >
                  INACTIVE
                </Button>
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

  const getUserList = async () => {
    const result = await callApi({
      url: "auth/users/",
      method: "GET",
    });
    if (result) {
      setUserList(
        result.data.data.map((user) => ({
          id: user.id,
          value: user.email,
        }))
      );
    }
  };
  useEffect(() => {
    getUserList();
  }, []);

  useEffect(() => {
    getReviews();
  }, [paginationModel, debounceSearch, ordering]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5">Product Reviews</Typography>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={() => {
            setShowImages(false);
            setShowAddReview(true);
          }}
        >
          Add Reviews
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={showImages || showAddReview ? 7 : 12}
          lg={showImages || showAddReview ? 9 : 12}
        >
          <TextField
            label="search"
            variant="outlined"
            margin="normal"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
              <Typography variant="h6">Add Reviews</Typography>
              <IconButton onClick={() => setShowAddReview(false)}>
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
    </Box>
  );
};

export default ManageReviews;
