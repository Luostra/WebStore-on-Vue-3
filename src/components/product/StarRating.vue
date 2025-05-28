<script setup>
import { computed } from 'vue';

const props = defineProps({
  rating: {
    type: Number,
    default: 0
  },
  maxRating: {
    type: Number,
    default: 5
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:rating']);

const roundedRating = computed(() => {
  return Math.round(props.rating * 2) / 2; // Round to nearest 0.5
});

const stars = computed(() => {
  const result = [];
  const fullStars = Math.floor(roundedRating.value);
  const hasHalfStar = roundedRating.value % 1 !== 0;
  
  // Add full stars
  for (let i = 0; i < fullStars; i++) {
    result.push('full');
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    result.push('half');
  }
  
  // Add empty stars
  const emptyStars = props.maxRating - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    result.push('empty');
  }
  
  return result;
});

const setRating = (index) => {
  if (props.readonly) return;
  emit('update:rating', index + 1);
};
</script>

<template>
  <div class="star-rating" :class="{ 'readonly': readonly }">
    <span
      v-for="(star, index) in stars"
      :key="index"
      class="star"
      :class="star"
      @click="setRating(index)"
      role="button"
      :tabindex="readonly ? -1 : 0"
      :aria-label="`Rate ${index + 1} out of ${maxRating} stars`"
    ></span>
    <span v-if="rating > 0" class="rating-value">{{ rating.toFixed(1) }}</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
}

.star {
  font-size: 1.25rem;
  color: var(--color-secondary);
  position: relative;
  cursor: pointer;
  margin-right: 2px;
}

.star.full::before {
  content: "★";
  color: var(--color-accent);
}

.star.half::before {
  content: "★";
  position: absolute;
  color: var(--color-accent);
  width: 50%;
  overflow: hidden;
}

.star.half::after {
  content: "☆";
  color: var(--color-secondary);
}

.star.empty::before {
  content: "☆";
}

.rating-value {
  margin-left: var(--spacing-xs);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.readonly .star {
  cursor: default;
}
</style>