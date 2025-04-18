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
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import Grid from "@mui/material/Grid";

import {
  Add,
  Close,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  PanoramaRounded,
} from "@mui/icons-material";

import ExpandableRow from "./ExpandableRow";
import RenderImage from "../../components/RenderImge";
import { set } from "react-hook-form";
import TimeAgo from "../../components/TimeAgo";
import Image from "../../components/Image";

const ManageCategories = () => {
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

  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [columns, setColumns] = useState([]);

  const { error, loading, callApi } = useApi();
  //const [url, setUrl] = useState("");
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

  const getCategories = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: "products/categories/",
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

  const onDeleteClick = (params) => {
    console.log(params);
  };

  const onEditClick = (params) => {
    navigate(`/form/category/${params.row.id}`);
    //setUrl(`/form/category/${params.row.id}`);
  };

  const onAddClick = (params) => {
    navigate("/form/category");
    //setUrl("/form/category");
  };

  const generateColumns = (data) => {
    if (data.length > 0 && typeof data[0] === "object") {
      let columns = [
        {
          field: "action",
          headerName: "Action",
          width: 180,
          sortable: false,
          renderCell: (params) => {
            return (
              <>
                <IconButton
                  onClick={() => {
                    onAddClick(params);
                    navigate("/form/category", {
                      replace: true,
                    });
                  }}
                >
                  <Add color="light" />
                </IconButton>
                <IconButton
                  onClick={() => {
                    onEditClick(params);             
                    navigate(0);
                  }}
                >
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => onDeleteClick(params)}>
                  <Delete color="secondary" />
                </IconButton>
              </>
            );
          },
        },
        {
          field: "expand",
          headerName: "Expand",
          width: 100,
          sortable: false,
          renderCell: (params) => {
            return (
              <IconButton
                onClick={() => {
                  const updatedRows = data.map((row) => {
                    if (row.id === params.row.id) {
                      if (row?.open) {
                        row.open = false;
                      } else {
                        row.open = true;
                      }
                    }
                    return row;
                  });
                  setData([...updatedRows]);
                }}
              >
                {params.row?.open ? (
                  <ExpandLessRounded />
                ) : (
                  <ExpandMoreRounded />
                )}
              </IconButton>
            );
          },
        },
      ];
      for (const key in data[0]) {
        if (key === "children") {
          columns.push({
            field: key,
            headerName:
              key.charAt(0).toUpperCase() + key.slice(1).replaceAll("_", " "),
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Typography variant="body2" pt={3} pb={3}>
                  {params.row.children?.length}
                </Typography>
              );
            },
          });
        } else if (key === "image") {
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
    if (showImages) {
      divImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedImages]);

  useEffect(() => {
    getCategories();
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
        <Typography
          variant="body2"
          onClick={() => navigate("/manage/category")}
        >
          Manage Category
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
              row: (props) => {
                return (
                  <ExpandableRow
                    props={props}
                    row={props.row}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    setShowImages={setShowImages}
                    setSelectedImages={setSelectedImages}
                  />
                );
              },
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
              <Typography variant="h6">Category Images</Typography>
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
    </Box>
  );
};

export default ManageCategories;
