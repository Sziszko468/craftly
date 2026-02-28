<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useToast } from '~/composables/useToast'
import { useLocale } from '~/composables/useLocale'

useHead({ title: 'Login – Craftly' })

const { login, register, isLoading, authError } = useAuth()
const { success } = useToast()
const { locale } = useLocale()
const router = useRouter()
const user = useSupabaseUser()

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/profile')
  }
})

const isLoginMode = ref(true)

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const localError = ref<string | null>(null)

async function handleSubmit() {
  localError.value = null

  if (isLoginMode.value) {
    // Login
    if (!form.value.email || !form.value.password) {
      localError.value = locale.value === 'en' ? 'Please fill in all fields.' : 'Vul alle velden in.'
      return
    }
    const ok = await login(form.value.email, form.value.password)
    if (ok) {
      success(locale.value === 'en' ? 'Welcome back! 👋' : 'Welkom terug! 👋')
      router.push('/profile')
    }
  } else {
    // Register
    if (!form.value.name || !form.value.email || !form.value.password) {
      localError.value = locale.value === 'en' ? 'Please fill in all fields.' : 'Vul alle velden in.'
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      localError.value = locale.value === 'en' ? 'Passwords do not match.' : 'Wachtwoorden komen niet overeen.'
      return
    }
    if (form.value.password.length < 6) {
      localError.value = locale.value === 'en' ? 'Password must be at least 6 characters.' : 'Wachtwoord moet minimaal 6 tekens zijn.'
      return
    }
    const ok = await register(form.value.email, form.value.password, form.value.name)
    if (ok) {
      success(locale.value === 'en'
        ? '🎉 Account created! Check your email to confirm.'
        : '🎉 Account aangemaakt! Controleer je e-mail.'
      )
      isLoginMode.value = true
    }
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card animate-fade-up stagger-1">

      <!-- Logo -->
      <NuxtLink to="/" class="auth-logo">
        <span class="auth-logo__icon">✦</span>
        <span>Craftly</span>
      </NuxtLink>

      <!-- Title -->
      <div class="auth-header">
        <h1 class="auth-title">
          {{ isLoginMode
            ? (locale === 'en' ? 'Welcome back' : 'Welkom terug')
            : (locale === 'en' ? 'Create account' : 'Account aanmaken')
          }}
        </h1>
        <p class="auth-subtitle">
          {{ isLoginMode
            ? (locale === 'en' ? 'Sign in to manage your shop' : 'Log in om je winkel te beheren')
            : (locale === 'en' ? 'Join 840+ independent creators' : 'Sluit je aan bij 840+ makers')
          }}
        </p>
      </div>

      <!-- Form -->
      <div class="auth-form">

        <!-- Name (register only) -->
        <Transition name="field">
          <div v-if="!isLoginMode" class="form-group">
            <label class="form-label">
              {{ locale === 'en' ? 'Full Name' : 'Volledige Naam' }}
            </label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              :placeholder="locale === 'en' ? 'Your name' : 'Jouw naam'"
              autocomplete="name"
            />
          </div>
        </Transition>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">
            {{ locale === 'en' ? 'Email' : 'E-mailadres' }}
          </label>
          <input
            v-model="form.email"
            type="email"
            class="form-input"
            :placeholder="locale === 'en' ? 'you@example.com' : 'jij@voorbeeld.nl'"
            autocomplete="email"
          />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label class="form-label">
            {{ locale === 'en' ? 'Password' : 'Wachtwoord' }}
          </label>
          <input
            v-model="form.password"
            type="password"
            class="form-input"
            :placeholder="locale === 'en' ? 'Min. 6 characters' : 'Min. 6 tekens'"
            autocomplete="current-password"
          />
        </div>

        <!-- Confirm password (register only) -->
        <Transition name="field">
          <div v-if="!isLoginMode" class="form-group">
            <label class="form-label">
              {{ locale === 'en' ? 'Confirm Password' : 'Wachtwoord bevestigen' }}
            </label>
            <input
              v-model="form.confirmPassword"
              type="password"
              class="form-input"
              :placeholder="locale === 'en' ? 'Repeat password' : 'Herhaal wachtwoord'"
              autocomplete="new-password"
            />
          </div>
        </Transition>

        <!-- Error -->
        <Transition name="field">
          <div v-if="localError || authError" class="auth-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ localError || authError }}
          </div>
        </Transition>

        <!-- Submit -->
        <button
          class="auth-submit-btn"
          :disabled="isLoading"
          @click="handleSubmit"
        >
          <span v-if="isLoading" class="spinner" />
          <template v-else>
            {{ isLoginMode
              ? (locale === 'en' ? 'Sign In' : 'Inloggen')
              : (locale === 'en' ? 'Create Account' : 'Account Aanmaken')
            }}
          </template>
        </button>

        <!-- Switch mode -->
        <p class="auth-switch">
          {{ isLoginMode
            ? (locale === 'en' ? "Don't have an account?" : 'Geen account?')
            : (locale === 'en' ? 'Already have an account?' : 'Al een account?')
          }}
          <button class="auth-switch__btn" @click="isLoginMode = !isLoginMode; localError = null">
            {{ isLoginMode
              ? (locale === 'en' ? 'Sign up' : 'Registreren')
              : (locale === 'en' ? 'Sign in' : 'Inloggen')
            }}
          </button>
        </p>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth-page {
  min-height: calc(100vh - #{$nav-height});
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-8;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 600px;
    border-radius: $radius-full;
    background: radial-gradient(circle, rgba($color-blue, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: fixed;
    bottom: -20%;
    right: -10%;
    width: 400px;
    height: 400px;
    border-radius: $radius-full;
    background: radial-gradient(circle, rgba($color-orange, 0.06) 0%, transparent 70%);
    pointer-events: none;
  }
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  padding: $space-10;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $color-blue, $color-orange);
    border-radius: $radius-xl $radius-xl 0 0;
  }
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: $space-2;
  font-family: $font-display;
  font-size: $text-lg;
  font-weight: 800;
  margin-bottom: $space-8;

  &__icon {
    font-size: $text-md;
    background: linear-gradient(135deg, $color-blue, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.auth-header {
  margin-bottom: $space-8;
}

.auth-title {
  font-family: $font-display;
  font-size: $text-2xl;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: $space-2;
}

.auth-subtitle {
  font-size: $text-sm;
  color: $color-text-muted;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: $space-5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.form-label {
  font-size: $text-xs;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: $color-text-muted;
}

.form-input {
  background: $color-surface-2;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-3 $space-4;
  color: $color-text;
  font-size: $text-sm;
  transition: border-color $duration-fast;
  width: 100%;

  &::placeholder { color: $color-text-dim; }
  &:focus { outline: none; border-color: $color-blue; }
}

.auth-error {
  display: flex;
  align-items: center;
  gap: $space-2;
  padding: $space-3 $space-4;
  background: rgba($color-error, 0.1);
  border: 1px solid rgba($color-error, 0.3);
  border-radius: $radius-md;
  font-size: $text-sm;
  color: $color-error;
}

.auth-submit-btn {
  width: 100%;
  padding: $space-4;
  background: linear-gradient(135deg, $color-blue, $color-orange);
  color: #fff;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: 600;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  transition: all $duration-fast;
  min-height: 48px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba($color-blue, 0.35);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.auth-switch {
  text-align: center;
  font-size: $text-sm;
  color: $color-text-muted;

  &__btn {
    color: $color-blue;
    font-weight: 600;
    margin-left: $space-1;
    transition: opacity $duration-fast;

    &:hover { opacity: 0.8; }
  }
}

// Spinner
.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(#fff, 0.3);
  border-top-color: #fff;
  border-radius: $radius-full;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

// Field transition
.field-enter-active,
.field-leave-active {
  transition: all $duration-base $ease-out;
}
.field-enter-from,
.field-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>