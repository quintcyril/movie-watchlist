import { useContext } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MovieWatchListMain from './Components/MovieWatchlist/Main';
import { AuthProvider, AuthContext } from './Common/AuthContext';
import Login from './Components/Login/Login';
import Navbar from './Common/Navbar';
import Toolbar from '@mui/material/Toolbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from './Common/Sidebar';
import ReviewScreen from './Components/ReviewScreen/ReviewScreen';

function MovieOtherScreen() {
  return (
    <Box sx={{ p: 3 }}>
      <h2>Other Movie Screen</h2>
      <p>This is another movie-related screen.</p>
    </Box>
  );
}

function AppContent() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? (
    <>
      <Navbar />
      <Toolbar />
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<MovieWatchListMain />} />
              <Route pat="/register" element={<Navigate to="/login" />} />
              <Route path="/other" element={<MovieOtherScreen />} />
              <Route path="/reviews" element={<ReviewScreen />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </>
  ) : (
    <Login />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App
