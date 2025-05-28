<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "../store/cart";
import { useAuthStore } from "../store/auth";

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

// Form data
const form = ref({
  firstName: "",
  lastName: "",
  email: authStore.user ? authStore.user.email : "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardName: "",
  cardNumber: "",
  expDate: "",
  cvv: "",
});

// Form errors
const errors = ref({});

// Cart data
const cartItems = computed(() => cartStore.items);
const subtotal = computed(() => cartStore.totalPrice);
const taxRate = 0.08;
const tax = computed(() => subtotal.value * taxRate);
const shipping = computed(() => {
  return subtotal.value > 50 ? 0 : 4.99;
});
const total = computed(() => {
  return subtotal.value + tax.value + shipping.value;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const validateForm = () => {
  const newErrors = {};

  // Validate required fields
  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "address",
    "city",
    "state",
    "zip",
    "cardName",
    "cardNumber",
    "expDate",
    "cvv",
  ];
  requiredFields.forEach((field) => {
    if (!form.value[field].trim()) {
      newErrors[field] = "This field is required";
    }
  });

  // Validate email
  if (
    form.value.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
  ) {
    newErrors.email = "Please enter a valid email address";
  }

  // Validate credit card (simple validation)
  if (
    form.value.cardNumber &&
    !/^\d{16}$/.test(form.value.cardNumber.replace(/\s/g, ""))
  ) {
    newErrors.cardNumber = "Please enter a valid 16-digit card number";
  }

  // Validate expiration date (MM/YY format)
  if (
    form.value.expDate &&
    !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.value.expDate)
  ) {
    newErrors.expDate = "Please enter a valid date in MM/YY format";
  }

  // Validate CVV (3 or 4 digits)
  if (form.value.cvv && !/^\d{3,4}$/.test(form.value.cvv)) {
    newErrors.cvv = "Please enter a valid 3 or 4 digit CVV";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const placeOrder = () => {
  if (!validateForm()) {
    // Scroll to the first error
    const firstErrorField = Object.keys(errors.value)[0];
    document
      .getElementById(firstErrorField)
      ?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  // Create order object
  const order = {
    id: Date.now(),
    date: new Date().toISOString(),
    items: [...cartItems.value],
    subtotal: subtotal.value,
    tax: tax.value,
    shipping: shipping.value,
    total: total.value,
    shippingAddress: {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      address: form.value.address,
      city: form.value.city,
      state: form.value.state,
      zip: form.value.zip,
    },
  };

  // Add order to user's orders
  authStore.addOrder(order);

  // Clear the cart
  cartStore.clearCart();

  // Navigate to confirmation
  router.push({
    path: "/profile",
    query: { orderComplete: "true" },
  });
};
</script>

<template>
  <div class="checkout-page">
    <div class="container">
      <div class="page-header">
        <h1>Проверка</h1>
      </div>

      <div v-if="cartItems.length === 0" class="empty-checkout">
        <div class="empty-checkout-message">
          <h2>Ваша корзина пуста</h2>
          <p>
            Пожалуйста, добавьте товары в свою корзину, прежде чем приступить к
            оформлению заказа.
          </p>
          <button
            @click="router.push('/products')"
            class="continue-shopping-btn"
          >
            Просмотр продуктов
          </button>
        </div>
      </div>

      <div v-else class="checkout-content">
        <div class="checkout-form">
          <form @submit.prevent="placeOrder">
            <div class="form-section">
              <h2>Информация о доставке</h2>

              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">Имя</label>
                  <input
                    type="text"
                    id="firstName"
                    v-model="form.firstName"
                    :class="{ error: errors.firstName }"
                  />
                  <div v-if="errors.firstName" class="error-text">
                    {{ errors.firstName }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="lastName">Фамилия</label>
                  <input
                    type="text"
                    id="lastName"
                    v-model="form.lastName"
                    :class="{ error: errors.lastName }"
                  />
                  <div v-if="errors.lastName" class="error-text">
                    {{ errors.lastName }}
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  :class="{ error: errors.email }"
                />
                <div v-if="errors.email" class="error-text">
                  {{ errors.email }}
                </div>
              </div>

              <div class="form-group">
                <label for="address">Адрес</label>
                <input
                  type="text"
                  id="address"
                  v-model="form.address"
                  :class="{ error: errors.address }"
                />
                <div v-if="errors.address" class="error-text">
                  {{ errors.address }}
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="city">Город</label>
                  <input
                    type="text"
                    id="city"
                    v-model="form.city"
                    :class="{ error: errors.city }"
                  />
                  <div v-if="errors.city" class="error-text">
                    {{ errors.city }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="state">Регион</label>
                  <input
                    type="text"
                    id="state"
                    v-model="form.state"
                    :class="{ error: errors.state }"
                  />
                  <div v-if="errors.state" class="error-text">
                    {{ errors.state }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="zip">Почтовый индекс</label>
                  <input
                    type="text"
                    id="zip"
                    v-model="form.zip"
                    :class="{ error: errors.zip }"
                  />
                  <div v-if="errors.zip" class="error-text">
                    {{ errors.zip }}
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section">
              <h2>Платёжная информация</h2>

              <div class="form-group">
                <label for="cardName">Имя на карте</label>
                <input
                  type="text"
                  id="cardName"
                  v-model="form.cardName"
                  :class="{ error: errors.cardName }"
                />
                <div v-if="errors.cardName" class="error-text">
                  {{ errors.cardName }}
                </div>
              </div>

              <div class="form-group">
                <label for="cardNumber">Номер карты</label>
                <input
                  type="text"
                  id="cardNumber"
                  v-model="form.cardNumber"
                  placeholder="1234 5678 9012 3456"
                  :class="{ error: errors.cardNumber }"
                />
                <div v-if="errors.cardNumber" class="error-text">
                  {{ errors.cardNumber }}
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expDate">Срок действия</label>
                  <input
                    type="text"
                    id="expDate"
                    v-model="form.expDate"
                    placeholder="MM/YY"
                    :class="{ error: errors.expDate }"
                  />
                  <div v-if="errors.expDate" class="error-text">
                    {{ errors.expDate }}
                  </div>
                </div>

                <div class="form-group">
                  <label for="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    v-model="form.cvv"
                    placeholder="123"
                    :class="{ error: errors.cvv }"
                  />
                  <div v-if="errors.cvv" class="error-text">
                    {{ errors.cvv }}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="order-summary">
          <h2>Краткое описание заказа</h2>

          <div class="summary-items">
            <div v-for="item in cartItems" :key="item.id" class="summary-item">
              <div class="item-info">
                <span class="item-quantity">{{ item.quantity }} ×</span>
                <span class="item-name">{{ item.name }}</span>
              </div>
              <span class="item-price">{{
                formatCurrency(item.price * item.quantity)
              }}</span>
            </div>
          </div>

          <div class="summary-totals">
            <div class="summary-row">
              <span>Итого</span>
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
          </div>

          <button @click="placeOrder" class="place-order-btn">Заказать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.empty-checkout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-checkout-message {
  text-align: center;
  max-width: 500px;
}

.empty-checkout-message h2 {
  margin-bottom: var(--spacing-md);
}

.empty-checkout-message p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-lg);
}

.continue-shopping-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
}

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: var(--spacing-lg);
}

.checkout-form {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: var(--spacing-md);
}

.form-section {
  margin-bottom: var(--spacing-lg);
}

.form-section h2 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

input.error {
  border-color: var(--color-error);
}

.order-summary {
  background-color: white;
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  top: 80px;
}

.order-summary h2 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-border);
}

.summary-items {
  margin-bottom: var(--spacing-md);
  max-height: 300px;
  overflow-y: auto;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.item-info {
  display: flex;
  align-items: center;
}

.item-quantity {
  margin-right: var(--spacing-xs);
  color: var(--color-text-secondary);
}

.item-name {
  font-weight: 500;
}

.summary-totals {
  margin-bottom: var(--spacing-md);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
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

.place-order-btn {
  width: 100%;
  padding: var(--spacing-sm) 0;
  font-size: 1rem;
  background-color: var(--color-primary);
  color: white;
}

.place-order-btn:hover {
  background-color: var(--color-primary-light);
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr 300px;
  }
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
    margin-top: var(--spacing-md);
  }
}
</style>
