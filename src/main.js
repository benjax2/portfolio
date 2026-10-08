import './style.css';

const menuButton = document.getElementById('menu-toggle');
const navigation = document.getElementById('main-navigation');
const desktop = window.matchMedia('(width >= 64rem)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let menuAnimation;

async function setMenuOpen(open) {
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

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  setMenuOpen(!isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    setMenuOpen(false);
  });
});

navigation.addEventListener('keydown', (event) => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';

  if (event.key === 'Escape' && isOpen && !desktop.matches) {
    menuButton.focus();
    setMenuOpen(false);
  }
});

desktop.addEventListener('change', () => {
  setMenuOpen(false);
});
