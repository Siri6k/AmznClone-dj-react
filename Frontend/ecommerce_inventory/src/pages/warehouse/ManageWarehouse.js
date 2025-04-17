// File: ManageWarehouse.js
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
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import {
  Add,
  AddCardOutlined,
  AddCircleOutlineRounded,
  Circle,
  Close,
  Dashboard,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
  GridViewRounded,
  PanoramaRounded,
  ViewCompact,
} from "@mui/icons-material";

import TimeAgo from "../../components/TimeAgo";
import RackAndShelfCard from "./RackAndShelfCard";
import DynamicForm from "../DynamicForm";

const ManageWarehouse = () => {
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

  const handleclose = () => {
    setOpen(false);
  };

  const { error, loading, callApi } = useApi();
  //const [url, setUrl] = useState("");

  const [showAddRackAndShelf, setShowAddRackAndShelf] = useState(false);
  const [showViewRackAndShelf, setShowViewRackAndShelf] = useState(false);
  const [selectedRackAndShelfList, setSelectedRackAndShelfList] = useState([]);
  const [selectedRackAndShelfId, setSelectedRackAndShelfId] = useState(null);

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

  const getWarehouses = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: "inventory/warehouse/",
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

  const onEditClick = (params) => {
    navigate(`/form/warehouse/${params.row.id}`);
  };

  const onAddClick = (params) => {
    navigate("/form/warehouse");
  };

  const showJSONData = (item, title) => {
    setModelTitle(title);
    setOpen(true);
    setJsonData(item);
  };

  const toggleStatus = async (id, status) => {
    const result = await callApi({
      url: `inventory/toggleWarehouse/${id}/`,
      method: "PATCH",
      body: { status: status },
    });
    if (result) {
      getWarehouses();
    }
  };

  const onEditclickRackAndShelf = (id) => {
    console.log("Edit Rack and Shelf", id);
    setSelectedRackAndShelfId(id);
    setShowAddRackAndShelf(true);
    setShowViewRackAndShelf(false);
  };

  const onSaveEvent = async () => {
    setShowAddRackAndShelf(false);
    setSelectedRackAndShelfId(null);
    await getWarehouses();
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
                <IconButton onClick={() => onAddClick(params)}>
                  <Add color="light" />
                </IconButton>
                <IconButton onClick={() => onEditClick(params)}>
                  <Edit color="primary" />
                </IconButton>
              </>
            );
          },
        },
      ];
      for (const key in data[0]) {
        if (key === "rack_shelf_floor") {
          columns.push({
            field: "rack_shelf_floor",
            headerName: "Rack Shelf & Floor",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Box display={"flex"} mt={2}>
                  <IconButton
                    onClick={() => {
                      setSelectedRackAndShelfList(params.row.rack_shelf_floor);
                      setShowAddRackAndShelf(false);
                      setSelectedRackAndShelfId(null);
                      setShowViewRackAndShelf(true);
                    }}
                  >
                    <GridViewRounded color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setShowViewRackAndShelf(false);
                      setSelectedRackAndShelfId(null);
                      setShowAddRackAndShelf(true);
                    }}
                  >
                    <AddCircleOutlineRounded color="primary" />
                  </IconButton>
                </Box>
              );
            },
          });
        } else if (key === "additional_details") {
          columns.push({
            field: "additional_details",
            headerName: "Additional Details",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return (
                <Button
                  onClick={() =>
                    showJSONData(
                      params.row["additional_details"],
                      "Additional Details"
                    )
                  }
                  startIcon={<ViewCompact />}
                  variant="contained"
                >
                  View
                </Button>
              );
            },
          });
        } else if (key === "status") {
          columns.push({
            field: "status",
            headerName: "Status",
            width: 150,
            sortable: false,
            renderCell: (params) => {
              return params.row.status === "ACTIVE" ? (
                <Switch
                  checked={true}
                  onClick={() => toggleStatus(params.row.id, "INACTIVE")}
                />
              ) : (
                <Switch
                  checked={false}
                  onClick={() => toggleStatus(params.row.id, "ACTIVE")}
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
    if (showAddRackAndShelf || showViewRackAndShelf) {
      divImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAddRackAndShelf, showViewRackAndShelf]);

  useEffect(() => {
    getWarehouses();
  }, [paginationModel, debounceSearch, ordering]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Breadcrumbs>
          <Typography variant="body2" onClick={() => navigate("/home")}>
            Home
          </Typography>
          <Typography
            variant="body2"
            onClick={() => navigate("/manage/warehouse")}
          >
            Manage Warehouse
          </Typography>
        </Breadcrumbs>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineRounded />}
          onClick={() => navigate("/form/warehouse")}
        >
          Add Warehouse
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={showAddRackAndShelf || showViewRackAndShelf ? 7 : 12}
          lg={showAddRackAndShelf || showViewRackAndShelf ? 8 : 12}
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

        {showAddRackAndShelf && (
          <Grid
            item
            xs={12}
            sm={5}
            lg={4}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">
                {selectedRackAndShelfId !== null ? "Edit" : "Add"} Rack Shelf &
                Floor
              </Typography>
              <IconButton onClick={() => setShowAddRackAndShelf(false)}>
                <Close />
              </IconButton>
            </Box>
            <DynamicForm
              formNameVar="rackShelfFloor"
              idVar={selectedRackAndShelfId}
              onSaveEvent={onSaveEvent}
            />
            <Divider />
          </Grid>
        )}
        {showViewRackAndShelf && (
          <Grid
            item
            xs={12}
            sm={5}
            lg={4}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">Rack Shelf & Floor List</Typography>
              <IconButton onClick={() => setShowViewRackAndShelf(false)}>
                <Close />
              </IconButton>
            </Box>
            <Divider />
            {selectedRackAndShelfList.length > 0 &&
              selectedRackAndShelfList
                .reverse()
                .map((item, index) => (
                  <RackAndShelfCard
                    key={index}
                    data={item}
                    onEditClick={onEditclickRackAndShelf}
                  />
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
          <Typography variant="h5">{modelTitle}</Typography>
          <Divider sx={{ margin: "10px 0" }} />
          {jsonData.map((item, index) => {
            let displayValue = "";
            if (Array.isArray(item.value)) {
              displayValue = item.value[0];
            } else if (typeof item.value === "object" && item.value !== null) {
              displayValue = Object.keys(item.value)[0];
            } else {
              displayValue = item.value;
            }

            return (
              <React.Fragment key={index}>
                <Typography variant="body1">
                  <Circle sx={{ fontSize: "10px", marginRight: "10px" }} />
                  {item.key} :{" "}
                  {String(displayValue) === "true"
                    ? "Yes"
                    : String(displayValue) === "false"
                    ? "No"
                    : String(displayValue)}
                </Typography>
                <Divider sx={{ margin: "5px 0" }} />
              </React.Fragment>
            );
          })}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ManageWarehouse;
