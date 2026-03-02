<script setup lang="ts">
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <NuxtPage />
    </main>
    <footer class="footer">
      <div class="container footer__inner">
        <NuxtLink to="/" class="footer__logo">
          <span class="footer__logo-icon">✦</span>
          <span>Craftly</span>
        </NuxtLink>
        <nav class="footer__nav">
          <NuxtLink to="/products">Shop</NuxtLink>
          <NuxtLink to="/profile">Profile</NuxtLink>
          <NuxtLink to="/cart">Cart</NuxtLink>
        </nav>
        <p class="footer__copy">© 2025 Craftly.</p>
      </div>
    </footer>
    <AppToast />
  </div>
</template>

<style lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: $nav-height;
}

.footer {
  margin-top: $space-20;
  border-top: 1px solid $color-border;
  padding: $space-10 0;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
    text-align: center;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: $space-2;
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 800;

    &-icon {
      background: linear-gradient(135deg, $color-blue, $color-orange);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__nav {
    display: flex;
    gap: $space-8;
    font-size: $text-sm;
    color: $color-text-muted;

    a {
      transition: color $duration-fast;
      &:hover { color: $color-text; }
    }
  }

  &__copy {
    font-size: $text-xs;
    color: $color-text-dim;
  }
}
</style>