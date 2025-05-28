<script setup>
import { computed } from "vue";
import { useCartStore } from "../../store/cart";
import StarRating from "./StarRating.vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

const cartStore = useCartStore();

const formattedPrice = computed(() => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(props.product.price);
});

const addToCart = () => {
  cartStore.addToCart(props.product);
};
</script>

<template>
  <div class="product-card">
    <router-link :to="`/products/${product.id}`" class="product-image">
      <img :src="product.images[0]" :alt="product.name" />
    </router-link>
    <div class="product-info">
      <router-link :to="`/products/${product.id}`" class="product-name">
        {{ product.name }}
      </router-link>
      <div class="product-category">{{ product.category }}</div>
      <div class="product-rating">
        <StarRating :rating="rating" :readonly="true" />
      </div>
      <div class="product-price">{{ formattedPrice }}</div>
      <button @click="addToCart" class="add-to-cart-btn">
        Добавить в корзину
      </button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  display: block;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: var(--spacing-md);
}

.product-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: block;
  text-decoration: none;
  transition: color 0.3s ease;
}

.product-name:hover {
  color: var(--color-primary);
}

.product-category {
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  margin-bottom: var(--spacing-xs);
}

.product-rating {
  margin-bottom: var(--spacing-xs);
}

.product-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.add-to-cart-btn {
  width: 100%;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-to-cart-btn:hover {
  background-color: var(--color-primary-light);
}

.add-to-cart-btn:active {
  transform: scale(0.98);
}
</style>
