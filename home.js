// Host applications can subscribe to profile:search, profile:chat,
// profile:browse, profile:publish and profile:navigate on the homepage.
const home = document.querySelector('main');
const form = home.querySelector('form');
const input = form.querySelector('input');
const profiles = home.querySelector('#profiles');

function notify(action, detail) {
  home.dispatchEvent(new CustomEvent('profile:' + action, { bubbles: true, detail }));
}

const samples = [
  { nickname: '阿禾', age: 25, city: '上海市', status: '勿扰', signature: '想和你交换一本喜欢的书。', photo: 'assets/profile-0.jpg' },
  { nickname: '晚晴', age: 27, city: '苏州市', status: '在线', signature: '周末一起去公园晒太阳吧。', photo: 'assets/profile-1.jpg' },
];
const slides = [];
// Repeat the two profiles so both neighboring positions have a card at the loop boundary.
for (const person of [...samples, ...samples]) {
  const slide = document.createElement('article');
  slide.className = 'slide';
  slide.dataset.name = person.nickname;
  slide.setAttribute('aria-label', person.nickname + '，' + person.status + '，示例资料');
  slide.innerHTML = `
    <div class="profile-content">
      <img class="profile-photo" src="${person.photo}" alt="">
      <span class="profile-status" data-status="${person.status}">${person.status}</span>
      <div class="profile-info">
        <div class="profile-identity">
          <strong>${person.nickname}</strong>
          <small><img src="assets/gender-female.svg" alt="女性">${person.age}岁</small>
        </div>
        <div class="profile-tags"><span>声优</span><span>温柔</span></div>
      </div>
      <div class="profile-foot">
        <div class="profile-city"><img src="assets/location.svg" alt="">${person.city}</div>
        <p>${person.signature}</p>
      </div>
    </div>
    <img class="chat-icon" src="assets/chat.png" alt="">
    <button class="chat" data-action="chat" aria-label="与${person.nickname}聊天"></button>`;
  profiles.append(slide);
  slides.push(slide);
}

let active = 0;
let timer;
let start;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function render() {
  slides.forEach((slide, index) => {
    const distance = (index - active + slides.length) % slides.length;
    slide.dataset.position = ['center', 'right', 'offscreen', 'left'][distance];
    slide.inert = index !== active;
  });
}
function schedule() {
  clearTimeout(timer);
  if (document.hidden || reducedMotion.matches || start || document.activeElement === input ||
      profiles.matches(':has(:focus-visible)')) return;
  timer = setTimeout(() => browse('next', 'auto'), 5000);
}
function browse(direction, source = 'manual') {
  active = (active + (direction === 'next' ? 1 : -1) + slides.length) % slides.length;
  render();
  schedule();
  notify('browse', { direction, source, nickname: slides[active].dataset.name });
}
document.addEventListener('visibilitychange', schedule);
home.addEventListener('focusin', schedule);
home.addEventListener('focusout', () => queueMicrotask(schedule));
reducedMotion.addEventListener('change', schedule);
render();
schedule();

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
  if (action === 'previous' || action === 'next') browse(action);
  else if (action === 'chat') notify('chat', { nickname: slides[active].dataset.name });
  else if (action === 'publish') notify('publish', {});
  else notify('navigate', { target: action });
});

profiles.addEventListener('pointerdown', event => {
  if (event.isPrimary && event.button === 0) start = { x: event.clientX, y: event.clientY };
  schedule();
});
window.addEventListener('pointercancel', () => { start = null; schedule(); });
window.addEventListener('pointerup', event => {
  if (!event.isPrimary || !start) return;
  const dx = event.clientX - start.x;
  const dy = event.clientY - start.y;
  start = null;
  schedule();
  if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
  browse(dx < 0 ? 'next' : 'previous');
  const suppress = click => { click.stopImmediatePropagation(); };
  home.addEventListener('click', suppress, { capture: true, once: true });
  setTimeout(() => home.removeEventListener('click', suppress, true), 0);
});
