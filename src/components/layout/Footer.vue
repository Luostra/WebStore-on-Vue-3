<script setup>
// Component doesn't need any logic
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ShopVue</h3>
          <p>Покупайте только лучшие товары.</p>
        </div>

        <div class="footer-section">
          <h3>Быстрые ссылки</h3>
          <ul>
            <li><router-link to="/">Главная</router-link></li>
            <li><router-link to="/products">Товары</router-link></li>
            <li><router-link to="/cart">Корзина</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Обслуживание клиентов</h3>
          <ul>
            <li><a href="#">Свяжитесь с нами</a></li>
            <li><a href="#">Политика доставки</a></li>
            <li><a href="#">Возврат и компенсация</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Следите за нами</h3>
          <div class="social-links">
            <a href="#" aria-label="Facebook">
              <span>Facebook*</span>
            </a>
            <a href="#" aria-label="Telegram">
              <span>Telegram</span>
            </a>
            <a href="#" aria-label="Instagram">
              <span>Instagram*</span>
            </a>
          </div>
        </div>
        <div class="footer-section">
          <div>
            *Meta — признана экстремистской организацией и запрещена в России,
            её продукты Instagram и Facebook также запрещены на территории РФ
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          &copy; {{ new Date().getFullYear() }} ShopVue. Все права защищены.
        </p>
        <div class="footer-links">
          <a href="#">Политика конфиденциальности</a>
          <a href="#">Условия предоставления услуг</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #f5f5f7;
  padding: var(--spacing-xl) 0 var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.footer-section h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.footer-section p {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: var(--spacing-xs);
}

.footer-section a {
  color: var(--color-text-secondary);
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--color-primary);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
}

.footer-links {
  display: flex;
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
}
</style>
