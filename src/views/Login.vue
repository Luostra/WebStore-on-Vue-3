<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const redirectPath = computed(() => route.query.redirect || "/");

const login = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = "Please enter both email and password";
    return;
  }

  isLoading.value = true;

  try {
    const result = await authStore.login(email.value, password.value);

    if (result.success) {
      router.push(redirectPath.value);
    } else {
      errorMessage.value = result.message || "Login failed";
    }
  } catch (error) {
    errorMessage.value = "An error occurred during login";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

// Demo account login
const loginWithDemo = () => {
  email.value = "user@example.com";
  password.value = "password123";
  login();
};
</script>

<template>
  <div class="login-page">
    <div class="container">
      <div class="auth-form-container">
        <div class="auth-form">
          <h1>Вход</h1>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="login">
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Введите email"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Пароль</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Введите пароль"
                required
              />
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? "Вход..." : "Вход" }}
            </button>

            <!--<button
              type="button"
              class="demo-btn"
              @click="loginWithDemo"
              :disabled="isLoading"
            >
              Вход с демо аккаунта
            </button>-->
          </form>

          <div class="auth-links">
            <p>
              Нет аккаунта?
              <router-link to="/register">Регистрация</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  padding: var(--spacing-xl) 0;
}

.auth-form-container {
  display: flex;
  justify-content: center;
}

.auth-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: var(--spacing-lg);
  width: 100%;
  max-width: 400px;
}

.auth-form h1 {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.error-message {
  background-color: #fff2f2;
  color: var(--color-error);
  padding: var(--spacing-sm);
  border-radius: 8px;
  margin-bottom: var(--spacing-md);
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.submit-btn {
  width: 100%;
  padding: var(--spacing-sm) 0;
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.demo-btn {
  width: 100%;
  padding: var(--spacing-sm) 0;
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.demo-btn:hover {
  background-color: rgba(0, 113, 227, 0.1);
}

.auth-links {
  text-align: center;
  margin-top: var(--spacing-lg);
  font-size: 0.875rem;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
