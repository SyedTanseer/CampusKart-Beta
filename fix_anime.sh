#!/bin/bash

# Fix ProductCard.tsx
sed -i 's/import anime from .*/import { animate as anime } from "animejs";/' src/components/product/ProductCard.tsx

# Fix Header.tsx 
sed -i 's/import anime from .*/import { animate as anime } from "animejs";/' src/components/layout/Header.tsx

# Fix LoginModal.tsx
sed -i 's/import anime from .*/import { animate as anime } from "animejs";/' src/components/auth/LoginModal.tsx

echo "Fixed anime.js imports in all files" 