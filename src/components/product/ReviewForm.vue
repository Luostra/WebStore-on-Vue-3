<script setup>
import { ref, computed } from "vue";
import StarRating from "./StarRating.vue";
import { useAuthStore } from "../../store/auth";

const props = defineProps({
  productId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(["submit-review"]);

const authStore = useAuthStore();

const rating = ref(0);
const title = ref("");
const comment = ref("");
const errors = ref({});

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userInfo = computed(() => authStore.user);

const validate = () => {
  const newErrors = {};

  if (rating.value === 0) {
    newErrors.rating = "Please select a rating";
  }

  if (!title.value.trim()) {
    newErrors.title = "Please enter a title";
  }

  if (!comment.value.trim()) {
    newErrors.comment = "Please enter a comment";
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const submitReview = () => {
  if (!isAuthenticated.value) {
    return;
  }

  if (!validate()) {
    return;
  }

  const review = {
    productId: parseInt(props.productId),
    userId: userInfo.value.id,
    userName: userInfo.value.name,
    rating: rating.value,
    title: title.value.trim(),
    comment: comment.value.trim(),
  };

  emit("submit-review", review);

  // Reset form
  rating.value = 0;
  title.value = "";
  comment.value = "";
};
</script>

<template>
  <div class="review-form-container">
    <h3>Написать отзыв</h3>

    <div v-if="!isAuthenticated" class="login-message">
      <p>
        Пожалуйста, <router-link to="/login">войдите</router-link> чтобы
        оставить отзыв.
      </p>
    </div>

    <form v-else @submit.prevent="submitReview" class="review-form">
      <div class="form-group">
        <label for="rating">Рейтинг</label>
        <div class="rating-input">
          <StarRating v-model:rating="rating" :readonly="false" />
          <div v-if="errors.rating" class="error-text">{{ errors.rating }}</div>
        </div>
      </div>

      <div class="form-group">
        <label for="title">Заголовок</label>
        <input
          type="text"
          id="title"
          v-model="title"
          placeholder="Summarize your review"
          :class="{ error: errors.title }"
        />
        <div v-if="errors.title" class="error-text">{{ errors.title }}</div>
      </div>

      <div class="form-group">
        <label for="comment">Комментарий</label>
        <textarea
          id="comment"
          v-model="comment"
          rows="4"
          placeholder="Tell us what you liked or didn't like about this product"
          :class="{ error: errors.comment }"
        ></textarea>
        <div v-if="errors.comment" class="error-text">{{ errors.comment }}</div>
      </div>

      <button type="submit" class="submit-btn">Отправить</button>
    </form>
  </div>
</template>

<style scoped>
.review-form-container {
  background-color: white;
  border-radius: 12px;
  padding: var(--spacing-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: var(--spacing-lg);
}

.login-message {
  text-align: center;
  padding: var(--spacing-md);
}

.review-form {
  margin-top: var(--spacing-md);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.rating-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

input.error,
textarea.error {
  border-color: var(--color-error);
}

.submit-btn {
  margin-top: var(--spacing-xs);
}
</style>
