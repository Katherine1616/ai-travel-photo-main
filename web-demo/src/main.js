import { demoData } from './data.js';
import './styles.css';

const app = document.querySelector('#app');

const state = {
  page: 'shops',
  shopId: '',
  category: 'tryon',
  packageType: '',
  subCategory: '',
  query: '',
  selectedTemplate: null,
  toast: '',
};

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function templatesForCurrentShop() {
  return demoData.templates.filter((item) => {
    if (state.shopId && String(item.shop_id) !== String(state.shopId)) return false;
    if (state.category && item.category !== state.category) return false;
    if (state.packageType && item.package_type !== state.packageType) return false;
    if (state.subCategory && item.sub_category !== state.subCategory) return false;
    if (state.query && !item.style_name.toLowerCase().includes(state.query.toLowerCase())) return false;
    return true;
  });
}

function shopCover(shop) {
  const direct = shop.home_image;
  if (direct) return direct;
  const tpl = demoData.templates.find((item) => String(item.shop_id) === String(shop.id));
  return tpl?.image_url || '';
}

function setToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2200);
}

function go(page) {
  state.page = page;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function enterShop(id) {
  state.shopId = String(id);
  state.category = 'tryon';
  state.packageType = '';
  state.subCategory = '';
  state.query = '';
  go('shop');
}

function selectTemplate(template) {
  state.selectedTemplate = template;
  go('detail');
}

function renderHeader(title, back = false) {
  return `
    <header class="topbar">
      ${back ? '<button class="icon-button" data-action="back" aria-label="返回">‹</button>' : '<span></span>'}
      <strong>${title}</strong>
      <span></span>
    </header>
  `;
}

function renderTabs() {
  return `
    <nav class="tabbar">
      <button class="${state.page !== 'mine' ? 'active' : ''}" data-action="home">
        <span class="tab-icon">■</span>
        <span>模板</span>
      </button>
      <button class="${state.page === 'mine' ? 'active' : ''}" data-action="mine">
        <span class="tab-icon">☺</span>
        <span>我的</span>
      </button>
    </nav>
  `;
}

function renderShell(title, body, back = false) {
  return `
    <div class="phone-shell">
      ${renderHeader(title, back)}
      <main class="screen">${body}</main>
      ${renderTabs()}
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}
    </div>
  `;
}

function renderShops() {
  const cards = demoData.shops.map((shop) => `
    <button class="shop-card" data-shop-id="${shop.id}">
      ${shopCover(shop) ? `<img src="${shopCover(shop)}" alt="${shop.shop_name}" loading="lazy">` : '<div class="shop-placeholder">店</div>'}
      <span>${shop.shop_name}</span>
      <i>›</i>
    </button>
  `).join('');

  return renderShell('蓝梅旅拍', `
    <section class="intro">
      <h1>选择门店</h1>
      <p>请选择您要体验的门店</p>
    </section>
    <section class="shop-grid">${cards}</section>
    <footer class="copyright">Copyright 2025 蓝梅旗袍·汉服·民族服体验馆</footer>
  `);
}

function renderShop() {
  const shop = demoData.shops.find((item) => String(item.id) === state.shopId);
  const allForShop = demoData.templates.filter((item) => String(item.shop_id) === state.shopId && item.category === state.category);
  const packages = unique(allForShop.map((item) => item.package_type));
  const subCategories = unique(allForShop.map((item) => item.sub_category));
  const templates = templatesForCurrentShop().slice(0, 80);

  const templateCards = templates.map((template) => `
    <button class="template-card" data-template-id="${template.id}">
      <img src="${template.image_url}" alt="${template.style_name}" loading="lazy">
      <span class="template-title">${template.style_name}</span>
      <span class="likes">♡ 35.9万</span>
      <span class="badge">${template.category === 'tryon' ? 'AI试衣' : 'AI旅拍'}</span>
    </button>
  `).join('');

  return renderShell(shop?.shop_name || '门店', `
    <div class="mode-switch">
      <button class="${state.category === 'tryon' ? 'active' : ''}" data-category="tryon">AI试衣</button>
      <button class="${state.category === 'travel' ? 'active' : ''}" data-category="travel">AI旅拍</button>
    </div>
    <button class="recommend" data-action="recommend">✨ AI智能推荐 · 拍照选服饰</button>
    <label class="search">
      <span>🔍</span>
      <input value="${state.query}" placeholder="搜索服装风格..." data-input="query">
    </label>
    <div class="filter-label">套餐与服装分类：</div>
    <div class="chips">
      ${renderChip('package', '', '全部', state.packageType === '')}
      ${packages.map((item) => renderChip('package', item, item, state.packageType === item)).join('')}
    </div>
    <div class="chips">
      ${renderChip('subcategory', '', '全部', state.subCategory === '')}
      ${subCategories.map((item) => renderChip('subcategory', item, item, state.subCategory === item)).join('')}
    </div>
    <section class="template-grid">
      ${templateCards || '<div class="empty">暂无模板</div>'}
    </section>
  `, true);
}

function renderChip(type, value, label, active) {
  return `<button class="chip ${active ? 'active' : ''}" data-chip-type="${type}" data-chip-value="${value}">${label}</button>`;
}

function renderDetail() {
  const template = state.selectedTemplate;
  if (!template) return renderShops();
  return renderShell('选择模板', `
    <section class="detail">
      <img class="hero-image" src="${template.image_url}" alt="${template.style_name}">
      <h1>${template.style_name}</h1>
      <p>${template.category === 'tryon' ? '上传你的全身照' : '上传你的正脸照片'}</p>
      <button class="upload-box" data-action="upload">
        <span>+</span>
        <strong>${template.category === 'tryon' ? '点击上传全身照' : '点击上传照片'}</strong>
      </button>
      <button class="primary-action" data-action="generate">${template.category === 'tryon' ? '开始AI试衣' : '开始AI旅拍'}</button>
    </section>
  `, true);
}

function renderMine() {
  return renderShell('我的作品', `
    <section class="empty-state">
      <h1>暂无作品</h1>
      <p>网页 Demo 展示产品流程，正式小程序会展示用户生成记录。</p>
    </section>
  `, true);
}

function render() {
  if (state.page === 'shops') app.innerHTML = renderShops();
  if (state.page === 'shop') app.innerHTML = renderShop();
  if (state.page === 'detail') app.innerHTML = renderDetail();
  if (state.page === 'mine') app.innerHTML = renderMine();
}

app.addEventListener('click', (event) => {
  const shopCard = event.target.closest('[data-shop-id]');
  if (shopCard) return enterShop(shopCard.dataset.shopId);

  const templateCard = event.target.closest('[data-template-id]');
  if (templateCard) {
    const template = demoData.templates.find((item) => String(item.id) === templateCard.dataset.templateId);
    if (template) selectTemplate(template);
    return;
  }

  const category = event.target.closest('[data-category]');
  if (category) {
    state.category = category.dataset.category;
    state.packageType = '';
    state.subCategory = '';
    return render();
  }

  const chip = event.target.closest('[data-chip-type]');
  if (chip) {
    if (chip.dataset.chipType === 'package') state.packageType = chip.dataset.chipValue;
    if (chip.dataset.chipType === 'subcategory') state.subCategory = chip.dataset.chipValue;
    return render();
  }

  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'back') return state.page === 'detail' ? go('shop') : go('shops');
  if (action === 'home') return go(state.shopId ? 'shop' : 'shops');
  if (action === 'mine') return go('mine');
  if (action === 'recommend') return setToast('Demo 模式：正式版会调用 AI 推荐');
  if (action === 'upload') return setToast('Demo 模式：这里会唤起照片上传');
  if (action === 'generate') return setToast('Demo 模式：正式版会提交 AI 生成任务');
});

app.addEventListener('input', (event) => {
  if (event.target.matches('[data-input="query"]')) {
    state.query = event.target.value;
    render();
  }
});

render();
