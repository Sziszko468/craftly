<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useProfile } from '~/composables/useProfile'
import { useUserProducts } from '~/composables/useUserProducts'
import { useStorage } from '~/composables/useStorage'
import { useToast } from '~/composables/useToast'
import { useLocale } from '~/composables/useLocale'

useHead({ title: 'Profile – Craftly' })

const { logout } = useAuth()
const { profile, isLoading: profileLoading, fetchProfile, updateProfile } = useProfile()
const { products, isLoading: productsLoading, fetchMyProducts, createProduct, deleteProduct } = useUserProducts()
const { uploadImages, isUploading } = useStorage()
const { success, error: toastError } = useToast()
const { locale } = useLocale()
const router = useRouter()
const user = useSupabaseUser()
const supabase = useSupabaseClient()

// Redirect if not logged in
watch(user, async (newUser) => {
  if (!newUser) {
    router.push('/auth')
    return
  }
  await fetchProfile()
  await fetchMyProducts()
}, { immediate: true })

// Edit profile
const isEditingProfile = ref(false)
const editForm = ref({ name: '', bio: '', location: '' })

function startEditing() {
  editForm.value = {
    name: profile.value?.name ?? '',
    bio: profile.value?.bio ?? '',
    location: profile.value?.location ?? '',
  }
  isEditingProfile.value = true
}

async function handleSaveProfile() {
  const ok = await updateProfile({
    name: editForm.value.name,
    bio: editForm.value.bio,
    location: editForm.value.location,
  })
  if (ok) {
    await fetchProfile()
    isEditingProfile.value = false
    success(locale.value === 'en' ? 'Profile updated!' : 'Profiel bijgewerkt!')
  } else {
    toastError(locale.value === 'en' ? 'Update failed.' : 'Bijwerken mislukt.')
  }
}

async function handleLogout() {
  await logout()
  router.push('/')
  success(locale.value === 'en' ? 'Logged out.' : 'Uitgelogd.')
}

// Upload form
const isFormOpen = ref(false)
const isSubmitting = ref(false)
const uploadedImageUrls = ref<string[]>([])
const pendingFiles = ref<File[]>([])

const form = ref({
  title: '',
  description: '',
  price: null as number | null,
  category: '',
  condition: '' as string,
  stock: null as number | null,
  tags: '',
})

const conditionOptions = [
  { value: 'handmade', label: { en: 'Handmade', nl: 'Handgemaakt' } },
  { value: 'new',      label: { en: 'New',      nl: 'Nieuw'       } },
  { value: 'vintage',  label: { en: 'Vintage',  nl: 'Vintage'     } },
]

const categoryOptions = [
  { value: 'jewelry',    label: { en: 'Jewelry',    nl: 'Sieraden'   } },
  { value: 'ceramics',   label: { en: 'Ceramics',   nl: 'Keramiek'   } },
  { value: 'textiles',   label: { en: 'Textiles',   nl: 'Textiel'    } },
  { value: 'art-prints', label: { en: 'Art Prints', nl: 'Kunstprint' } },
  { value: 'woodwork',   label: { en: 'Woodwork',   nl: 'Houtwerk'   } },
  { value: 'candles',    label: { en: 'Candles',    nl: 'Kaarsen'    } },
]

