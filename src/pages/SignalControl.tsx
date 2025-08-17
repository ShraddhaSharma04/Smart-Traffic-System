import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Chip,
  Stack
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TrafficIcon from '@mui/icons-material/Traffic';

const initialSignals = [
  { id: 1, name: 'CBG', state: 'red', timer: 30 },
  { id: 2, name: 'RHS', state: 'green', timer: 45 },
  { id: 3, name: 'VM', state: 'yellow', timer: 10 },
  { id: 4, name: 'ASAR', state: 'red', timer: 25 },
  { id: 5, name: 'VND', state: 'green', timer: 20 },
];

export default function SignalControl() {
  const [signals, setSignals] = useState(initialSignals);
  const [emergency, setEmergency] = useState<number | null>(null);

  const handleStateChange = (id: number, newState: string) => {
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, state: newState } : s))
    );
  };

  const handleTimerChange = (id: number, value: string) => {
    const timer = parseInt(value, 10) || 0;
    setSignals((prev) =>
      prev.map((s) => (s.id === id ? { ...s, timer } : s))
    );
  };

  const handleEmergency = (id: number) => {
    setEmergency(id);
    setSignals((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, state: 'green' } : { ...s, state: 'red' }
      )
    );
    setTimeout(() => setEmergency(null), 10000); // Reset after 10s
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Traffic Signal Control Panel
      </Typography>
      <Grid container spacing={3}>
        {signals.map((signal) => (
          <Grid item xs={12} md={6} key={signal.id}>
            <Card sx={{ position: 'relative', boxShadow: 4 }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <TrafficIcon color="primary" />
                  <Typography variant="h6">{signal.name}</Typography>
                  {emergency === signal.id && (
                    <Chip
                      icon={<WarningAmberIcon />}
                      label="EMERGENCY"
                      color="error"
                      sx={{ ml: 2 }}
                    />
                  )}
                </Stack>
                <ToggleButtonGroup
                  value={signal.state}
                  exclusive
                  onChange={(_, value) => value && handleStateChange(signal.id, value)}
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="red" color="error">
                    <Box sx={{ width: 16, height: 16, bgcolor: 'red', borderRadius: '50%' }} />
                    <Typography sx={{ ml: 1 }}>Red</Typography>
                  </ToggleButton>
                  <ToggleButton value="yellow" color="warning">
                    <Box sx={{ width: 16, height: 16, bgcolor: 'yellow', borderRadius: '50%' }} />
                    <Typography sx={{ ml: 1 }}>Yellow</Typography>
                  </ToggleButton>
                  <ToggleButton value="green" color="success">
                    <Box sx={{ width: 16, height: 16, bgcolor: 'green', borderRadius: '50%' }} />
                    <Typography sx={{ ml: 1 }}>Green</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
                <Box mb={2}>
                  <TextField
                    label="Timer (sec)"
                    type="number"
                    value={signal.timer}
                    onChange={(e) => handleTimerChange(signal.id, e.target.value)}
                    size="small"
                    sx={{ width: 120 }}
                  />
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleEmergency(signal.id)}
                  disabled={emergency === signal.id}
                  startIcon={<WarningAmberIcon />}
                >
                  Emergency Override
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 