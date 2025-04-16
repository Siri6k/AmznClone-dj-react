// File: ManageProducts.js
import React, { useState, useEffect, use, useRef } from "react";
import useApi from "../../hooks/APIHandler";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import {
  Add,
  Circle,
  Close,
  Dashboard,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  PanoramaRounded,
  ViewCompact,
} from "@mui/icons-material";

import RenderImage from "../../components/RenderImge";
import TimeAgo from "../../components/TimeAgo";
import Image from "../../components/Image";
import ManageReviews from "./ManageReviews";
import ManageQuestions from "./ManageQuestions";

const ManageProducts = () => {
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [columns, setColumns] = useState([]);
  const [jsonData, setJsonData] = useState([]);
  const [modelTitle, setModelTitle] = useState("");

  const [open, setOpen] = useState(false);

  const [htmlData, setHTMLData] = useState("");

  const [openHtml, setOpenHtml] = useState(false);

  const handleclose = () => {
    setOpen(false);
  };

  const handleclose2 = () => {
    setOpenHtml(false);
  };

  const { error, loading, callApi } = useApi();
  const [url, setUrl] = useState("");

  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  //for showing reviews or questions pages
  const [showReviews, setShowReviews] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  //for scrolling to grid images
  const divImage = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data after 1 second
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const getProducts = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: "products/",
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

  useEffect(() => {
    if (url) {
      navigate(url);
    }
  }, [url]);

  const onDeleteClick = (params) => {
    console.log(params);
  };

  const onEditClick = (params) => {
    setUrl(`/form/product/${params.row.id}`);
  };

  const onAddClick = (params) => {
    setUrl("/form/product");
  };

  const showJSONData = (item, title) => {
    setModelTitle(title);
    setOpen(true);
    setJsonData(item);
  };
  const showHTMLDescription = (data) => {
    setHTMLData(data);
    setOpenHtml(true);
  };

  const generateColumns = (data) => {
    if (data.length > 0 && typeof data[0] === "object") {
      let columns = [
        {
          field: "action",
          headerName: "Action",
          width: 220,
          sortable: false,
          renderCell: (params) => {
            return (
              <>
                <IconButton onClick={() => onAddClick(params)}>
                  <Add color="light" />
                </IconButton>
                <IconButton onClick={() => onEditClick(params)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => onDeleteClick(params)}>
                  <Delete color="secondary" />
                </IconButton>
              </>
            );
          },
        },
      ];
      for (const key in data[0]) {
        if (key === "image") {
          columns.push({
            field: key,
            headerName:
              key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Box display={"flex"}>
                  <RenderImage data={params.row.image} name={params.row.name} />
                  <IconButton
                    onClick={() => {
                      setSelectedImages(params.row.image);
                      setShowImages(true);
                    }}
                  >
                    <PanoramaRounded />
                  </IconButton>
                </Box>
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
      columns.push({
        field: "questions",
        headerName: "Questions",
        width: 150,
        sortable: false,
        renderCell: (params) => {
          return (
            <Button
              startIcon={<ViewCompact />}
              variant="contained"
              onClick={() => {
                setShowQuestions(true);
                setShowReviews(false);
                setSelectedProductId(params.row.id);
              }}
            >
              View
            </Button>
          );
        },
      });
      columns.push({
        field: "reviews",
        headerName: "Reviews",
        width: 150,
        sortable: false,
        renderCell: (params) => {
          return (
            <Button
              startIcon={<ViewCompact />}
              variant="contained"
              onClick={() => {
                setShowReviews(true);
                setShowQuestions(false);
                setSelectedProductId(params.row.id);
              }}
            >
              View
            </Button>
          );
        },
      });
      columns = columns.map((column) => {
        if (
          column.field === "specifications" ||
          column.field === "highlights" ||
          column.field === "seo_keywords" ||
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

        if (column.field === "html_description") {
          return {
            field: "html_description",
            headerName: "HTML Description",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Button
                  onClick={() =>
                    showHTMLDescription(params.row.html_description)
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

        return column;
      });
      setColumns(columns);
    }
  };

  useEffect(() => {
    if (showImages) {
      divImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedImages]);

  useEffect(() => {
    getProducts();
  }, [paginationModel, debounceSearch, ordering]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Breadcrumbs>
        <Typography variant="body2" onClick={() => navigate("/home")}>
          Home
        </Typography>
        <Typography variant="body2" onClick={() => navigate("/manage/product")}>
          Manage Products
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={showImages ? 8 : 12} lg={showImages ? 9 : 12}>
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
            autoHeight={true}
            rowHeight={75}
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
            sm={4}
            lg={3}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">Product Images</Typography>
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
      </Grid>

      <Dialog
        open={open}
        onClose={handleclose}
        maxWidth={"lg"}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography variant="h5">{modelTitle} Details</Typography>
          <Divider sx={{ margin: "10px 0" }} />
          {jsonData.map((item, index) => (
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
        open={openHtml}
        onClose={handleclose2}
        maxWidth={"lg"}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <Typography variant="h5">HTML Description</Typography>
          <Divider sx={{ margin: "10px 0" }} />
          <div dangerouslySetInnerHTML={{ __html: htmlData }}></div>
          <Divider sx={{ margin: "5px 0" }} />
        </DialogContent>
      </Dialog>
      {showReviews && (
        <Dialog
          open={showReviews}
          fullWidth={true}
          maxWidth={"lg"}
          onClose={() => setShowReviews(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <ManageReviews product_id={selectedProductId} />
            <Divider sx={{ margin: "5px 0" }} />
          </DialogContent>
        </Dialog>
      )}
      {showQuestions && (
        <Dialog
          open={showQuestions}
          fullWidth={true}
          maxWidth={"lg"}
          onClose={() => setShowQuestions(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <ManageQuestions product_id={selectedProductId} />
            <Divider sx={{ margin: "5px 0" }} />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ManageProducts;
