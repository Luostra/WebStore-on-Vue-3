<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../store/auth";
import { useCartStore } from "../../store/cart";

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isMenuOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const cartItemCount = computed(() => cartStore.totalItems);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const logout = () => {
  authStore.logout();
  closeMenu();
  router.push("/");
};
</script>

<template>
  <header class="navbar">
    <div class="container navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="logo" @click="closeMenu"
          >ShopVue</router-link
        >
      </div>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
        <ul class="navbar-links">
          <li><router-link to="/" @click="closeMenu">Главная</router-link></li>
          <li>
            <router-link to="/products" @click="closeMenu">Товары</router-link>
          </li>
          <li v-if="isAuthenticated">
            <router-link to="/profile" @click="closeMenu">Профиль</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login" @click="closeMenu">Вход</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/register" @click="closeMenu"
              >Регистрация</router-link
            >
          </li>
          <li v-if="isAuthenticated">
            <a href="#" @click.prevent="logout">Выход</a>
          </li>
          <li class="cart-icon">
            <router-link to="/cart" @click="closeMenu" class="cart-link">
              <span class="icon">🛒</span>
              <span v-if="cartItemCount > 0" class="cart-count">{{
                cartItemCount
              }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  background-color: var(--color-background);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  transition: color 0.3s ease;
}

.logo:hover {
  color: var(--color-primary-light);
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-links li {
  margin-left: var(--spacing-md);
}

.navbar-links a {
  color: var(--color-text-primary);
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar-links a:hover,
.navbar-links a.router-link-active {
  color: var(--color-primary);
}

.cart-icon {
  position: relative;
}

.cart-link {
  display: flex;
  align-items: center;
}

.cart-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--color-primary);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  height: 3px;
  width: 100%;
  background-color: var(--color-text-primary);
  border-radius: 3px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-menu {
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    background-color: var(--color-background);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: var(--spacing-md) 0;
    flex-direction: column;
    display: none;
  }

  .navbar-menu.is-active {
    display: flex;
  }

  .navbar-links {
    flex-direction: column;
    width: 100%;
  }

  .navbar-links li {
    margin: 0;
    width: 100%;
    text-align: center;
  }

  .navbar-links a {
    display: block;
    padding: var(--spacing-xs) 0;
  }
}
</style>
