<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../store/products";
import { useCartStore } from "../store/cart";
import StarRating from "../components/product/StarRating.vue";
import ReviewForm from "../components/product/ReviewForm.vue";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const productId = computed(() => parseInt(route.params.id));
const product = computed(() => productStore.getProductById(productId.value));
const reviews = computed(() => productStore.getProductReviews(productId.value));
const averageRating = computed(() =>
  productStore.getProductAverageRating(productId.value)
);

const quantity = ref(1);
const activeImageIndex = ref(0);

// If product not found, redirect to 404
onMounted(() => {
  if (!product.value) {
    router.push("/404");
  }
});

const formattedPrice = computed(() => {
  if (!product.value) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.value.price);
});

const changeImage = (index) => {
  activeImageIndex.value = index;
};

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value);
  }
};

const submitReview = (review) => {
  productStore.addReview(review);
};
</script>

<template>
  <div v-if="product" class="product-detail-page">
    <div class="container">
      <div class="product-detail">
        <div class="product-images">
          <div class="main-image">
            <img :src="product.images[activeImageIndex]" :alt="product.name" />
          </div>
          <div class="image-thumbnails">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              class="thumbnail"
              :class="{ active: index === activeImageIndex }"
              @click="changeImage(index)"
            >
              <img :src="image" :alt="`${product.name} - view ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>

          <div class="product-rating">
            <StarRating :rating="averageRating" :readonly="true" />
            <span class="review-count" v-if="reviews.length > 0">
              ({{ reviews.length }}
              {{ reviews.length === 1 ? "review" : "reviews" }})
            </span>
          </div>

          <div class="product-price">{{ formattedPrice }}</div>

          <div class="product-description">
            <p>{{ product.description }}</p>
          </div>

          <div class="product-features">
            <h3>Особенности:</h3>
            <ul>
              <li v-for="(feature, index) in product.features" :key="index">
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="product-actions">
            <div class="quantity-selector">
              <button @click="decrementQuantity" class="quantity-btn">-</button>
              <span class="quantity-value">{{ quantity }}</span>
              <button @click="incrementQuantity" class="quantity-btn">+</button>
            </div>

            <button @click="addToCart" class="add-to-cart-btn">
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="product-reviews">
        <h2>Отзывы</h2>

        <div v-if="reviews.length === 0" class="no-reviews">
          <p>Отзывов о товаре пока нет. Будьте первым, кто оставит отзыв!</p>
        </div>

        <div v-else class="reviews-list">
          <div v-for="review in reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <div class="review-author">{{ review.userName }}</div>
              <div class="review-date">
                {{ new Date(review.date).toLocaleDateString() }}
              </div>
            </div>

            <div class="review-rating">
              <StarRating :rating="review.rating" :readonly="true" />
            </div>

            <h3 class="review-title">{{ review.title }}</h3>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>

        <ReviewForm :product-id="productId" @submit-review="submitReview" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-detail-page {
  padding: var(--spacing-lg) 0;
}

.product-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.product-images {
  display: flex;
  flex-direction: column;
}

.main-image {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.main-image:hover img {
  transform: scale(1.05);
}

.image-thumbnails {
  display: flex;
  gap: var(--spacing-xs);
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.thumbnail.active {
  border-color: var(--color-primary);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-name {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.product-rating {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.review-count {
  margin-left: var(--spacing-xs);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.product-price {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
}

.product-description {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.product-features {
  margin-bottom: var(--spacing-lg);
}

.product-features h3 {
  margin-bottom: var(--spacing-xs);
}

.product-features ul {
  padding-left: var(--spacing-md);
}

.product-features li {
  margin-bottom: var(--spacing-xs);
}

.product-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0 var(--spacing-xs);
}

.quantity-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  font-size: 1.25rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.3s ease;
}

.quantity-btn:hover {
  color: var(--color-primary);
  background: none;
}

.quantity-value {
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.add-to-cart-btn {
  flex: 1;
  height: 48px;
  font-size: 1rem;
}

.product-reviews {
  margin-top: var(--spacing-xl);
}

.product-reviews h2 {
  margin-bottom: var(--spacing-lg);
}

.no-reviews {
  text-align: center;
  padding: var(--spacing-lg);
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.review-item {
  background-color: white;
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.review-author {
  font-weight: 500;
}

.review-date {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
}

.review-rating {
  margin-bottom: var(--spacing-xs);
}

.review-title {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-xs);
}

.review-comment {
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .product-detail {
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr;
  }

  .main-image {
    height: 300px;
  }
}
</style>
