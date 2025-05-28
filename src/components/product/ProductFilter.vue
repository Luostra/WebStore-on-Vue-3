<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  initialFilters: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["filter-change"]);

const selectedCategory = ref(props.initialFilters.category || "");
const minPrice = ref(props.initialFilters.minPrice || "");
const maxPrice = ref(props.initialFilters.maxPrice || "");
const searchQuery = ref(props.initialFilters.search || "");
const sortOption = ref(props.initialFilters.sort || "name-asc");

const filters = computed(() => {
  return {
    category: selectedCategory.value || undefined,
    minPrice: minPrice.value ? Number(minPrice.value) : undefined,
    maxPrice: maxPrice.value ? Number(maxPrice.value) : undefined,
    search: searchQuery.value || undefined,
    sort: sortOption.value,
  };
});

watch(
  filters,
  (newFilters) => {
    emit("filter-change", newFilters);
  },
  { deep: true }
);

const resetFilters = () => {
  selectedCategory.value = "";
  minPrice.value = "";
  maxPrice.value = "";
  searchQuery.value = "";
  sortOption.value = "name-asc";
};

const applyFilters = () => {
  emit("filter-change", filters.value);
};
</script>

<template>
  <div class="product-filter">
    <div class="filter-header">
      <h3>Фильтры</h3>
      <button class="reset-btn" @click="resetFilters">Сбросить</button>
    </div>

    <div class="filter-group">
      <label for="search">Поиск</label>
      <input
        type="text"
        id="search"
        v-model="searchQuery"
        placeholder="Поиск товара..."
      />
    </div>

    <div class="filter-group">
      <label for="category">Категория</label>
      <select id="category" v-model="selectedCategory">
        <option value="">Все категории</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>

    <div class="filter-group">
      <label>Промежуток цен</label>
      <div class="price-inputs">
        <input type="number" v-model="minPrice" placeholder="мин." min="0" />
        <span>до</span>
        <input type="number" v-model="maxPrice" placeholder="макс." min="0" />
      </div>
    </div>

    <div class="filter-group">
      <label for="sort">Сортировать</label>
      <select id="sort" v-model="sortOption">
        <option value="name-asc">Название (A-Я)</option>
        <option value="name-desc">Название (Я-А)</option>
        <option value="price-asc">Цена (сначала дешевле)</option>
        <option value="price-desc">Цена (сначала дороже)</option>
        <option value="rating-desc">Рейтинг (Наивысший)</option>
      </select>
    </div>

    <!--<button class="apply-btn" @click="applyFilters">Применить</button>-->
  </div>
</template>

<style scoped>
.product-filter {
  background-color: white;
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 80px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.filter-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.reset-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
}

.reset-btn:hover {
  text-decoration: underline;
  background: none;
}

.filter-group {
  margin-bottom: var(--spacing-md);
}

.filter-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.price-inputs input {
  flex: 1;
}

.price-inputs span {
  color: var(--color-text-secondary);
}

.apply-btn {
  width: 100%;
  margin-top: var(--spacing-sm);
}

@media (max-width: 768px) {
  .product-filter {
    position: static;
    margin-bottom: var(--spacing-md);
  }
}
</style>
