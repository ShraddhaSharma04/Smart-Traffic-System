import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface Node {
  id: string;
  x: number;
  y: number;
}
interface Edge {
  from: string;
  to: string;
  weight: number;
}
interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const WIDTH = 800;
const HEIGHT = 600;
const NODE_RADIUS = 18;

interface GraphViewProps {
  startNode?: string;
  endNode?: string;
}

function dijkstra(nodes: Node[], edges: Edge[], start: string, end: string): { path: string[]; distance: number } | null {
  const adj: Record<string, { to: string; weight: number }[]> = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    adj[e.from].push({ to: e.to, weight: e.weight });
    adj[e.to].push({ to: e.from, weight: e.weight }); 
  });
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited: Record<string, boolean> = {};
  nodes.forEach(n => { dist[n.id] = Infinity; prev[n.id] = null; visited[n.id] = false; });
  dist[start] = 0;
  for (let i = 0; i < nodes.length; i++) {
    let u: string | null = null;
    let minDist = Infinity;
    for (const id of Object.keys(dist)) {
      if (!visited[id] && dist[id] < minDist) {
        minDist = dist[id];
        u = id;
      }
    }
    if (u === null) break;
    visited[u] = true;
    if (u === end) break;
    for (const { to, weight } of adj[u]) {
      if (dist[u] + weight < dist[to]) {
        dist[to] = dist[u] + weight;
        prev[to] = u;
      }
    }
  }
  if (dist[end] === Infinity) return null;
  const path: string[] = [];
  let curr: string | null = end;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }
  return { path, distance: dist[end] };
}

function GraphView({ startNode, endNode }: GraphViewProps) {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shortest, setShortest] = useState<{ path: string[]; distance: number } | null>(null);

  useEffect(() => {
    fetch('/src/assets/graph.json')
      .then(res => res.json())
      .then(data => {
        setGraph(data);
        setLoading(false);
        if (startNode && endNode) {
          setShortest(dijkstra(data.nodes, data.edges, startNode, endNode));
        } else {
          setShortest(null);
        }
      });
  }, [startNode, endNode]);

  // Normalize node positions to fit SVG
  function normalize(nodes: Node[]) {
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return nodes.map(n => ({
      ...n,
      nx: ((n.x - minX) / (maxX - minX)) * (WIDTH - 2 * NODE_RADIUS) + NODE_RADIUS,
      ny: HEIGHT - (((n.y - minY) / (maxY - minY)) * (HEIGHT - 2 * NODE_RADIUS) + NODE_RADIUS),
    }));
  }

  if (loading || !graph) return <Box p={4} textAlign="center"><CircularProgress /></Box>;
  const normNodes = normalize(graph.nodes);
  const nodeMap = Object.fromEntries(normNodes.map(n => [n.id, n]));
  const pathSet = new Set(shortest?.path || []);
  const pathEdges = new Set<string>();
  if (shortest && shortest.path.length > 1) {
    for (let i = 0; i < shortest.path.length - 1; i++) {
      pathEdges.add(shortest.path[i] + '-' + shortest.path[i + 1]);
      pathEdges.add(shortest.path[i + 1] + '-' + shortest.path[i]);
    }
  }

  return (
    <Box>
      {shortest ? (
        <Typography variant="h6" color="primary" gutterBottom>
          Shortest Path: {shortest.path.join(' → ')} (Total: {formatTime(shortest.distance)})
        </Typography>
      ) : (
        <Typography variant="h6" color="error" gutterBottom>
          No path found between selected nodes.
        </Typography>
      )}
      <Box sx={{ overflow: 'auto', border: '1px solid #ccc', borderRadius: 2, bgcolor: '#fafafa', p: 2 }}>
        <svg width={WIDTH} height={HEIGHT}>
          {/* Edges */}
          {graph.edges.map((e, i) => {
            const from = nodeMap[e.from];
            const to = nodeMap[e.to];
            if (!from || !to) return null;
            const isPath = pathEdges.has(e.from + '-' + e.to);
            return (
              <g key={i}>
                <line x1={from.nx} y1={from.ny} x2={to.nx} y2={to.ny} stroke={isPath ? '#ff9800' : '#1976d2'} strokeWidth={isPath ? 4 : 2} />
                {/* Edge weight label */}
                <text x={(from.nx + to.nx) / 2} y={(from.ny + to.ny) / 2 - 8} fontSize={12} fill="#333" textAnchor="middle">{e.weight}</text>
              </g>
            );
          })}
          {/* Nodes */}
          {normNodes.map((n, i) => (
            <g key={n.id}>
              <circle cx={n.nx} cy={n.ny} r={NODE_RADIUS} fill={n.id === startNode ? '#43a047' : n.id === endNode ? '#e53935' : pathSet.has(n.id) ? '#ffe082' : '#fff'} stroke="#1976d2" strokeWidth={3} />
              <text x={n.nx} y={n.ny + 4} fontSize={13} fill="#1976d2" textAnchor="middle" fontWeight="bold">{n.id}</text>
            </g>
          ))}
        </svg>
      </Box>
    </Box>
  );
}

function formatTime(minutes: number): string {
  const hr = Math.floor(minutes / 60);
  const min = minutes % 60;
  if (hr > 0 && min > 0) return `${hr} hr ${min} min`;
  if (hr > 0) return `${hr} hr`;
  return `${min} min`;
}

export default GraphView;
export { GraphView }; 