# Fix ProductCard.tsx
(Get-Content src/components/product/ProductCard.tsx) -replace 'import anime from .*', 'import { animate as anime } from "animejs";' | Set-Content src/components/product/ProductCard.tsx

# Fix Header.tsx 
(Get-Content src/components/layout/Header.tsx) -replace 'import anime from .*', 'import { animate as anime } from "animejs";' | Set-Content src/components/layout/Header.tsx

# Fix LoginModal.tsx
(Get-Content src/components/auth/LoginModal.tsx) -replace 'import anime from .*', 'import { animate as anime } from "animejs";' | Set-Content src/components/auth/LoginModal.tsx

Write-Host "Fixed anime.js imports in all files" 