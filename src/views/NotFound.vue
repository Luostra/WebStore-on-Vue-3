<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="not-found-page">
    <div class="container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you are looking for doesn't exist or has been moved.</p>
        <div class="actions">
          <button @click="goBack" class="back-btn">Go Back</button>
          <button @click="goHome" class="home-btn">Go to Homepage</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  padding: var(--spacing-xl) 0;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  margin: 0 auto;
}

.not-found-content h1 {
  font-size: 6rem;
  color: var(--color-primary);
  margin-bottom: var(--spacing-sm);
}

.not-found-content h2 {
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
}

.not-found-content p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.actions {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

.back-btn {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.back-btn:hover {
  background-color: rgba(0, 113, 227, 0.1);
}

.home-btn {
  background-color: var(--color-primary);
  color: white;
}

.home-btn:hover {
  background-color: var(--color-primary-light);
}
</style>