function handleFilesSelected(files: File[]) {
  pendingFiles.value = [...pendingFiles.value, ...files]
  files.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      uploadedImageUrls.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

function handleRemoveImage(index: number) {
  uploadedImageUrls.value.splice(index, 1)
  pendingFiles.value.splice(index, 1)
}

function resetForm() {
  form.value = {
    title: '',
    description: '',
    price: null,
    category: '',
    condition: '',
    stock: null,
    tags: '',
  }
  uploadedImageUrls.value = []
  pendingFiles.value = []
}

async function handleSubmit() {
  if (!form.value.title.trim()) {
    toastError(locale.value === 'en' ? 'Title is required.' : 'Titel is verplicht.')
    return
  }
  if (!form.value.price || form.value.price <= 0) {
    toastError(locale.value === 'en' ? 'Enter a valid price.' : 'Voer een geldige prijs in.')
    return
  }
  if (!form.value.category) {
    toastError(locale.value === 'en' ? 'Select a category.' : 'Selecteer een categorie.')
    return
  }
  if (!form.value.condition) {
    toastError(locale.value === 'en' ? 'Select a condition.' : 'Selecteer een staat.')
    return
  }

  isSubmitting.value = true

  // Upload images first
  const { data: { session } } = await supabase.auth.getSession()
  let imageUrls: string[] = []
  if (pendingFiles.value.length > 0 && session?.user) {
    imageUrls = await uploadImages(pendingFiles.value, session.user.id)
  }

  const ok = await createProduct({
    title: form.value.title,
    description: form.value.description,
    price: form.value.price,
    category: form.value.category,
    condition: form.value.condition,
    stock: form.value.stock ?? 1,
    tags: form.value.tags.split(',').map((t) => t.trim()).filter(Boolean),
    images: imageUrls,
  })

  isSubmitting.value = false

  if (ok) {
    isFormOpen.value = false
    resetForm()
    success(locale.value === 'en' ? '🎉 Product listed!' : '🎉 Product geplaatst!')
  } else {
    toastError(locale.value === 'en' ? 'Failed to list product.' : 'Plaatsen mislukt.')
  }
}

async function handleDelete(productId: string) {
  const ok = await deleteProduct(productId)
  if (ok) {
    success(locale.value === 'en' ? 'Product deleted.' : 'Product verwijderd.')
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="container">

      <!-- Loading -->
      <div v-if="profileLoading" class="loading-state">
        <div class="spinner-lg" />
      </div>

      <template v-else-if="profile">

        <!-- Profile header -->
        <div class="profile-header animate-fade-up stagger-1">
          <div class="profile-header__left">
            <div class="avatar-wrap">
              <img
                :src="profile.avatar_url ?? `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`"
                :alt="profile.name"
                class="avatar"
              />
            </div>

            <div class="profile-info">
              <template v-if="!isEditingProfile">
                <h1 class="profile-info__name">{{ profile.name }}</h1>
                <p v-if="profile.location" class="profile-info__location">
                  📍 {{ profile.location }}
                </p>
                <p v-if="profile.bio" class="profile-info__bio">
                  {{ profile.bio }}
                </p>
                <div class="profile-info__meta">
                  <span>✉️ {{ user?.email }}</span>
                  <span>📦 {{ products.length }} {{ locale === 'en' ? 'listings' : 'advertenties' }}</span>
                </div>
              </template>

              <template v-else>
                <input
                  v-model="editForm.name"
                  class="edit-input"
                  :placeholder="locale === 'en' ? 'Your name' : 'Jouw naam'"
                />
                <input
                  v-model="editForm.location"
                  class="edit-input"
                  :placeholder="locale === 'en' ? 'Location' : 'Locatie'"
                />
                <textarea
                  v-model="editForm.bio"
                  class="edit-textarea"
                  :placeholder="locale === 'en' ? 'Tell us about yourself...' : 'Vertel over jezelf...'"
                  rows="3"
                />
              </template>
            </div>
          </div>

          <div class="profile-header__actions">
            <template v-if="!isEditingProfile">
              <button class="btn btn--ghost" @click="startEditing">
                {{ locale === 'en' ? 'Edit Profile' : 'Bewerken' }}
              </button>
              <button class="btn btn--danger" @click="handleLogout">
                {{ locale === 'en' ? 'Log Out' : 'Uitloggen' }}
              </button>
            </template>
            <template v-else>
              <button class="btn btn--ghost" @click="isEditingProfile = false">
                {{ locale === 'en' ? 'Cancel' : 'Annuleren' }}
              </button>
              <button class="btn btn--primary" @click="handleSaveProfile">
                {{ locale === 'en' ? 'Save' : 'Opslaan' }}
              </button>
            </template>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-bar animate-fade-up stagger-2">
          <div class="stats-bar__item">
            <span class="stats-bar__number">{{ products.length }}</span>
            <span class="stats-bar__label">{{ locale === 'en' ? 'Products' : 'Producten' }}</span>
          </div>
          <div class="stats-bar__item">
            <span class="stats-bar__number">{{ new Date(profile.created_at).getFullYear() }}</span>
            <span class="stats-bar__label">{{ locale === 'en' ? 'Member Since' : 'Lid Sinds' }}</span>
          </div>
          <div class="stats-bar__item">
            <span class="stats-bar__number">0</span>
            <span class="stats-bar__label">{{ locale === 'en' ? 'Total Sales' : 'Verkopen' }}</span>
          </div>
          <div class="stats-bar__item">
            <span class="stats-bar__number">—</span>
            <span class="stats-bar__label">{{ locale === 'en' ? 'Rating' : 'Beoordeling' }}</span>
          </div>
        </div>

        <!-- My listings -->
        <div class="section animate-fade-up stagger-3">
          <div class="section-header">
            <h2 class="section-title">
              {{ locale === 'en' ? 'My Listings' : 'Mijn Advertenties' }}
            </h2>
            <button class="btn btn--primary" @click="isFormOpen = true">
              + {{ locale === 'en' ? 'Add Product' : 'Product Toevoegen' }}
            </button>
          </div>

          <div v-if="productsLoading" class="loading-state">
            <div class="spinner-lg" />
          </div>

          <div v-else-if="products.length > 0" class="listings-grid">
            <div
              v-for="product in products"
              :key="product.id"
              class="listing-card"
            >
              <div class="listing-card__image-wrap">
                <img
                  v-if="product.images && product.images.length > 0"
                  :src="product.images[0]"
                  :alt="product.title"
                  class="listing-card__image"
                />
                <div v-else class="listing-card__image-placeholder">
                  {{ product.title.charAt(0) }}
                </div>
              </div>
              <div class="listing-card__body">
                <p class="listing-card__title">{{ product.title }}</p>
                <div class="listing-card__meta">
                  <span class="listing-card__price">€{{ product.price }}</span>
                  <span
                    class="listing-card__stock"
                    :class="{ 'listing-card__stock--low': product.stock <= 2 }"
                  >
                    {{ product.stock }} {{ locale === 'en' ? 'in stock' : 'op voorraad' }}
                  </span>
                </div>
                <div class="listing-card__tags">
                  <span class="listing-card__category">{{ product.category }}</span>
                  <span class="listing-card__condition">{{ product.condition }}</span>
                </div>
                <button class="listing-card__delete" @click="handleDelete(product.id)">
                  {{ locale === 'en' ? 'Delete' : 'Verwijderen' }}
                </button>
              </div>
            </div>
          </div>

          <div v-else class="empty-listings">
            <span>🎨</span>
            <p>{{ locale === 'en' ? 'No listings yet. Add your first product!' : 'Nog geen advertenties. Voeg je eerste product toe!' }}</p>
          </div>
        </div>

      </template>

      <!-- Upload modal -->
      <Transition name="modal">
        <div v-if="isFormOpen" class="modal-overlay" @click.self="isFormOpen = false">
          <div class="modal">
            <div class="modal__header">
              <h2 class="modal__title">
                {{ locale === 'en' ? 'List a New Product' : 'Nieuw Product Plaatsen' }}
              </h2>
              <button class="modal__close" @click="isFormOpen = false">✕</button>
            </div>

            <div class="modal__body">
              <div class="form-group">
                <label class="form-label">{{ locale === 'en' ? 'Title *' : 'Titel *' }}</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-input"
                  :placeholder="locale === 'en' ? 'e.g. Handmade Ceramic Mug' : 'bijv. Handgemaakte Keramische Mok'"
                />
              </div>

              <div class="form-group">
                <label class="form-label">{{ locale === 'en' ? 'Description' : 'Beschrijving' }}</label>
                <textarea
                  v-model="form.description"
                  class="form-input form-input--textarea"
                  :placeholder="locale === 'en' ? 'Describe your product...' : 'Beschrijf je product...'"
                  rows="3"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ locale === 'en' ? 'Price (€) *' : 'Prijs (€) *' }}</label>
                  <input
                    v-model.number="form.price"
                    type="number"
                    class="form-input"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ locale === 'en' ? 'Stock *' : 'Voorraad *' }}</label>
                  <input
                    v-model.number="form.stock"
                    type="number"
                    class="form-input"
                    min="1"
                    placeholder="1"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ locale === 'en' ? 'Category *' : 'Categorie *' }}</label>
                  <select v-model="form.category" class="form-select">
                    <option value="">{{ locale === 'en' ? 'Select...' : 'Selecteer...' }}</option>
                    <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">
                      {{ locale === 'en' ? cat.label.en : cat.label.nl }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ locale === 'en' ? 'Condition *' : 'Staat *' }}</label>
                  <select v-model="form.condition" class="form-select">
                    <option value="">{{ locale === 'en' ? 'Select...' : 'Selecteer...' }}</option>
                    <option v-for="opt in conditionOptions" :key="opt.value" :value="opt.value">
                      {{ locale === 'en' ? opt.label.en : opt.label.nl }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">{{ locale === 'en' ? 'Tags (comma separated)' : 'Tags (komma gescheiden)' }}</label>
                <input
                  v-model="form.tags"
                  type="text"
                  class="form-input"
                  :placeholder="locale === 'en' ? 'e.g. ceramic, mug, kitchen' : 'bijv. keramiek, mok, keuken'"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  {{ locale === 'en' ? 'Images' : 'Afbeeldingen' }}
                </label>
                <ImageUploader
                  v-model="uploadedImageUrls"
                  :is-uploading="isUploading"
                  @files-selected="handleFilesSelected"
                  @remove="handleRemoveImage"
                />
              </div>
            </div>

            <div class="modal__footer">
              <button class="btn btn--ghost" @click="isFormOpen = false">
                {{ locale === 'en' ? 'Cancel' : 'Annuleren' }}
              </button>
              <button
                class="btn btn--primary"
                :disabled="isSubmitting || isUploading"
                @click="handleSubmit"
              >
                <span v-if="isSubmitting || isUploading" class="spinner" />
                {{ isSubmitting || isUploading
                  ? (locale === 'en' ? 'Saving...' : 'Opslaan...')
                  : (locale === 'en' ? 'List Product' : 'Product Plaatsen')
                }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  padding: $space-12 0 $space-20;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: $space-20 0;
}

.spinner-lg {
  width: 40px;
  height: 40px;
  border: 3px solid $color-border;
  border-top-color: $color-blue;
  border-radius: $radius-full;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.profile-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $space-8;
  padding: $space-8;
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  margin-bottom: $space-6;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, $color-blue, $color-orange);
  }

  &__left {
    display: flex;
    gap: $space-6;
    align-items: flex-start;
    flex: 1;
  }

  &__actions {
    display: flex;
    gap: $space-3;
    flex-shrink: 0;

    @media (max-width: 640px) { flex-direction: column; }
  }

  @media (max-width: 640px) { flex-direction: column; }
}

