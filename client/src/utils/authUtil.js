// Set user to localStorage
export const setUserInStorage = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

// Get user from localStorage
export const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Remove user from localStorage
export const removeUserFromStorage = () => {
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const user = getUserFromStorage();
  return user && user.token ? true : false;
};

// Check if user is admin
export const isAdmin = () => {
  const user = getUserFromStorage();
  return user && user.role === 'admin';
};