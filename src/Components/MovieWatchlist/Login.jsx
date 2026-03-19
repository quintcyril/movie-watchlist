import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (username.trim()) {
      onLogin(username);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}