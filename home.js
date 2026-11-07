// Host applications can subscribe to profile:search, profile:chat,
// profile:publish and profile:navigate on the homepage.
const home = document.querySelector('main');
const form = home.querySelector('form');
const input = form.querySelector('input');
const profiles = home.querySelector('#profiles');

function notify(action, detail) {
  home.dispatchEvent(new CustomEvent('profile:' + action, { bubbles: true, detail }));
}

const samples = [
  { nickname: '紫苏', age: 25, city: '杭州市', status: '在线', tags: ['插画', '散步'], signature: '今天的晚霞，想画给你看。', photo: 'assets/profile-lilac.jpg' },
  { nickname: '初澄', age: 26, city: '厦门市', status: '在线', tags: ['旅行', '音乐'], signature: '海边散步时，喜欢听哪首歌？', photo: 'assets/profile-blue.jpg', male: true },
  { nickname: '阿禾', age: 25, city: '上海市', status: '勿扰', tags: ['声优', '温柔'], signature: '想和你交换一本喜欢的书。', photo: 'assets/profile-0.jpg' },
  { nickname: '晚晴', age: 27, city: '苏州市', status: '在线', tags: ['声优', '温柔'], signature: '周末一起去公园晒太阳吧。', photo: 'assets/profile-1.jpg' },
  { nickname: '知夏', age: 26, city: '成都市', status: '离线', tags: ['声优', '温柔'], signature: '喜欢花市，也喜欢慢慢逛。', photo: 'assets/profile-2.jpg' },
  { nickname: '林川', age: 28, city: '杭州市', status: '勿扰', tags: ['声优', '温柔'], signature: '沿着湖边走，找一处好风景。', photo: 'assets/profile-3.jpg', male: true },
  { nickname: '小陶', age: 29, city: '景德镇市', status: '在线', tags: ['陶艺', '手作'], signature: '今天拉的杯子终于不歪了。', photo: 'assets/profile-4.jpg' },
  { nickname: '海生', age: 26, city: '青岛市', status: '在线', tags: ['胶片', '看海'], signature: '相机还剩三张，留给落日。', photo: 'assets/profile-5.jpg', male: true },
  { nickname: '安可', age: 31, city: '南京市', status: '勿扰', tags: ['黑胶', '爵士'], signature: '你最近单曲循环哪首歌？', photo: 'assets/profile-6.jpg' },
  { nickname: '阿麦', age: 32, city: '广州市', status: '在线', tags: ['烘焙', '早起'], signature: '第一炉出炉了，喜欢脆皮还是软心？', photo: 'assets/profile-7.jpg', male: true },
  { nickname: '山月', age: 24, city: '大理市', status: '勿扰', tags: ['徒步', '观鸟'], signature: '爬坡可以慢一点，听听林子里的鸟。', photo: 'assets/profile-8.jpg' },
  { nickname: '南舟', age: 27, city: '泉州市', status: '在线', tags: ['速写', '街巷'], signature: '用一本速写簿，记下街角的老房子。', photo: 'assets/profile-9.jpg', male: true },
];
const columns = [...profiles.querySelectorAll('.profile-column')];
for (const [index, person] of samples.entries()) {
  const card = document.createElement('article');
  card.className = 'profile-card';
  card.dataset.name = person.nickname;
  card.setAttribute('aria-label', person.nickname + '，' + person.status + '，示例资料');
  card.style.setProperty('--photo-ratio', ['3 / 4', '4 / 5', '3 / 4', '5 / 7'][index % 4]);
  card.innerHTML = `
    <div class="profile-cover">
      <img class="profile-photo" src="${person.photo}" alt="">
      <span class="profile-status" data-status="${person.status}">${person.status}</span>
      <div class="profile-identity">
        <strong>${person.nickname}</strong>
        <small><img src="assets/gender-${person.male ? 'male' : 'female'}.svg" alt="${person.male ? '男性' : '女性'}">${person.age}岁</small>
      </div>
    </div>
    <div class="profile-details">
      <div class="profile-tags">${person.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
      <div class="profile-city"><img src="assets/location.svg" alt="">${person.city}</div>
      <p>${person.signature}</p>
      <button class="chat" data-action="chat" aria-label="与${person.nickname}聊天"><img src="assets/chat.png" alt=""></button>
    </div>`;
  const shortest = columns.reduce((best, column) => column.offsetHeight < best.offsetHeight ? column : best);
  shortest.append(card);
}

input.addEventListener('input', () => {
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
  if (action === 'chat') notify('chat', { nickname: event.target.closest('article').dataset.name });
  else if (action === 'publish') notify('publish', {});
  else notify('navigate', { target: action });
});