.avatar-wrap { flex-shrink: 0; }

.avatar {
  width: 88px;
  height: 88px;
  border-radius: $radius-full;
  object-fit: cover;
  border: 3px solid $color-border-2;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &__name {
    font-family: $font-display;
    font-size: $text-2xl;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  &__location { font-size: $text-sm; color: $color-text-muted; }

  &__bio {
    font-size: $text-sm;
    color: $color-text-muted;
    max-width: 48ch;
    line-height: 1.65;
  }

  &__meta {
    display: flex;
    gap: $space-6;
    font-size: $text-xs;
    color: $color-text-dim;
    flex-wrap: wrap;
  }
}

.edit-input {
  width: 100%;
  max-width: 360px;
  background: $color-surface-2;
  border: 1px solid $color-border;
  border-radius: $radius-md;
  padding: $space-2 $space-3;
  color: $color-text;
  font-size: $text-sm;
  margin-bottom: $space-2;

  &:focus { outline: none; border-color: $color-blue; }
}

.edit-textarea {
  @extend .edit-input;
  resize: vertical;
  min-height: 80px;
  font-family: $font-body;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-4;
  margin-bottom: $space-10;

  @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-1;
    padding: $space-5;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
    text-align: center;
    transition: border-color $duration-fast;

    &:hover { border-color: $color-blue; }
  }

  &__number {
    font-family: $font-display;
    font-size: $text-xl;
    font-weight: 800;
    background: linear-gradient(135deg, $color-blue-light, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__label {
    font-size: $text-xs;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 500;
  }
}

.section { margin-bottom: $space-12; }

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-6;
}

.section-title {
  font-family: $font-display;
  font-size: $text-xl;
  font-weight: 700;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-5;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
}

.listing-card {
  background: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $duration-base $ease-out;

  &:hover {
    border-color: $color-blue;
    transform: translateY(-3px);
    box-shadow: $shadow-blue;
  }

  &__image-wrap {
    aspect-ratio: 4/3;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-slow $ease-out;

    .listing-card:hover & { transform: scale(1.04); }
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba($color-blue, 0.15), rgba($color-orange, 0.15));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: $font-display;
    font-size: $text-4xl;
    font-weight: 800;
    color: $color-blue-light;
  }

  &__body {
    padding: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-2;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-sm;
    font-weight: 600;
    color: $color-text;
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    font-family: $font-display;
    font-size: $text-md;
    font-weight: 700;
    background: linear-gradient(135deg, $color-blue-light, $color-orange);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__stock {
    font-size: $text-xs;
    color: $color-success;
    &--low { color: $color-error; }
  }

  &__tags {
    display: flex;
    gap: $space-2;
  }

  &__category,
  &__condition {
    font-size: $text-xs;
    color: $color-text-dim;
    border: 1px solid $color-border;
    border-radius: $radius-full;
    padding: 2px $space-2;
  }

  &__delete {
    font-size: $text-xs;
    color: $color-error;
    margin-top: $space-1;
    transition: opacity $duration-fast;
    text-align: left;
    &:hover { opacity: 0.7; }
  }
}

.empty-listings {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-3;
  padding: $space-12;
  border: 1px dashed $color-border;
  border-radius: $radius-lg;
  text-align: center;
  font-size: $text-sm;
  color: $color-text-muted;

  span { font-size: 2.5rem; }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  border-radius: $radius-full;
  font-size: $text-sm;
  font-weight: 600;
  transition: all $duration-fast;

  &--primary {
    background: linear-gradient(135deg, $color-blue, $color-orange);
    color: #fff;
    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba($color-blue, 0.35);
    }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  }

  &--ghost {
    border: 1px solid $color-border;
    color: $color-text-muted;
    &:hover { color: $color-text; border-color: $color-blue; }
  }

  &--danger {
    border: 1px solid rgba($color-error, 0.3);
    color: $color-error;
    &:hover {
      background: rgba($color-error, 0.1);
      border-color: $color-error;
    }
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba($color-bg, 0.85);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-4;
}

.modal {
  background: $color-surface;
  border: 1px solid $color-border-2;
  border-radius: $radius-xl;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-6;
    border-bottom: 1px solid $color-border;
    position: sticky;
    top: 0;
    background: $color-surface;
    z-index: 1;
  }

  &__title {
    font-family: $font-display;
    font-size: $text-lg;
    font-weight: 700;
  }

  &__close {
    color: $color-text-muted;
    font-size: $text-md;
    transition: color $duration-fast;
    &:hover { color: $color-text; }
  }

  &__body {
    padding: $space-6;
    display: flex;
    flex-direction: column;
    gap: $space-5;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    gap: $space-3;
    padding: $space-4 $space-6 $space-6;
    border-top: 1px solid $color-border;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;

  @media (max-width: 480px) { grid-template-columns: 1fr; }
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

  &--textarea {
    resize: vertical;
    min-height: 90px;
    font-family: $font-body;
    line-height: 1.6;
  }
}

.form-select {
  @extend .form-input;
  appearance: none;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%238888A8' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right $space-4 center;
  padding-right: $space-10;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(#fff, 0.3);
  border-top-color: #fff;
  border-radius: $radius-full;
  animation: spin 0.7s linear infinite;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity $duration-base $ease-out;
}
.modal-enter-from,
.modal-leave-to { opacity: 0; }
</style>