<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "../store/products";
import ProductCard from "../components/product/ProductCard.vue";
import ProductFilter from "../components/product/ProductFilter.vue";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

// Get initial filter values from URL
const initialFilters = {
  category: route.query.category,
  search: route.query.search,
  minPrice: route.query.minPrice ? Number(route.query.minPrice) : undefined,
  maxPrice: route.query.maxPrice ? Number(route.query.maxPrice) : undefined,
  sort: route.query.sort || "name-asc",
};

const filters = ref(initialFilters);
const products = ref([]);

// Categories
const categories = computed(() => productStore.categories);

// Update products based on filters
const updateProducts = () => {
  products.value = productStore.getFilteredProducts(
    filters.value,
    filters.value.sort
  );
};

// Handle filter changes
const handleFilterChange = (newFilters) => {
  filters.value = newFilters;

  // Update URL with new filters
  router.push({
    path: "/products",
    query: {
      ...newFilters,
      // Remove undefined values
      ...(newFilters.category ? { category: newFilters.category } : {}),
      ...(newFilters.search ? { search: newFilters.search } : {}),
      ...(newFilters.minPrice ? { minPrice: newFilters.minPrice } : {}),
      ...(newFilters.maxPrice ? { maxPrice: newFilters.maxPrice } : {}),
      ...(newFilters.sort ? { sort: newFilters.sort } : {}),
    },
  });
};

// Watch for route changes to update filters
watch(
  () => route.query,
  (newQuery) => {
    const updatedFilters = {
      category: newQuery.category,
      search: newQuery.search,
      minPrice: newQuery.minPrice ? Number(newQuery.minPrice) : undefined,
      maxPrice: newQuery.maxPrice ? Number(newQuery.maxPrice) : undefined,
      sort: newQuery.sort || "name-asc",
    };

    filters.value = updatedFilters;
  },
  { immediate: true }
);

// Watch filters and update products
watch(
  filters,
  () => {
    updateProducts();
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  updateProducts();
});
</script>

<template>
  <div class="products-page">
    <div class="container">
      <div class="page-header">
        <h1>Товары</h1>
      </div>

      <div class="products-layout">
        <aside class="filters-sidebar">
          <ProductFilter
            :categories="categories"
            :initial-filters="filters"
            @filter-change="handleFilterChange"
          />
        </aside>

        <main class="products-content">
          <div v-if="products.length === 0" class="no-products">
            <p>Не найдено товаров, соответствующих вашим критериям.</p>
            <button @click="handleFilterChange({})" class="reset-filters-btn">
              Сброс фильтров
            </button>
          </div>

          <div v-else class="products-grid">
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :rating="productStore.getProductAverageRating(product.id)"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  margin-bottom: var(--spacing-lg);
}

.products-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--spacing-lg);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.no-products {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.no-products p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.reset-filters-btn {
  background-color: var(--color-primary);
  color: white;
}

@media (max-width: 1024px) {
  .products-layout {
    grid-template-columns: 240px 1fr;
  }
}

@media (max-width: 768px) {
  .products-layout {
    grid-template-columns: 1fr;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
</style>
