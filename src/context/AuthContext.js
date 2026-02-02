import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  users: [] // Store all registered users
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };

    case 'REGISTER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    case 'UPDATE_PROFILE':
      const updatedUsers = state.users.map(user =>
        user.email === action.payload.email ? action.payload : user
      );
      return {
        ...state,
        users: updatedUsers,
        user: state.user?.email === action.payload.email ? action.payload : state.user
      };

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedAuthData = localStorage.getItem('smartInventoryAuth');
    if (savedAuthData) {
      const parsedData = JSON.parse(savedAuthData);
      dispatch({ type: 'LOAD_DATA', payload: parsedData });
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('smartInventoryAuth', JSON.stringify(state));
  }, [state]);

  const login = (email, password) => {
    const user = state.users.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      dispatch({ type: 'LOGIN', payload: userWithoutPassword });
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password' };
  };

  const register = (userData) => {
    // Check if user already exists
    const existingUser = state.users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    dispatch({ type: 'REGISTER', payload: newUser });
    
    // Auto login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    dispatch({ type: 'LOGIN', payload: userWithoutPassword });
    
    return { success: true };
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (userData) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: userData });
    return { success: true };
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}