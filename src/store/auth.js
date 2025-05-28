import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  // Mock user database - in a real app, you'd use a database
  const userDatabase = ref([
    {
      id: 1,
      email: 'user@example.com',
      password: 'password123', // In a real app, you'd hash passwords
      name: 'Demo User',
      orders: []
    }
  ]);

  function register(userData) {
    // Check if user already exists
    const userExists = userDatabase.value.some(u => u.email === userData.email);
    if (userExists) {
      return { success: false, message: 'Email already in use' };
    }

    // Create new user
    const newUser = {
      id: userDatabase.value.length + 1,
      email: userData.email,
      password: userData.password, // In a real app, you'd hash passwords
      name: userData.name,
      orders: []
    };

    userDatabase.value.push(newUser);
    
    // Auto login after registration
    user.value = { ...newUser };
    delete user.value.password;
    
    return { success: true };
  }

  function login(email, password) {
    const foundUser = userDatabase.value.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      // Don't store password in the state
      user.value = { ...foundUser };
      delete user.value.password;
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password' };
  }

  function logout() {
    user.value = null;
  }

  function addOrder(order) {
    if (!user.value) return;
    
    // Add to user's orders
    const userInDb = userDatabase.value.find(u => u.id === user.value.id);
    if (userInDb) {
      userInDb.orders.push(order);
      user.value.orders.push(order);
    }
  }

  return { 
    user, 
    isAuthenticated, 
    register, 
    login, 
    logout,
    addOrder 
  };
}, {
  persist: true
});