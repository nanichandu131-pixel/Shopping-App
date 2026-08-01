# Project Audit & Fix Plan

## ✅ Completed
- [x] Initial project audit (all files reviewed)

## 🔲 To Do
### 1. Fix CSS Syntax Errors in `frontend/src/index.css`
- Fix `@apply` directives with extra spaces (e.g., `hover: bg-` → `hover:bg-`)
- Fix missing colons (e.g., `disabledcursor` → `disabled:cursor`, `disabledopacity` → `disabled:opacity`)
- Fix multiple `dark:` directives with spaces after colons

### 2. Fix Price Display in ProductCard
- Ensure prices always show by extracting from best offer or from store offers
- Seed data creates StoreProducts with prices, but Home.jsx passes Product objects directly

### 3. Fix Search Validation
- Make `q` parameter optional when no search term provided (for browsing)

### 4. Create Backend .env File
- Create `.env` with default development settings

### 5. Install Dependencies
- Run `npm install` in root workspace

### 6. Run Seed Script
- Populate database with products, categories, brands, stores, prices

### 7. Test Application
- Start backend and frontend
- Verify all pages load
- Verify images, prices, search, login work

