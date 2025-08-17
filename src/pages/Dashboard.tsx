import { Grid, Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { Traffic, Timer, Warning, TrendingUp } from '@mui/icons-material';
import logo from '../assets/logo.png';
import hero from '../assets/traffic-hero.jpg';

const statsCards = [
  {
    title: 'Active Signals',
    value: '24',
    icon: <Traffic sx={{ fontSize: 40, color: 'primary.main' }} />,
    description: 'Traffic signals currently operational',
  },
  {
    title: 'Average Wait Time',
    value: '45s',
    icon: <Timer sx={{ fontSize: 40, color: 'secondary.main' }} />,
    description: 'Average vehicle wait time',
  },
  {
    title: 'Congestion Alerts',
    value: '3',
    icon: <Warning sx={{ fontSize: 40, color: 'warning.main' }} />,
    description: 'Active congestion warnings',
  },
  {
    title: 'Traffic Flow Rate',
    value: '850/h',
    icon: <TrendingUp sx={{ fontSize: 40, color: 'success.main' }} />,
    description: 'Vehicles per hour',
  },
];

export default function Dashboard() {
  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: 260,
          mb: 4,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: 3,
          backgroundImage: `url(${hero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ position: 'absolute', top: 24, left: 24 }}>
          <Avatar src={logo} alt="Logo" sx={{ width: 64, height: 64, boxShadow: 2 }} />
        </Box>
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'rgba(0,0,0,0.5)',
            color: 'white',
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            boxShadow: 2,
          }}
        >
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Welcome to Smart Traffic System
          </Typography>
          <Typography variant="h6">
            Real-time traffic monitoring and delivery prioritization for your city
          </Typography>
        </Box>
      </Box>
      <Typography variant="h4" gutterBottom>
        Traffic System Overview
      </Typography>
      <Grid container spacing={3}>
        {statsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: 'text.secondary' }}
                  >
                    {card.title}
                  </Typography>
                  {card.icon}
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  {card.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
} 