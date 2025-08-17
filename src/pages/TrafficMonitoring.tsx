import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { SelectChangeEvent } from '@mui/material';
// import Analytics from './pages/Analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const generateData = () => {
  const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  return {
    labels,
    datasets: [
      {
        label: 'Vehicle Count',
        data: labels.map(() => Math.floor(Math.random() * 100) + 50),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Average Speed (km/h)',
        data: labels.map(() => Math.floor(Math.random() * 30) + 30),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };
};

export default function TrafficMonitoring() {
  const [selectedJunction, setSelectedJunction] = useState('1');
  const [trafficData] = useState(generateData());

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Traffic Flow Analysis',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Traffic Monitoring
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ minWidth: 120, mb: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Junction</InputLabel>
                  <Select
                    value={selectedJunction}
                    label="Junction"
                    onChange={(e: SelectChangeEvent) => setSelectedJunction(e.target.value)}
                  >
                    <MenuItem value="1">Junction 1 - City Center</MenuItem>
                    <MenuItem value="2">Junction 2 - Shopping District</MenuItem>
                    <MenuItem value="3">Junction 3 - Industrial Zone</MenuItem>
                    <MenuItem value="4">Junction 4 - Residential Area</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ height: 400 }}>
                <Line options={options} data={trafficData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
} 