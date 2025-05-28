<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "../store/products";
import ProductCard from "../components/product/ProductCard.vue";

const router = useRouter();
const productStore = useProductStore();

const featuredProducts = computed(() => {
  return productStore.getFilteredProducts().slice(0, 4);
});

const goToProducts = () => {
  router.push("/products");
};

// Categories with images
const categories = [
  { name: "Electronics", image: "../src/assets/proMax.jpg" },
  {
    name: "Fashion",
    image: "../src/assets/tshirt.jpeg",
  },
  {
    name: "Home",
    image: "../src/assets/refregerator.png",
  },
  {
    name: "Sports & Outdoors",
    image: "../src/assets/bike.webp",
  },
];

const goToCategory = (category) => {
  router.push({
    path: "/products",
    query: { category },
  });
};
</script>

<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Откройте для себя качественные продукты</h1>
          <p>
            Покупайте инновационные продукты из нашей тщательно отобранной
            коллекции.
          </p>
          <button @click="goToProducts" class="cta-button">
            Покупайте сейчас
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2>Рекомендуемые продукты</h2>
          <router-link to="/products" class="view-all"
            >посмотреть все</router-link
          >
        </div>

        <div class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            :rating="productStore.getProductAverageRating(product.id)"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="categories">
      <div class="container">
        <div class="section-header">
          <h2>Товары по категориям</h2>
        </div>

        <div class="categories-grid">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            @click="goToCategory(category.name)"
          >
            <div class="category-image">
              <img :src="category.image" :alt="category.name" />
            </div>
            <h3>{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Присоединяйтесь к нашему сообществу</h2>
          <p>
            Подпишитесь, чтобы получать обновления о новых продуктах,
            специальных предложениях и многом другом.
          </p>
          <router-link to="/register" class="cta-button"
            >Войдите сейчас</router-link
          >
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)),
    url("../src/assets/home.webp");
  background-size: cover;
  background-position: center;
  color: white;
  padding: 100px 0;
  margin-bottom: var(--spacing-xl);
}

.hero-content {
  max-width: 600px;
  text-align: center;
  margin: 0 auto;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

.hero p {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.9;
}

.cta-button {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: inline-block;
}

.cta-button:hover {
  background-color: var(--color-primary-light);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-header h2 {
  font-size: 1.75rem;
  margin: 0;
}

.view-all {
  color: var(--color-primary);
  font-weight: 500;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.categories {
  margin: var(--spacing-xl) 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 200px;
  transition: transform 0.3s ease;
}

.category-card:hover {
  transform: scale(1.03);
}

.category-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card h3 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  margin: 0;
  font-weight: 500;
}

.cta-section {
  background-color: #f5f5f7;
  padding: var(--spacing-xl) 0;
  margin-top: var(--spacing-xl);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  margin-bottom: var(--spacing-md);
}

.cta-content p {
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-secondary);
}

.featured-products {
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 768px) {
  .hero {
    padding: 80px 0;
  }

  .hero h1 {
    font-size: 2rem;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}
</style>
