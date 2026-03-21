import { useState, useContext } from "react";
import { AuthContext } from "../../Common/AuthContext";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/users.json");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password
      );
      if (user) {
        login(user);
        setError("");
        // Optionally redirect to watchlist
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Error fetching user data");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: '#45ADED',
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          sx={{bgcolor: "white", borderRadius: 1,}}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{bgcolor: "white", borderRadius: 1,}}
        />
        <Button type="submit" variant="contained" color="white" fullWidth>
          Login
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
}

export default Login;
