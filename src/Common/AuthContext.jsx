
// Import React hooks for context, state, and side effects
import { createContext, useState, useEffect } from "react";

// Create a context object for authentication
// Context lets you share values (like user info) across components without passing props manually
export const AuthContext = createContext();

// AuthProvider is a component that wraps your app and provides authentication state to all child components
export function AuthProvider({ children }) {
  // State to track if the user is authenticated
  // The initial value is loaded from localStorage so the login state persists after page reload
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check localStorage for previous authentication status
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // State to store user information (like username, email, etc.)
  // The initial value is loaded from localStorage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    // Parse the stored user JSON, or set to null if not found
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // useEffect runs whenever isAuthenticated or user changes
  // It keeps localStorage in sync with the current authentication state
  useEffect(() => {
    // Save authentication status to localStorage
    localStorage.setItem('isAuthenticated', isAuthenticated);
    if (user) {
      // Save user info as JSON string
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      // Remove user info if user is logged out
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  // Function to log in a user
  // Sets authentication state to true and stores user info
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Function to log out a user
  // Resets authentication state and removes user info from localStorage
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
  };

  // Provide authentication state and functions to all child components
  // Any component inside AuthProvider can access these values using useContext(AuthContext)
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
