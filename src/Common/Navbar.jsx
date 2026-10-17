import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <AppBar position="fixed" color="primary" sx={{ width: '100%', left: 0, top: 0 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Movie Watchlist
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1">{user.name}</Typography>
            <Button color="inherit" onClick={logout} variant="outlined" sx={{ bgcolor: 'white', color: 'primary.main', borderColor: 'white' }}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
