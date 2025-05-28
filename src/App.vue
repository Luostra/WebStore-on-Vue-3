<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store/auth';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';

const route = useRoute();
const authStore = useAuthStore();

const showHeader = computed(() => {
  return !route.meta.hideHeader;
});

const showFooter = computed(() => {
  return !route.meta.hideFooter;
});
</script>

<template>
  <div class="app">
    <Navbar v-if="showHeader" />
    <main class="main-content">
      <router-view />
    </main>
    <Footer v-if="showFooter" />
  </div>
</template>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 64px; /* Height of navbar */
}
</style>