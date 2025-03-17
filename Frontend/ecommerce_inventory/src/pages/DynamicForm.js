// Desc: Dynamic form component that will be used to render forms dynamically

import { useParams } from "react-router-dom";
import useApi from "../hooks/APIHandler";
import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Divider,
  LinearProgress,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { current } from "@reduxjs/toolkit";
import { ArrowBackIos, ArrowForwardIos, Save } from "@mui/icons-material";
import { FormProvider, useForm } from "react-hook-form";

import StepSelectComponents from "../components/StepSelectComponents";
import StepSwitchComponents from "../components/StepSwitchComponents";
import StepTextareaComponents from "../components/StepTextareaComponents";
import StepJsonComponents from "../components/StepJsonComponents";
import StepFileComponents from "../components/StepFileComponents";
import StepTextComponents from "../components/StepTextComponents";

const DynamicForm = () => {
  const { formName } = useParams();
  const { loading, error, callApi } = useApi();
  const [formConfig, setFormConfig] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const methods = useForm();
  const [steps, setSteps] = useState([
    {
      component: StepSelectComponents,
      label: "Basic Details",
      fieldType: "select",
    },
    {
      component: StepSwitchComponents,
      label: "Checklist",
      fieldType: "checkbox",
    },
    {
      component: StepTextComponents,
      label: "General Information",
      fieldType: "text",
    },
    {
      component: StepTextareaComponents,
      label: "Detailed information",
      fieldType: "textarea",
    },
    {
      component: StepJsonComponents,
      label: "Additionnal Details",
      fieldType: "json",
    },
    {
      component: StepFileComponents,
      label: "Documents & Files",
      fieldType: "file",
    },
  ]);

  useEffect(() => {
    fetchForm();
  }, [formName]);

  const fetchForm = async () => {
    const response = await callApi({
      url: `http://localhost:8000/api/getForm/${formName}`,
    });
    // Filter steps that have datas
    let stepFilter = steps.filter(
      (step) =>
        response.data.data[step.fieldType] &&
        response.data.data[step.fieldType].length > 0
    );
    setSteps(stepFilter);
    setFormConfig(response.data);
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  const StepComponent = steps[currentStep].component;

  return (
    <Container>
      <Typography variant="h6" gutterBottom>
        Add {formName.toUpperCase()}
      </Typography>
      <Divider sx={{ marginBottom: "15px", marginTop: "15px" }} />
      <Stepper activeStep={currentStep} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={index} onClick={() => goToStep(index)}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Divider sx={{ marginBottom: "15px", marginTop: "15px" }} />
      <Typography variant="h6" gutterBottom>
        {steps[currentStep].label}
      </Typography>
      {/* Section for form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {formConfig ? (
            <StepComponent
              formConfig={formConfig}
              fieldType={steps[currentStep].fieldType}
            />
          ) : (
            <LinearProgress />
          )}

          <Box mt={2} display={"flex"} justifyContent={"space-between"}>
            {currentStep > 0 && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => goToStep(currentStep - 1)}
              >
                <ArrowBackIos sx={{ fontSize: "18px", marginRight: "5px" }} />
                Back
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => goToStep(currentStep + 1)}
              >
                Next
                <ArrowForwardIos sx={{ fontSize: "18px", marginLeft: "5px" }} />
              </Button>
            ) : (
              <Button variant="contained" color="primary" type="submit">
                <Save sx={{ fontSize: "18px", marginRight: "5px" }} />
                Submit
              </Button>
            )}
          </Box>
        </form>
      </FormProvider>
    </Container>
  );
};

export default DynamicForm;
