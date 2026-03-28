# Craftly — Handmade Marketplace

> A full-stack marketplace platform for independent creators to sell handmade, vintage, and unique goods.

![Craftly Hero](https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=1200&q=80)

---

## 🚀 Live Demo

🔗 **[craftly.vercel.app](https://craftly.vercel.app)**

---

## ✨ Features

### 🛍️ Marketplace
- Browse products with real-time search, category filtering and sorting
- Product detail pages with image gallery, stock indicator and reviews tab
- Add to cart, adjust quantity, remove items
- Free shipping progress bar in cart

### 👤 Authentication & Profiles
- Email/password registration and login via **Supabase Auth**
- Auto-generated profile on signup (Postgres trigger)
- Edit name, bio and location inline
- Logout with session cleanup

### 📦 Product Management
- Upload products with title, description, price, stock, category, condition and tags
- **Drag & drop image upload** to Supabase Storage with live preview
- Multiple images per product, main image highlighted
- Delete own listings

### 🌐 Internationalization
- Full **EN / NL** bilingual support
- Language toggle in header (desktop) and mobile menu
- All UI strings, labels and error messages translated

### 📱 Responsive Design
- Mobile-first layout, tested on 320px–1440px
- Animated hamburger menu on mobile
- Cream/warm-white light theme with Inter typography

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Nuxt 3](https://nuxt.com) (SSR + file-based routing) |
| **Language** | TypeScript (strict mode) |
| **UI** | Vue 3 Composition API |
| **Styling** | SCSS with design tokens |
| **Backend** | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage) |
| **State** | Vue composables (no Pinia needed) |
| **Deploy** | [Vercel](https://vercel.com) |

---

## 📁 Project Structure

```
craftly/
├── app/
│   ├── assets/scss/
│   │   ├── _variables.scss     # Design tokens (colors, spacing, typography)
│   │   └── main.scss           # Global styles + animations
│   ├── components/
│   │   ├── layout/
│   │   │   └── AppHeader.vue   # Fixed nav with mobile menu
│   │   ├── product/
│   │   │   ├── ProductCard.vue # Reusable product card
│   │   │   └── ProductFilters.vue
│   │   └── ui/
│   │       ├── AppToast.vue    # Toast notifications
│   │       └── ImageUploader.vue # Drag & drop upload
│   ├── composables/
│   │   ├── useAuth.ts          # Login, register, logout
│   │   ├── useCart.ts          # Cart state management
│   │   ├── useFavorites.ts     # Favorite products
│   │   ├── useLocale.ts        # EN/NL language switching
│   │   ├── useProfile.ts       # Fetch & update profile
│   │   ├── useProducts.ts      # Filter, sort, paginate mock products
│   │   ├── useShopProducts.ts  # Fetch products from Supabase
│   │   ├── useStorage.ts       # Image upload to Supabase Storage
│   │   ├── useToast.ts         # Toast notifications
│   │   └── useUserProducts.ts  # CRUD for own products
│   ├── data/
│   │   └── products.ts         # Mock product & category data
│   ├── pages/
│   │   ├── index.vue           # Home page
│   │   ├── auth.vue            # Login / Register
│   │   ├── cart.vue            # Shopping cart
│   │   ├── profile.vue         # User profile + product upload
│   │   └── products/
│   │       ├── index.vue       # Shop listing
│   │       └── [slug].vue      # Product detail
│   └── types/
│       ├── index.ts            # Product, Creator, Cart types
│       └── database.types.ts   # Supabase table types
├── nuxt.config.ts
├── .env                        # Supabase keys (not committed)
└── package.json
```

---

## 🗄️ Database Schema (Supabase)

```sql
-- Profiles (auto-created on signup via trigger)
profiles (
  id          uuid  PRIMARY KEY references auth.users,
  name        text,
  avatar_url  text,
  bio         text,
  location    text,
  created_at  timestamptz
)

-- Products
products (
  id           uuid  PRIMARY KEY,
  creator_id   uuid  references profiles(id),
  title        text,
  description  text,
  price        numeric,
  category     text,
  condition    text,
  stock        integer,
  tags         text[],
  images       text[],
  is_featured  boolean,
  rating       numeric,
  review_count integer,
  created_at   timestamptz
)
```

Row Level Security is enabled on both tables — users can only modify their own data.

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A free [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/craftly.git
cd craftly
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your `Project URL` and `anon key`
3. Run the SQL schema from `supabase/schema.sql` in the SQL Editor
4. Enable **Email** provider under **Authentication → Providers**
5. Create a **public** Storage bucket named `product-images`

### 4. Configure environment variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🚀 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🎨 Design System

The project uses a custom SCSS design token system:

```scss
// Colors
$color-bg:       #FAF8F5;   // Warm cream background
$color-text:     #1A1714;   // Near-black text
$color-blue:     #2563EB;   // Primary action
$color-orange:   #EA580C;   // Accent / gradient end

// Typography
$font-display:   'Inter', sans-serif;

// Spacing scale: $space-1 (0.25rem) → $space-20 (5rem)
// Border radius: $radius-sm (4px) → $radius-full (9999px)
```

---

## 🔑 Key Technical Decisions

- **Composables over Pinia** — all shared state lives in `useCart`, `useAuth` etc., keeping the bundle small and the code co-located
- **`as never` Supabase casting** — Supabase JS v2 requires database type generation for full type safety; the `as never` pattern is a pragmatic workaround without a full type generation pipeline
- **Bilingual architecture** — `LocalizedString { en, nl }` type used throughout; the `t()` helper in `useLocale` resolves the correct string reactively
- **Supabase RLS** — Row Level Security policies enforce data ownership at the database level, not just the application layer

---

## 👨‍💻 Author

Built as a portfolio project to demonstrate full-stack Vue/Nuxt development skills.

- **Stack**: Nuxt 3 · Vue 3 · TypeScript · Supabase · SCSS
- **Pattern**: Composition API · Composables · File-based routing · SSR

---

## 📄 License

MIT
