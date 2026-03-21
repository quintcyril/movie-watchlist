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
  const [isRegister, setIsRegister] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/users");
      const users = await response.json();
      const user = users.find(
        (u) => u.username === username && u.password === password,
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuccess("");
    try {
      const newUser = { username, password };
      const res = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      if (res.ok) {
        setRegisterSuccess("Registration successful! You can now log in.");
        setUsername("");
        setPassword("");
        setIsRegister(false);
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Error registering user");
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
        onSubmit={isRegister ? handleRegister : handleSubmit}
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "white",
          minWidth: 320,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          {isRegister ? "Register" : "Login"}
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {isRegister ? "Register" : "Login"}
        </Button>
        <Button
          variant="text"
          color="secondary"
          fullWidth
          onClick={() => {
            setIsRegister((prev) => !prev);
            setError("");
            setRegisterSuccess("");
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </Button>
        {error && <Alert severity="error">{error}</Alert>}
        {registerSuccess && <Alert severity="success">{registerSuccess}</Alert>}
      </Box>
    </Box>
  );
}

export default Login;
