import { useState, useEffect } from "react";
import useApi from "../../hooks/APIHandler";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Breadcrumbs,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import {
  Add,
  Delete,
  Edit,
  ExpandLessRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";

import { isValidUrl } from "../../utils/Helper";
import ExpandableRow from "./ExpandableRow";
import RenderImage from "../../components/RenderImge";

const ManageCategories = () => {
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

  const { error, loading, callApi } = useApi();
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

  const navUrl = (url) => {
    navigate(url);
    //navigate(0);

    console.log(url);
  };

  const onDeleteClick = (params) => {
    console.log(params);
  };
  const onEditClick = (params) => {
    console.log(params);
    navUrl(`/form/category/${params.row.id}`);
  };

  const onAddClick = (params) => {
    console.log(params);
    navUrl("/form/category");
  };

  const generateColumns = (data) => {
    if (data.length > 0 && typeof data[0] === "object") {
      const columns = [
        {
          field: "action",
          headerName: "Action",
          width: 180,
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
                <RenderImage data={params.row.image} name={params.row.name} />
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
      setColumns(columns);
    }
  };

  useEffect(() => {
    getCategories();
  }, [paginationModel, debounceSearch, ordering]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Breadcrumbs>
        <Typography variant="body2" onClick={() => navigate("/")}>
          Home
        </Typography>
        <Typography
          variant="body2"
          onClick={() => navigate("/manage/category")}
        >
          Manage Category
        </Typography>
      </Breadcrumbs>
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
                row={props.row}
                props={props}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
              />
            );
          },
        }}
      />
    </Box>
  );
};

export default ManageCategories;
