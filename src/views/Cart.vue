<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store/cart";
import CartItem from "../components/cart/CartItem.vue";

const router = useRouter();
const cartStore = useCartStore();

const cartItems = computed(() => cartStore.items);
const totalItems = computed(() => cartStore.totalItems);
const subtotal = computed(() => cartStore.totalPrice);

// Calculate tax (e.g., 8%)
const taxRate = 0.08;
const tax = computed(() => subtotal.value * taxRate);

// Calculate shipping (free over $50)
const shipping = computed(() => {
  return subtotal.value > 50 ? 0 : 4.99;
});

// Calculate total
const total = computed(() => {
  return subtotal.value + tax.value + shipping.value;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity);
};

const removeItem = (productId) => {
  cartStore.removeFromCart(productId);
};

const goToCheckout = () => {
  router.push("/checkout");
};

const continueShopping = () => {
  router.push("/products");
};
</script>

<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header">
        <h1>Корзина покупок</h1>
      </div>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-message">
          <h2>Ваша корзина пуста</h2>
          <p>Похоже, вы еще не добавили ни одного товара в свою корзину.</p>
          <button @click="continueShopping" class="continue-shopping-btn">
            Продолжить покупки
          </button>
        </div>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem
            v-for="item in cartItems"
            :key="item.id"
            :item="item"
            @update-quantity="updateQuantity"
            @remove-item="removeItem"
          />
        </div>

        <div class="cart-summary">
          <h2>Краткое описание заказа</h2>

          <div class="summary-row">
            <span>Итого ({{ totalItems }} товаров)</span>
            <span>{{ formatCurrency(subtotal) }}</span>
          </div>

          <div class="summary-row">
            <span>Налог ({{ taxRate * 100 }}%)</span>
            <span>{{ formatCurrency(tax) }}</span>
          </div>

          <div class="summary-row">
            <span>Доставка</span>
            <span v-if="shipping > 0">{{ formatCurrency(shipping) }}</span>
            <span v-else class="free-shipping">БЕСПЛАТНО</span>
          </div>

          <div class="summary-row total">
            <span>Итого</span>
            <span>{{ formatCurrency(total) }}</span>
          </div>

          <button @click="goToCheckout" class="checkout-btn">Заказать</button>

          <button @click="continueShopping" class="continue-btn">
            Продолжить покупки
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.empty-cart {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-cart-message {
  text-align: center;
  max-width: 500px;
}

.empty-cart-message h2 {
  margin-bottom: var(--spacing-md);
}

.empty-cart-message p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.continue-shopping-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-lg);
}

.cart-items {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.cart-summary {
  background-color: white;
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.cart-summary h2 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  font-size: 0.95rem;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border);
}

.free-shipping {
  color: var(--color-success);
  font-weight: 500;
}

.checkout-btn {
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) 0;
  font-size: 1rem;
}

.continue-btn {
  width: 100%;
  margin-top: var(--spacing-sm);
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.continue-btn:hover {
  background-color: rgba(0, 113, 227, 0.1);
}

@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr 300px;
  }
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    margin-top: var(--spacing-md);
  }
}
</style>
