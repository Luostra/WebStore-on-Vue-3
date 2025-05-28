<script setup>
import { computed } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-quantity", "remove-item"]);

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(props.item.price);
});

const formattedSubtotal = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(props.item.price * props.item.quantity);
});

const updateQuantity = (newQuantity) => {
  if (newQuantity < 1) return;
  emit("update-quantity", props.item.id, newQuantity);
};

const removeItem = () => {
  emit("remove-item", props.item.id);
};
</script>

<template>
  <div class="cart-item">
    <div class="item-image">
      <img :src="item.image" :alt="item.name" />
    </div>

    <div class="item-details">
      <div class="item-name">{{ item.name }}</div>
      <div class="item-price">{{ formattedPrice }}</div>

      <div class="item-quantity">
        <button class="quantity-btn" @click="updateQuantity(item.quantity - 1)">
          -
        </button>
        <span class="quantity-value">{{ item.quantity }}</span>
        <button class="quantity-btn" @click="updateQuantity(item.quantity + 1)">
          +
        </button>
      </div>
    </div>

    <div class="item-subtotal">
      <div class="subtotal-label">Итог</div>
      <div class="subtotal-value">{{ formattedSubtotal }}</div>
    </div>

    <button class="remove-btn" @click="removeItem" aria-label="Remove item">
      ×
    </button>
  </div>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto 40px;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.item-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.item-price {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
}

.quantity-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border-radius: 4px;
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: 500;
}

.item-subtotal {
  text-align: right;
}

.subtotal-label {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.subtotal-value {
  font-weight: 600;
  color: var(--color-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
}

.remove-btn:hover {
  color: var(--color-error);
  background: none;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 80px 1fr 40px;
    grid-template-rows: auto auto;
  }

  .item-image {
    width: 80px;
    height: 80px;
    grid-row: 1 / span 2;
  }

  .item-details {
    grid-column: 2;
  }

  .item-subtotal {
    grid-column: 2;
    grid-row: 2;
    text-align: left;
  }

  .remove-btn {
    grid-row: 1;
    grid-column: 3;
  }
}
</style>
