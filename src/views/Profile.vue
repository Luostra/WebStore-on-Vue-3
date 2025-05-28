<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../store/auth";

const route = useRoute();
const authStore = useAuthStore();

const activeTab = ref("orders");
const showOrderComplete = ref(false);

const user = computed(() => authStore.user);
const orders = computed(() => user.value?.orders || []);

const changeTab = (tab) => {
  activeTab.value = tab;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

onMounted(() => {
  if (route.query.orderComplete === "true") {
    showOrderComplete.value = true;
    setTimeout(() => {
      showOrderComplete.value = false;
    }, 5000);
  }
});
</script>

<template>
  <div class="profile-page">
    <div class="container">
      <div class="page-header">
        <h1>Мой аккаунт</h1>
      </div>

      <div v-if="showOrderComplete" class="order-complete-message">
        <div class="message-content">
          <h3>Заказ успешно выполнен!</h3>
          <p>Благодарим вас за покупку. Ваш заказ размещен и обрабатывается.</p>
        </div>
        <button class="close-btn" @click="showOrderComplete = false">×</button>
      </div>

      <div class="profile-content">
        <div class="profile-sidebar">
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-email">{{ user.email }}</div>
          </div>

          <div class="profile-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'orders' }"
              @click="changeTab('orders')"
            >
              История заказов
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'account' }"
              @click="changeTab('account')"
            >
              Об аккаунте
            </button>
          </div>
        </div>

        <div class="profile-main">
          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="orders-tab">
            <h2>История заказов</h2>

            <div v-if="orders.length === 0" class="no-orders">
              <p>Вы еще не сделали ни одного заказа.</p>
              <router-link to="/products" class="browse-btn"
                >Просмотр продуктов</router-link
              >
            </div>

            <div v-else class="orders-list">
              <div v-for="order in orders" :key="order.id" class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <div class="order-number">Заказ #{{ order.id }}</div>
                    <div class="order-date">{{ formatDate(order.date) }}</div>
                  </div>
                  <div class="order-total">
                    {{ formatCurrency(order.total) }}
                  </div>
                </div>

                <div class="order-items">
                  <div
                    v-for="item in order.items"
                    :key="item.id"
                    class="order-item"
                  >
                    <div class="item-info">
                      <span class="item-quantity">{{ item.quantity }}×</span>
                      <span class="item-name">{{ item.name }}</span>
                    </div>
                    <span class="item-price">{{
                      formatCurrency(item.price * item.quantity)
                    }}</span>
                  </div>
                </div>

                <div class="order-address">
                  <h4>Адрес доставки</h4>
                  <p>
                    {{ order.shippingAddress.firstName }}
                    {{ order.shippingAddress.lastName }}<br />
                    {{ order.shippingAddress.address }}<br />
                    {{ order.shippingAddress.city }},
                    {{ order.shippingAddress.state }}
                    {{ order.shippingAddress.zip }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Tab -->
          <div v-if="activeTab === 'account'" class="account-tab">
            <h2>Об аккаунте</h2>

            <div class="account-info">
              <div class="info-group">
                <label>Имя</label>
                <div>{{ user.name }}</div>
              </div>

              <div class="info-group">
                <label>Email</label>
                <div>{{ user.email }}</div>
              </div>

              <div class="info-group">
                <label>С нами с</label>
                <div>{{ formatDate(new Date().toISOString()) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.order-complete-message {
  background-color: var(--color-success);
  color: white;
  padding: var(--spacing-md);
  border-radius: 8px;
  margin-bottom: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-lg);
}

.profile-sidebar {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.user-info {
  padding: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.user-email {
  font-size: 0.875rem;
  opacity: 0.9;
}

.profile-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  background: none;
  border: none;
  text-align: left;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nav-item:hover {
  background-color: #f5f5f7;
}

.nav-item.active {
  background-color: #f5f5f7;
  font-weight: 500;
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
}

.profile-main {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: var(--spacing-lg);
}

.profile-main h2 {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

.no-orders {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.no-orders p {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-secondary);
}

.browse-btn {
  display: inline-block;
  background-color: var(--color-primary);
  color: white;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.browse-btn:hover {
  background-color: var(--color-primary-light);
  color: white;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.order-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: #f5f5f7;
}

.order-number {
  font-weight: 500;
}

.order-date {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.order-total {
  font-weight: 600;
  color: var(--color-primary);
}

.order-items {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.item-quantity {
  margin-right: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.order-address {
  padding: var(--spacing-md);
}

.order-address h4 {
  margin-bottom: var(--spacing-xs);
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.order-address p {
  font-size: 0.875rem;
  line-height: 1.6;
}

.account-info {
  display: grid;
  gap: var(--spacing-md);
}

.info-group label {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

@media (max-width: 768px) {
  .profile-content {
    grid-template-columns: 1fr;
  }

  .profile-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .nav-item {
    flex: 1;
    text-align: center;
    white-space: nowrap;
    border-bottom: none;
    border-right: 1px solid var(--color-border);
  }

  .nav-item:last-child {
    border-right: none;
  }

  .nav-item.active {
    border-left: none;
    border-bottom: 3px solid var(--color-primary);
  }
}
</style>
