// Dynamic image loader for catalog items
// Maps product codes to their image files from src/assets/catalog/new/

type ImageModule = {
  default: string;
};

// Import all images from catalog/new dynamically
const imageModules = import.meta.glob<ImageModule>('@/assets/catalog/new/**/*.webp', { eager: true });

// Build a cache of available images organized by code
const imageCache = new Map<string, string[]>();

function initializeImageCache() {
  if (imageCache.size > 0) return; // Already initialized
  
  for (const [path, module] of Object.entries(imageModules)) {
    // Extract filename from path (e.g., "M1-1.webp" or "Coupe_1.webp")
    const filename = path.split('/').pop() || '';
    const nameWithoutExt = filename.replace('.webp', '');
    
    // Parse code from filename
    // Patterns: "M1-1", "M1-2" → code "M1"
    //          "Coupe_1" → code "Coupe_1"
    //          "P_1-1" → code "P_1"
    const match = nameWithoutExt.match(/^([A-Za-z_]+\d+)(?:-(\d+))?$/);
    if (match) {
      const code = match[1];
      if (!imageCache.has(code)) {
        imageCache.set(code, []);
      }
      imageCache.get(code)!.push(module.default);
    }
  }
}

// Get images for a product code
export function getImagesForCode(code: string): string[] {
  initializeImageCache();
  return imageCache.get(code) || [];
}

// Get first image for a product code
export function getFirstImageForCode(code: string): string | undefined {
  const images = getImagesForCode(code);
  return images.length > 0 ? images[0] : undefined;
}

// Utility: Get image by product code and extract numeric ID
export function getImageForProductCode(productCode: string): string | undefined {
  // Transform product code to image filename pattern
  // Examples: M1 → M1, CF1 → Coupe_1, PR1 → P_1, EQ1 → E_1
  const codeMap: Record<string, (num: string) => string> = {
    'CF': (n) => `Coupe_${n}`,  // Coiffure
    'M': (n) => `M${n}`,        // Mariage
    'PROMO': (n) => `promo_${n}`,  // Promotion
    'PR': (n) => `P_${n}`,      // Produits
    'EQ': (n) => `E_${n}`,      // Equipement
    'PB': (n) => `PB_${n}`,     // Perruques Bouncy
    'PCC': (n) => `PCC_${n}`,   // Perruques Coupe Carré
    'PEM': (n) => `PEM_${n}`,   // Perruques Effet Mouillé
    'PLL': (n) => `PLL_${n}`,   // Perruques Lisse Long
    'PC': (n) => `PC_${n}`,     // Perruques Cut
  };
  
  for (const [prefix, formatter] of Object.entries(codeMap)) {
    if (productCode.startsWith(prefix)) {
      const num = productCode.slice(prefix.length);
      const imageCode = formatter(num);
      return getFirstImageForCode(imageCode);
    }
  }
  
  return undefined;
}

// Get all images for a product code
export function getAllImagesForProductCode(productCode: string): string[] {
  const codeMap: Record<string, (num: string) => string> = {
    'CF': (n) => `Coupe_${n}`,
    'M': (n) => `M${n}`,
    'PROMO': (n) => `promo_${n}`,
    'PR': (n) => `P_${n}`,
    'EQ': (n) => `E_${n}`,
    'PB': (n) => `PB_${n}`,
    'PCC': (n) => `PCC_${n}`,
    'PEM': (n) => `PEM_${n}`,
    'PLL': (n) => `PLL_${n}`,
    'PC': (n) => `PC_${n}`,
  };
  
  for (const [prefix, formatter] of Object.entries(codeMap)) {
    if (productCode.startsWith(prefix)) {
      const num = productCode.slice(prefix.length);
      const imageCode = formatter(num);
      return getImagesForCode(imageCode);
    }
  }
  
  return [];
}
