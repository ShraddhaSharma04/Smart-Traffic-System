import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { lightTheme, darkTheme } from './styles/theme';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TrafficMonitoring from './pages/TrafficMonitoring';
import SignalControl from './pages/SignalControl';
import Analytics from './pages/Analytics';
import Delivery from './pages/Delivery';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Router>
        <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monitoring" element={<TrafficMonitoring />} />
            <Route path="/control" element={<SignalControl />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/delivery" element={<Delivery />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 