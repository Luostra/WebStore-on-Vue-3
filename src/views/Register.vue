<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const authStore = useAuthStore();

const mounted = ref(false);
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

onMounted(() => {
  mounted.value = true;
});

const register = async () => {
  // Reset error message
  errorMessage.value = "";

  // Validate form
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = "All fields are required";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value = "Password must be at least 6 characters";
    return;
  }

  isLoading.value = true;

  try {
    const result = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    if (result.success) {
      router.push("/");
    } else {
      errorMessage.value = result.message || "Registration failed";
    }
  } catch (error) {
    errorMessage.value = "An error occurred during registration";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="mounted" class="register-page">
    <div class="container">
      <div class="auth-form-container">
        <div class="auth-form">
          <h1>Регистрация</h1>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <form @submit.prevent="register">
            <div class="form-group">
              <label for="name">ФИО</label>
              <input
                type="text"
                id="name"
                v-model="name"
                placeholder="Введите ФИО"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="Введите ваш email"
                required
              />
            </div>

            <div class="form-group">
              <label for="password">Пароль</label>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Придумайте пароль"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="Подтвердите пароль"
                required
              />
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? "Регистрация..." : "Регистрация" }}
            </button>
          </form>

          <div class="auth-links">
            <p>
              Уже есть аккаунт?
              <router-link to="/login">Вход</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
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
  font-size: 1rem;
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
