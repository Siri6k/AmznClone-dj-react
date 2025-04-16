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
  EditNote,
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
import { set } from "date-fns";

const ManageQuestions = ({ product_id }) => {
  const [data, setData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editId, setEditId] = useState(null);

  const [ordering, setOrdering] = useState([
    {
      field: "id",
      sort: "desc",
    },
  ]);

  const [columns, setColumns] = useState([]);

  const [userList, setUserList] = useState([]);
  const { error, loading, callApi } = useApi();
  const [url, setUrl] = useState("");
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

  const editQuestion = (row) => {
    setValue("question", row.question);
    setValue("answer", row.answer);
    setEditId(row.id);
    setShowAddQuestion(true);
  };

  useEffect(() => {
    // Fetch data after 1 second
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const onSubmitAddQuestion = async (data) => {
    let result = null;
    if (editId) {
      result = await callApi({
        url: `products/updateProductQuestion/${product_id}/${editId}/`,
        method: "PATCH",
        body: data,
      });
    } else {
      result = await callApi({
        url: `products/createProductQuestion/${product_id}/`,
        method: "POST",
        body: data,
      });
    }
    if (result) {
      reset();
      getQuestions();
      setShowAddQuestion(false);
    }
  };

  const getQuestions = async () => {
    let order = "-id";
    if (ordering.length > 0) {
      order =
        ordering[0].sort === "asc"
          ? ordering[0].field
          : "-" + ordering[0].field;
    }
    const result = await callApi({
      url: `products/productQuestions/${product_id}/`,
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

  const toggleStatus = async (id, status) => {
    const result = await callApi({
      url: `products/updateProductQuestion/${product_id}/${id}/`,
      method: "PATCH",
      body: { status: status },
    });
    if (result) {
      getQuestions();
    }
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
              <Box display={"flex"} justifyContent={"center"} mt={3}>
                <IconButton onClick={() => editQuestion(params.row)}>
                  <Edit color="primary" />
                </IconButton>
              </Box>
            );
          },
        },
      ];
      for (const key in data[0]) {
        if (key === "question") {
          columns.push({
            field: "question",
            headerName: "Question",
            width: 300,
          });
        } else if (key === "answer") {
          columns.push({
            field: "answer",
            headerName: "Answer",
            width: 300,
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
    if (showAddQuestion) {
      divImage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showAddQuestion]);

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
    getQuestions();
  }, [paginationModel, debounceSearch, ordering]);

  const handleSorting = (newModel) => {
    setOrdering(newModel);
  };

  return (
    <Box component={"div"} sx={{ width: "100%" }}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="h5">Product Questions</Typography>
        <Button
          startIcon={<AddCircle />}
          variant="contained"
          onClick={() => {
            setShowAddQuestion(true);
            setEditId(null);
            reset();
          }}
        >
          Add Question
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={showAddQuestion ? 7 : 12}
          lg={showAddQuestion ? 9 : 12}
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

        {showAddQuestion && (
          <Grid
            item
            xs={12}
            sm={5}
            lg={3}
            sx={{ height: "600px", overflowY: "auto" }}
            ref={divImage}
          >
            <Box m={2} display={"flex"} justifyContent={"space-between"}>
              <Typography variant="h6">
                {editId ? "Edit" : "Add"} Question & Answer
              </Typography>
              <IconButton onClick={() => setShowAddQuestion(false)}>
                <Close />
              </IconButton>
            </Box>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmitAddQuestion)}>
                <TextField
                  label="Question"
                  variant="outlined"
                  margin="normal"
                  sx={{ marginBottom: "15px" }}
                  fullWidth
                  {...register("question", {
                    required: true,
                  })}
                  error={!!errors.question}
                  helperText={!!error["question"] && "This Field is required"}
                />
                <TextField
                  label="Answer"
                  variant="outlined"
                  margin="normal"
                  sx={{ marginBottom: "15px" }}
                  fullWidth
                  {...register("answer", {
                    required: true,
                  })}
                  error={!!errors.answer}
                  helperText={!!error["answer"] && "This Field is required"}
                />
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ marginBottom: "15px", marginTop: "15px" }}
                  startIcon={<SaveAltRounded />}
                  fullWidth
                >
                  {editId ? "Update" : "Add"} Question & Answer
                </Button>
              </form>
            </FormProvider>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ManageQuestions;
