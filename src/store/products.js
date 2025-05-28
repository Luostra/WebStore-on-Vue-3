import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { productData } from '../data/products';

export const useProductStore = defineStore('products', () => {
  const products = ref(productData);
  const reviews = ref([]);

  // Get products with filtering and sorting
  const getFilteredProducts = computed(() => {
    return (filters = {}, sort = null) => {
      let filteredProducts = [...products.value];
      
      // Apply category filter
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category === filters.category
        );
      }
      
      // Apply price range filter
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price >= filters.minPrice
        );
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => product.price <= filters.maxPrice
        );
      }
      
      // Apply search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchLower) || 
            product.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sorting
      if (sort) {
        switch(sort) {
          case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating-desc':
            filteredProducts.sort((a, b) => {
              const aRating = getProductAverageRating(a.id);
              const bRating = getProductAverageRating(b.id);
              return bRating - aRating;
            });
            break;
        }
      }
      
      return filteredProducts;
    };
  });

  // Get a single product by ID
  const getProductById = computed(() => {
    return (id) => {
      return products.value.find(product => product.id === parseInt(id)) || null;
    };
  });

  // Get all categories
  const categories = computed(() => {
    const categorySet = new Set();
    products.value.forEach(product => {
      categorySet.add(product.category);
    });
    return Array.from(categorySet);
  });

  // Get product reviews
  const getProductReviews = computed(() => {
    return (productId) => {
      return reviews.value.filter(review => review.productId === productId);
    };
  });

  // Get product average rating
  const getProductAverageRating = (productId) => {
    const productReviews = reviews.value.filter(review => review.productId === productId);
    if (productReviews.length === 0) return 0;
    
    const sum = productReviews.reduce((total, review) => total + review.rating, 0);
    return sum / productReviews.length;
  };

  // Add a review
  function addReview(review) {
    reviews.value.push({
      id: reviews.value.length + 1,
      ...review,
      date: new Date().toISOString()
    });
  }

  return {
    products,
    getFilteredProducts,
    getProductById,
    categories,
    getProductReviews,
    getProductAverageRating,
    addReview
  };
});