// Host applications can subscribe to profile:search, profile:chat,
// profile:browse, profile:publish and profile:navigate on the homepage.
const home = document.querySelector('main');
const form = home.querySelector('form');
const input = form.querySelector('input');
const profiles = home.querySelector('#profiles');

function notify(action, detail) {
  home.dispatchEvent(new CustomEvent('profile:' + action, { bubbles: true, detail }));
}

input.addEventListener('input', () => {
  form.classList.toggle('has-value', Boolean(input.value));
  if (!input.value) notify('search', { nickname: '' });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  notify('search', { nickname: input.value.trim() });
  input.blur();
});

home.addEventListener('click', event => {
  const action = event.target.closest('button')?.dataset.action;
  if (!action) return;
  if (action === 'previous' || action === 'next') notify('browse', { direction: action });
  else if (action === 'chat') notify('chat', { nickname: '小雨' });
  else if (action === 'publish') notify('publish', {});
  else notify('navigate', { target: action });
});

let start;
profiles.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) start = { x: event.clientX, y: event.clientY };
});
window.addEventListener('pointercancel', () => { start = null; });
window.addEventListener('pointerup', event => {
  if (!event.isPrimary || !start) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  start = null;
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
  notify('browse', { direction: dx < 0 ? 'next' : 'previous' });
  const suppress = click => { click.stopImmediatePropagation(); };
  home.addEventListener('click', suppress, { capture: true, once: true });
  setTimeout(() => home.removeEventListener('click', suppress, true), 0);
});
