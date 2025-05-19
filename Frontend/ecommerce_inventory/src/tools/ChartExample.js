import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "@emotion/react";

const LineChartExample = () => {
  const data = [
    { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
    { name: "May", uv: 189, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
  ];
  const theme = useTheme();

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" gutterBottom sx={{ textAlign: "center" }}>
        Linear Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="uv"
            stroke={theme.palette.primary.main}
          />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </Grid>
  );
};

const BarChartExample = () => {
  const theme = useTheme();

  const data = [
    { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
    { name: "May", uv: 189, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
  ];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" gutterBottom sx={{ textAlign: "center" }}>
        Bar Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <Bar dataKey="uv" fill={theme.palette.primary.main} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Grid>
  );
};

const PieChartExample = () => {
  const theme = useTheme();

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" gutterBottom sx={{ textAlign: "center" }}>
        Pie Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            fill={theme.palette.primary.main}
            label
          />
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Grid>
  );
};

const AreaChartExample = () => {
  const theme = useTheme();

  const data = [
    { name: "Jan", uv: 400, pv: 2400, amt: 2400 },
    { name: "Feb", uv: 300, pv: 1398, amt: 2210 },
    { name: "Mar", uv: 200, pv: 9800, amt: 2290 },
    { name: "Apr", uv: 278, pv: 3908, amt: 2000 },
    { name: "May", uv: 189, pv: 4800, amt: 2181 },
    { name: "Jun", uv: 239, pv: 3800, amt: 2500 },
  ];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Typography variant="body2" gutterBottom sx={{ textAlign: "center" }}>
        Area Chart
      </Typography>
      <ResponsiveContainer width="100%" height={300} textAlign="center">
        <AreaChart data={data}>
          <Area
            type="monotone"
            dataKey="uv"
            stroke={theme.palette.secondary.main}
            fill={theme.palette.primary.main}
          />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </Grid>
  );
};

const ChartExamples = () => {
  const theme = useTheme();

  return (
    <Box
      style={{
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: theme.palette.primary.main }}>Chart Examples</h2>

      <Grid container spacing={2} style={{ padding: "20px" }}>
        <LineChartExample />
        <BarChartExample />
        <PieChartExample />
        <AreaChartExample />
      </Grid>
      <Typography
        variant="body2"
        style={{
          color: theme.palette.text.secondary,
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        These are some examples of charts you can create using Recharts. You can
        customize them further based on your requirements.
      </Typography>
    </Box>
  );
};

export default ChartExamples;
