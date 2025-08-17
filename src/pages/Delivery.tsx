import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button
} from '@mui/material';
import van from '../assets/delivery-van.jpg';
import clementMap from '../assets/clement-town-map.png';
import GraphView from './GraphView';

interface Delivery {
  id: number;
  address: string;
  urgent: boolean;
  completed?: boolean;
}

interface Node { id: string; x: number; y: number; }
interface GraphData { nodes: Node[]; edges: any[]; }

const fetchGraph = async (): Promise<GraphData> => {
  const res = await fetch('/src/assets/graph.json');
  return res.json();
};

const fetchDeliveries = async (): Promise<Delivery[]> => {
  const res = await fetch('/src/assets/deliveries.json');
  return res.json();
};

function getCurrentTimeSlot(): string {
  const now = new Date();
  const hour = now.getHours();
  // Return a string like '0-9', '9-14', etc.
  if (hour < 5) return '0-5';
  if (hour < 6) return '0-6';
  if (hour < 7) return '6-7';
  if (hour < 8) return '6-8';
  if (hour < 9) return '8-9';
  if (hour < 10) return '9-10';
  if (hour < 12) return '10-12';
  if (hour < 13) return '12-13';
  if (hour < 14) return '12-14';
  if (hour < 15) return '14-15';
  if (hour < 16) return '15-16';
  if (hour < 17) return '16-17';
  if (hour < 18) return '17-18';
  if (hour < 20) return '18-20';
  if (hour < 21) return '20-21';
  if (hour < 22) return '21-22';
  if (hour < 24) return '22-0';
  return '0-9';
}

export default function Delivery() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [pickup, setPickup] = useState<string>('');
  const [dropoff, setDropoff] = useState<string>('');

  const mapWidth = 600;
  const mapHeight = 400;

  useEffect(() => {
    fetchGraph().then(g => setNodes(g.nodes));
    fetchDeliveries().then(setDeliveries);
  }, []);

  const handleComplete = (id: number) => {
    setDeliveries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: true } : d))
    );
  };

  const sorted = [...deliveries].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.urgent === b.urgent) return 0;
    return a.urgent ? -1 : 1;
  });

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: 200,
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundImage: `url(${van})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 3,
            borderRadius: 2,
            textAlign: 'center',
            boxShadow: 2,
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Delivery Prioritization
          </Typography>
          <Typography variant="subtitle1">
            Urgent deliveries are prioritized automatically
          </Typography>
        </Box>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Pickup Node</InputLabel>
            <Select
              value={pickup}
              label="Pickup Node"
              onChange={(e) => setPickup(e.target.value)}
            >
              {nodes.map((node) => (
                <MenuItem key={node.id} value={node.id}>{node.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Drop-off Node</InputLabel>
            <Select
              value={dropoff}
              label="Drop-off Node"
              onChange={(e) => setDropoff(e.target.value)}
            >
              {nodes.map((node) => (
                <MenuItem key={node.id} value={node.id}>{node.id}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {/* Show the graph and shortest path after both nodes are selected */}
        {pickup && dropoff && (
          <Box sx={{ mt: 4 }}>
            <GraphView startNode={pickup} endNode={dropoff} />
          </Box>
        )}
      </Paper>
      <List>
        {sorted.map((d) => (
          <ListItem
            key={d.id}
            secondaryAction={
              !d.completed && (
                <Button
                  color="success"
                  onClick={() => handleComplete(d.id)}
                  variant="outlined"
                >
                  Mark Completed
                </Button>
              )
            }
          >
            <Avatar sx={{ mr: 2 }} src={van} alt="Delivery Van" />
            <ListItemText
              primary={d.address}
              secondary={
                d.urgent ? (
                  <Chip label="URGENT" color="error" size="small" sx={{ mr: 1 }} />
                ) : null
              }
            />
            {d.completed && <Chip label="Done" color="success" size="small" />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 