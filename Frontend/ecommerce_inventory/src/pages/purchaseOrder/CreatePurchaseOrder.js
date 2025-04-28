import {
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  menuItemClasses,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import useApi from "../../hooks/APIHandler";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { getFormType } from "../../utils/Helper";
import CommonInputComponent from "../../components/CommonInputComponent";
import ManageUsers from "../users/ManageUsers";
import ManageProducts from "../product/ManageProducts";
import {
  Add,
  CheckBox,
  CheckBoxOutlineBlank,
  CheckBoxOutlined,
  CheckBoxRounded,
  CheckBoxSharp,
  Close,
  Delete,
  FmdGoodOutlined,
  OneKOutlined,
  Save,
  ViewCompact,
} from "@mui/icons-material";
import JsonInputComponent from "../../components/JsonInputComponent";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CreatePurchaseOrder = () => {
  const { error, loading, callApi } = useApi();
  const { id } = useParams();
  const [poFields, setPoFields] = useState({});
  const [poItemFields, setPoItemFields] = useState({});
  const [suplierEmail, setSuplierEmail] = useState("");
  const [suplierId, setSuplierId] = useState("");
  const [openSelectedSupplier, setOpenSelectedSupplier] = useState(false);
  const [openSelectedProduct, setOpenSelectedProduct] = useState(false);
  const [openAddAdditionalDetails, setOpenAddAdditionalDetails] =
    useState(false);
  const [selectedPoItemIndex, setSelectedPoItemIndex] = useState(null);

  //const [poItems, setPoItems] = useState([]);

  const [fieldType, setFieldType] = useState(getFormType);

  const methods = useForm();
  const navigate = useNavigate();

  const getFormFields = async () => {
    const idVar = id ? id + "/" : "";
    const response = await callApi({
      url: `orders/purchaseOrder/${idVar}`,
    });
    if (response && response.status === 200) {
      setPoFields(response.data.data.poFields);
      setPoItemFields(response.data.data.poItemFields);
      setSuplierEmail(response.data.data?.poData?.supplier_email);
      setSuplierId(response.data.data?.poData?.supplier_id);
      methods.setValue("supplier_id", response.data.data?.poData?.supplier_id);
      methods.setValue("items", response.data.data?.poItems);
    }
  };

  useEffect(() => {
    getFormFields();
  }, []);

  const deleteItem = (index) => {
    let items = methods?.watch("items");
    items = items.filter((item, i) => i !== index);
    methods.setValue("items", items);
  };

  const getPoItems = () => {
    return methods?.watch("items")?.map((item, index) => (
      <TableRow>
        <TableCell>
          <IconButton onClick={() => deleteItem(index)}>
            <Delete color="error" />
          </IconButton>
        </TableCell>
        <TableCell>{item && "sku" in item ? item.sku : ""}</TableCell>
        {fieldType.map((field_type, index1) =>
          poItemFields?.[field_type].map((field, index2) => {
            let tempField = { ...field };
            tempField["default"] = item[tempField?.name];
            tempField["name"] = `items[${index}].${tempField.name}`;
            return (
              <TableCell>
                {field.label === "Additional Details" ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setOpenAddAdditionalDetails(true);
                      setSelectedPoItemIndex(index);
                    }}
                  >
                    Additional Details
                  </Button>
                ) : field.label === "Product Id" ? (
                  <>
                    <Typography variant="body2">{item.product_name}</Typography>
                    <input
                      type="hidden"
                      name={tempField.name}
                      value={item.product_id}
                      {...methods.register(tempField.name)}
                    />
                  </>
                ) : (
                  <CommonInputComponent
                    key={index + "" + index1 + "" + index2}
                    field={tempField}
                    sx={{ width: 150 }}
                  />
                )}
              </TableCell>
            );
          })
        )}
      </TableRow>
    ));
  };

  const onProductSelected = (data) => {
    if (methods?.watch("items")?.some((item) => item.product_id === data.id)) {
      toast.error("Product Already Added");
      return;
    }
    methods?.setValue("items", [
      ...methods?.watch("items"),
      {
        product_id: data.id,
        product_name: data.name,
        quantity_ordered: 1,
        buying_price: data.initial_buying_price,
        selling_price: data.initial_selling_price,
        tax_percentage: data.tax_percentage,
        sku: data.sku,
      },
    ]);
    setOpenSelectedProduct(false);
  };

  const onSubmit = async (data) => {
    if (!methods.watch("supplier_id")) {
      toast.error("Please Select Supplier");
      return;
    }
    if (!methods.watch("items") || methods.watch("items").length === 0) {
      toast.error("Please Select Atleast 1 Product");
      return;
    }
    const idVar = id ? id + "/" : "";
    const response = await callApi({
      url: `orders/purchaseOrder/${idVar}`,
      method: "POST",
      body: data,
    });
    if (response?.status === 201) {
      setSuplierEmail("");
      setSuplierId("");
      methods.reset();
      toast.success(response.data.message);
      if (id) {
        navigate("/manage/purchaseOrder");
      }
    }
  };

  const createOrder = (e, status) => {
    console.log(methods.formState.errors);
    e.preventDefault();
    methods.setValue("status", status);
    if (status === "DRAFT") {
      methods.clearErrors();
      methods.trigger();
    }
    methods.handleSubmit(onSubmit)();
  };

  return (
    <Box>
      <FormProvider {...methods}>
        <form>
          <Breadcrumbs>
            <Typography variant="body2" onClick={() => {}}>
              Home
            </Typography>
            <Typography variant="body2" onClick={() => {}}>
              Create Puchase Order
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6">Purchase Order Details</Typography>
          <Grid container spacing={2} mt={2} mb={2}>
            {fieldType?.map((field_type, index) =>
              poFields?.[field_type]?.map((field, index1) =>
                field.name === "supplier_id" ? (
                  <Grid
                    item
                    xs={12}
                    lg={field.type === "json" ? 12 : 3}
                    md={field.type === "json" ? 12 : 4}
                    sm={field.type === "json" ? 12 : 6}
                    key={index1}
                    mt={3}
                  >
                    {suplierEmail === "" || !suplierEmail ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => setOpenSelectedSupplier(true)}
                      >
                        Select Supplier
                      </Button>
                    ) : (
                      <>
                        <Typography
                          variant="body1"
                          textAlign={"center"}
                          fullWidth
                        >
                          {suplierEmail}
                        </Typography>
                        <input
                          type="hidden"
                          name="supplier_id"
                          value={suplierId}
                          {...methods.register("supplier_id")}
                        />
                      </>
                    )}
                  </Grid>
                ) : (
                  <Grid
                    item
                    xs={12}
                    lg={field.type === "json" ? 12 : 3}
                    md={field.type === "json" ? 12 : 4}
                    sm={field.type === "json" ? 12 : 6}
                    key={index1}
                  >
                    <CommonInputComponent field={field} />
                  </Grid>
                )
              )
            )}
          </Grid>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <Box display={"flex"} justifyContent={"space-between"}>
            <Typography variant="h6">Purchase Order Products</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSelectedProduct(true)}
              startIcon={<Add />}
            >
              Add Product
            </Button>
          </Box>
          <Divider sx={{ mt: 1, mb: 1 }} />
          <TableContainer component={Paper} sx={{ whiteSpace: "nowrap" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell key="action">Action</TableCell>
                  <TableCell key="sku">SKU</TableCell>
                  {fieldType.map((item, index) =>
                    poItemFields?.[item]?.map((field, index2) => (
                      <TableCell key={field.name}>{field.label}</TableCell>
                    ))
                  )}
                </TableRow>
              </TableHead>
              <TableBody>{getPoItems()}</TableBody>
            </Table>
          </TableContainer>
          <Box display={"flex"} justifyContent={"space-between"} mt={2}>
            <Button
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
              fullWidth
              startIcon={<Save />}
              onClick={(e) => createOrder(e, "DRAFT")}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ m: 1 }}
              fullWidth
              startIcon={<CheckBoxSharp />}
              onClick={(e) => createOrder(e, "CREATED")}
            >
              create puchase order
            </Button>
          </Box>
          <Dialog
            open={openSelectedSupplier}
            onClose={() => setOpenSelectedSupplier(false)}
            maxWidth={"lg"}
          >
            <DialogContent>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="h5">Select Supplier</Typography>
                <IconButton onClick={() => setOpenSelectedSupplier(false)}>
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <ManageUsers
                onSupplierSelect={(data) => {
                  setSuplierId(data.id);
                  setSuplierEmail(data.email);
                  setOpenSelectedSupplier(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openSelectedProduct}
            onClose={() => setOpenSelectedProduct(false)}
            maxWidth={"lg"}
          >
            <DialogContent>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="h5">Select Product</Typography>
                <IconButton onClick={() => setOpenSelectedProduct(false)}>
                  <Close />
                </IconButton>
              </Box>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <ManageProducts onProductSelected={onProductSelected} />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openAddAdditionalDetails}
            onClose={() => setOpenAddAdditionalDetails(false)}
            maxWidth={"lg"}
          >
            <DialogContent>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Typography variant="h5">Additional Details</Typography>
                <IconButton onClick={() => setOpenAddAdditionalDetails(false)}>
                  <Close />
                </IconButton>
              </Box>
              <JsonInputComponent
                fields={{
                  //label: "Additional Details",
                  type: "json",
                  name: `items[${selectedPoItemIndex}].additional_details`,
                  default: methods.watch(
                    `items[${selectedPoItemIndex}].additional_details`
                  ),
                }}
              />
            </DialogContent>
          </Dialog>
          <input type="hidden" name="satatus" {...methods.register("status")} />
        </form>
      </FormProvider>
    </Box>
  );
};

export default CreatePurchaseOrder;
