import * as Handlebars from 'handlebars';

type ImageLike = string | { url?: string; name?: string } | null | undefined;
type ImageArray = ImageLike[] | null | undefined;
type ImageGroupsLike =
  | Record<string, ImageArray>
  | { groupName?: string; images_url?: ImageArray }[]
  | null
  | undefined;

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function getBackendBaseUrl(): string {
  // NOTE: Keep a safe default aligned with other backend rendering paths.
  const port = process.env.PORT || '3001';
  return (
    process.env.PUBLIC_BACKEND_URL ||
    process.env.BACKEND_PUBLIC_URL ||
    process.env.BACKEND_URL ||
    process.env.APP_URL ||
    `http://localhost:${port}`
  );
}

export function resolveAssetUrl(input: unknown): string {
  const url = typeof input === 'string' ? input.trim() : '';
  if (!url) return '';
  if (isAbsoluteUrl(url)) return url;
  const base = getBackendBaseUrl().replace(/\/+$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

function imageToUrl(img: ImageLike): string {
  if (!img) return '';
  if (typeof img === 'string') return resolveAssetUrl(img);
  if (typeof img === 'object') return resolveAssetUrl(img.url || '');
  return '';
}

function getFirstImageUrl(images: ImageArray): string {
  if (!Array.isArray(images) || images.length === 0) return '';
  return imageToUrl(images[0]);
}

function getRandomImageUrl(images: ImageArray): string {
  if (!Array.isArray(images) || images.length === 0) return '';
  const idx = Math.floor(Math.random() * images.length);
  return imageToUrl(images[idx]);
}

function getNamedImageUrl(images: ImageArray, name: string): string {
  if (!Array.isArray(images) || images.length === 0) return '';
  const wanted = String(name || '').trim();
  if (!wanted) return '';

  // If images are objects with "name", match by name.
  for (const img of images) {
    if (img && typeof img === 'object' && (img as any).name === wanted) {
      return imageToUrl(img);
    }
  }

  // If images are strings, support "image_1" convention -> index 0.
  const m = wanted.match(/^image_(\d+)$/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (Number.isFinite(n) && n >= 1 && n <= images.length) {
      return imageToUrl(images[n - 1]);
    }
  }

  return '';
}

export function registerHandlebarsHelpers(): void {
  // Enregistrer le helper 'first'
  Handlebars.registerHelper('first', function (array) {
    return array && array.length ? array[0] : '';
  });

  // Enregistrer le helper 'random'
  Handlebars.registerHelper('random', function (array) {
    if (!array || !array.length) return '';
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  });

  // Helper d'égalité simple
  Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });

  // Helper de condition générique
  Handlebars.registerHelper('ifCond', function (this: any, v1, operator, v2, options) {
    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      case '!=':
        return v1 != v2 ? options.fn(this) : options.inverse(this);
      case '!==':
        return v1 !== v2 ? options.fn(this) : options.inverse(this);
      case '<':
        return v1 < v2 ? options.fn(this) : options.inverse(this);
      case '<=':
        return v1 <= v2 ? options.fn(this) : options.inverse(this);
      case '>':
        return v1 > v2 ? options.fn(this) : options.inverse(this);
      case '>=':
        return v1 >= v2 ? options.fn(this) : options.inverse(this);
      case '&&':
        return v1 && v2 ? options.fn(this) : options.inverse(this);
      case '||':
        return v1 || v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });

  // Helper pour obtenir la première image du groupe 'background'
  Handlebars.registerHelper('firstBackgroundImage', function (imageGroups) {
    const groups = imageGroups as ImageGroupsLike;
    // Format A: { background: [...] }
    if (groups && !Array.isArray(groups) && typeof groups === 'object') {
      return getFirstImageUrl((groups as Record<string, ImageArray>).background);
    }
    // Format B: [{ groupName, images_url }]
    if (Array.isArray(groups)) {
      const backgroundGroup = groups.find((g) => g?.groupName === 'background');
      return getFirstImageUrl(backgroundGroup?.images_url);
    }
    return '';
  });

  // Helper pour obtenir la première image d'un tableau d'images
  Handlebars.registerHelper('firstImage', function (images) {
    return getFirstImageUrl(images as ImageArray);
  });

  // Helper pour obtenir une image aléatoire d'un tableau d'images
  Handlebars.registerHelper('randomImage', function (images) {
    return getRandomImageUrl(images as ImageArray);
  });

  // Helper pour obtenir l'URL d'une image par son nom dans un tableau d'images
  Handlebars.registerHelper('namedImage', function (images, name) {
    return getNamedImageUrl(images as ImageArray, String(name || ''));
  });

  // Helper pour formater les polices (ajoute des guillemets si nécessaire)
  Handlebars.registerHelper('fontFamily', function (fontName) {
    if (!fontName) return '';
    // Si la police contient des espaces, l'entourer de guillemets
    if (fontName.includes(' ')) {
      return `"${fontName}"`;
    }
    return fontName;
  });

  // Helper pour rendre une icône
  // Usage: {{renderIcon icon}} ou {{renderIcon icon size}} ou {{renderIcon icon size color}}
  Handlebars.registerHelper('renderIcon', function (icon, size, color) {
    if (!icon) {
      console.warn('[renderIcon] Icon is empty or null');
      return new Handlebars.SafeString('');
    }

    let html = '';
    // Déterminer la taille : si size est fourni, l'utiliser, sinon 3em par défaut
    let fontSize = '3em';
    if (size !== undefined && size !== null) {
      const sizeNum = typeof size === 'number' ? size : parseFloat(String(size));
      if (!isNaN(sizeNum) && sizeNum > 0) {
        // Si c'est un nombre, l'interpréter comme pixels
        fontSize = `${sizeNum}px`;
      } else if (typeof size === 'string' && size.trim()) {
        // Sinon, utiliser la valeur telle quelle (ex: "2em", "24px", etc.)
        fontSize = size.trim();
      }
    }

    // Déterminer la couleur : si color est fourni, l'utiliser, sinon var(--secondaryColor) par défaut
    let iconColor = 'var(--secondaryColor)';
    if (color !== undefined && color !== null && color !== '') {
      const colorStr = String(color).trim();
      if (colorStr) {
        // Si la couleur commence par var(, #, rgb(, rgba(, ou hsl(, l'utiliser telle quelle
        if (colorStr.startsWith('var(') || colorStr.startsWith('#') || 
            colorStr.startsWith('rgb(') || colorStr.startsWith('rgba(') || 
            colorStr.startsWith('hsl(') || colorStr.startsWith('hsla(')) {
          iconColor = colorStr;
        } else {
          // Sinon, traiter comme un nom de couleur CSS ou une variable CSS
          iconColor = colorStr;
        }
      }
    }

    if (typeof icon === 'string') {
      const iconStr = icon.trim();
      if (iconStr.startsWith('ph-')) {
        html = `<div class="icon"><i class="ph-duotone ${iconStr}" style="font-size: ${fontSize}; color: ${iconColor};"></i></div>`;
      } else if (iconStr.startsWith('fa-') || iconStr.startsWith('fa ')) {
        const faClass = iconStr.startsWith('fa ') ? iconStr : 'fa ' + iconStr;
        html = `<div class="icon"><i class="${faClass}" style="font-size: ${fontSize}; color: ${iconColor};"></i></div>`;
      } else {
        console.warn('[renderIcon] Unknown icon string format:', iconStr);
      }
    } else if (icon && typeof icon === 'object') {
      // Gérer les objets avec propriété 'class' ou 'name'
      let iconClass = '';
      if (icon.class) {
        iconClass = icon.class;
      } else if (icon.name) {
        // Si name commence déjà par 'ph-', ne pas ajouter le préfixe
        const iconName = String(icon.name).trim();
        if (iconName.startsWith('ph-')) {
          iconClass = `ph-duotone ${iconName}`;
        } else {
          iconClass = `ph-duotone ph-${iconName}`;
        }
      }
      
      if (iconClass) {
        html = `<div class="icon"><i class="${iconClass}" style="font-size: ${fontSize}; color: ${iconColor};"></i></div>`;
      } else {
        console.warn('[renderIcon] Icon object has no class or name:', icon);
      }
    } else {
      console.warn('[renderIcon] Icon has unknown type:', typeof icon, icon);
    }
    
    if (!html) {
      console.warn('[renderIcon] No HTML generated for icon:', icon);
    }
    
    return new Handlebars.SafeString(html);
  });

  // Helper pour multiplier
  Handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
  });

  // Helper pour modulo
  Handlebars.registerHelper('modulo', function (a, b) {
    return a % b;
  });

  // Helper pour comparer si a > b
  Handlebars.registerHelper('gt', function (a, b) {
    return a > b;
  });

  // Helper pour obtenir la longueur d'un tableau
  Handlebars.registerHelper('length', function (array) {
    return Array.isArray(array) ? array.length : 0;
  });

  // Helper pour accéder à une propriété d'un objet par index
  Handlebars.registerHelper('lookup', function (array, index, property) {
    if (!Array.isArray(array) || !array[index]) return '';
    return array[index][property] || '';
  });

  // Helper pour JSON
  Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context);
  });

  // Helper resolveImage (existant)
  Handlebars.registerHelper('resolveImage', function (imageUrl) {
    return resolveAssetUrl(imageUrl);
  });

  // Helper phosphor (existant)
  Handlebars.registerHelper('phosphor', function (iconName) {
    return `<i class="ph ph-${iconName}"></i>`;
  });
}
