import './style.css';

// ==================== MENÚ PRINCIPAL ====================

const menuButton = document.getElementById('menu-toggle');
const navigation = document.getElementById('main-navigation');
const desktop = window.matchMedia('(width >= 64rem)');

// Ambos menús consultan esta preferencia.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let menuAnimation;

async function setMenuOpen(open) {
  if (open) {
    setLanguagePanelOpen(false);
  }

  menuAnimation?.cancel();
  menuButton.setAttribute('aria-expanded', String(open));

  navigation.classList.remove('hidden');
  navigation.classList.add('flex');

  if (!desktop.matches && !reducedMotion.matches) {
    const closed = { opacity: 0, transform: 'translateY(-6px)' };
    const opened = { opacity: 1, transform: 'translateY(0)' };

    menuAnimation = navigation.animate(
      open ? [closed, opened] : [opened, closed],
      {
        duration: 160,
        easing: open ? 'ease-out' : 'ease-in',
      },
    );

    try {
      await menuAnimation.finished;
    } catch {
      return;
    }
  }

  navigation.classList.toggle('hidden', !open);
  navigation.classList.toggle('flex', open);
}

// Abrir o cerrar con el botón.
menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  setMenuOpen(!isOpen);
});

// Cerrar al seleccionar un enlace.
navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

// Cerrar con Escape y devolver el foco al botón.
navigation.addEventListener('keydown', (event) => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  if (event.key === 'Escape' && isOpen && !desktop.matches) {
    menuButton.focus();
    setMenuOpen(false);
  }
});

// Restablecer el menú al cambiar entre móvil y escritorio.
desktop.addEventListener('change', () => {
  setMenuOpen(false);
});

// Cerrar al hacer clic fuera.
document.addEventListener('click', (event) => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  const clickedInsideMenu = navigation.contains(event.target);
  const clickedMenuButton = menuButton.contains(event.target);

  if (isOpen && !desktop.matches && !clickedInsideMenu && !clickedMenuButton) {
    setMenuOpen(false);
  }
});

// ==================== MENÚ DE IDIOMAS ====================

const languageButton = document.getElementById('language-toggle');
const languageOptions = document.getElementById('language-options');
const languageContainer = languageButton.parentElement;

let languageAnimation;

async function setLanguagePanelOpen(open) {
  const isOpen = languageButton.getAttribute('aria-expanded') === 'true';

  if (isOpen === open) {
    return;
  }

  languageAnimation?.cancel();
  languageButton.setAttribute('aria-expanded', String(open));
  languageOptions.classList.remove('hidden');

  if (!reducedMotion.matches) {
    const closed = { opacity: 0, transform: 'translateY(-6px)' };
    const opened = { opacity: 1, transform: 'translateY(0)' };

    languageAnimation = languageOptions.animate(
      open ? [closed, opened] : [opened, closed],
      {
        duration: 160,
        easing: open ? 'ease-out' : 'ease-in',
      },
    );

    try {
      await languageAnimation.finished;
    } catch {
      return;
    }
  }

  languageOptions.classList.toggle('hidden', !open);
}

// Abrir o cerrar y cerrar el menú principal si estaba abierto.
languageButton.addEventListener('click', () => {
  const isOpen = languageButton.getAttribute('aria-expanded') === 'true';

  if (!isOpen && menuButton.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
  }

  setLanguagePanelOpen(!isOpen);
});

// Cerrar con Escape y devolver el foco al selector.
languageContainer.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setLanguagePanelOpen(false);
    languageButton.focus();
  }
});

// Cerrar al hacer clic fuera.
document.addEventListener('click', (event) => {
  if (!languageContainer.contains(event.target)) {
    setLanguagePanelOpen(false);
  }
});

// Cerrar cuando el foco sale del selector.
languageContainer.addEventListener('focusout', (event) => {
  if (!languageContainer.contains(event.relatedTarget)) {
    setLanguagePanelOpen(false);
  }
});

// Cerrar al pulsar el botón del menú principal.
menuButton.addEventListener('click', () => {
  setLanguagePanelOpen(false);
});

// ==================== CONFIGURACIÓN DE IDIOMAS ====================

// Diccionario de traducciones del header.
const translations = {
  es: {
    code: 'ES',
    about: 'Sobre mí',
    skills: 'Habilidades',
    projects: 'Proyectos',
    contact: 'Contacto',
    navigation: 'Navegación principal',
    selectLanguage: 'Seleccionar idioma. Actual: Español',
    mainMenu: 'Menú principal',
  },
  en: {
    code: 'EN',
    about: 'About me',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    navigation: 'Main navigation',
    selectLanguage: 'Select language. Current: English',
    mainMenu: 'Main menu',
  },
  'pt-BR': {
    code: 'PT',
    about: 'Sobre mim',
    skills: 'Habilidades',
    projects: 'Projetos',
    contact: 'Contato',
    navigation: 'Navegação principal',
    selectLanguage: 'Selecionar idioma. Atual: Português',
    mainMenu: 'Menu principal',
  },
};

const currentLanguage = document.getElementById('current-language');
const languageChoices = languageOptions.querySelectorAll('[data-language]');

// Guardado de idioma en localStorage
const languageStorageKey = 'portfolio-language';

function saveLanguage(language) {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    // El cambio de idioma funciona aunque no se pueda guardar.
  }
}

function getSavedLanguage() {
  try {
    const savedLanguage = localStorage.getItem(languageStorageKey);
    const supportedLanguages = ['es', 'en', 'pt-BR'];

    return supportedLanguages.includes(savedLanguage) ? savedLanguage : 'es';
  } catch {
    return 'es';
  }
}

function applyLanguage(language) {
  const dictionary = translations[language];

  if (!dictionary) {
    return;
  }

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    element.textContent = dictionary[key];
  });

  document.querySelectorAll('[data-i18n-label]').forEach((element) => {
    const key = element.dataset.i18nLabel;
    element.setAttribute('aria-label', dictionary[key]);
  });

  document.documentElement.lang = language;
  currentLanguage.textContent = dictionary.code;

  languageChoices.forEach((button) => {
    const isSelected = button.dataset.language === language;
    button.setAttribute('aria-pressed', String(isSelected));
  });
}

languageChoices.forEach((button) => {
  button.addEventListener('click', () => {
    const language = button.dataset.language;

    applyLanguage(language);
    saveLanguage(language);
    languageButton.focus();
    setLanguagePanelOpen(false);
  });
});

// Recuperar la preferencia o comenzar en español.
applyLanguage(getSavedLanguage());
