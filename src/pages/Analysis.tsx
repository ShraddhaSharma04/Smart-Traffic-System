import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const travelTimeData = {
  labels: ['Warehouse', 'City Center', 'Shopping District', 'Industrial Zone', 'Residential Area'],
  datasets: [
    {
      label: 'Avg. Travel Time (min)',
      data: [12, 8, 15, 10, 18],
      backgroundColor: 'rgba(25, 118, 210, 0.7)',
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: 'Average Travel Time by Location',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Minutes',
      },
    },
  },
};

export default function Analysis() {
  // Mock summary stats
  const [stats] = useState({
    totalDeliveries: 120,
    avgSpeed: 34,
    busiestJunction: 'City Center',
    peakHour: '17:00 - 18:00',
  });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Traffic System Analysis
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">Total Deliveries</Typography>
            <Typography variant="h3" color="primary">{stats.totalDeliveries}</Typography>
          </Paper>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6">Average Speed</Typography>
            <Typography variant="h3" color="primary">{stats.avgSpeed} km/h</Typography>
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Busiest Junction</Typography>
            <Typography variant="h5">{stats.busiestJunction}</Typography>
            <Typography variant="body2" color="text.secondary">Peak Hour: {stats.peakHour}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Bar options={barOptions} data={travelTimeData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 