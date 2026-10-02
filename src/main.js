import './style.css';

const menuButton = document.getElementById('menu-toggle');
const navigation = document.getElementById('main-navigation');

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('hidden', isOpen);
  navigation.classList.toggle('flex', !isOpen);
});

const navigationLinks = navigation.querySelectorAll('a');

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.add('hidden');
    navigation.classList.remove('flex');
  });
});

navigation.addEventListener('keydown', (event) => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  const isMobile = window.matchMedia('(width < 48rem)').matches;

  if (event.key === 'Escape' && isOpen && isMobile) {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.add('hidden');
    navigation.classList.remove('flex');
    menuButton.focus();
  }
});
