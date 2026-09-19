import {
  ArrowLeft, ArrowRight, Check, ChevronRight, CircleCheck, Clock3, DoorOpen,
  ExternalLink, Heart, Info, MapPin, QrCode, RefreshCw, Ruler, Settings2,
  Send, ShieldCheck, Shirt, ShoppingBag, Smartphone, Sparkles, Trash2, Truck, X,
  createIcons,
} from 'lucide';
import QRCode from 'qrcode';
import { avatarProfiles, products, stores } from './catalog.js';
import './styles.css';

const app = document.querySelector('#app');
const icons = {
  ArrowLeft, ArrowRight, Check, ChevronRight, CircleCheck, Clock3, DoorOpen,
  ExternalLink, Heart, Info, MapPin, QrCode, RefreshCw, Ruler, Settings2,
  Send, ShieldCheck, Shirt, ShoppingBag, Smartphone, Sparkles, Trash2, Truck, X,
};
const params = new URLSearchParams(window.location.search);
const mobileRoute = params.get('screen') === 'mobile';
const sessionId = params.get('session') || crypto.randomUUID().slice(0, 8);
const syncChannel = 'BroadcastChannel' in window ? new BroadcastChannel('forme-fitting-demo') : null;

const state = {
  page: mobileRoute ? 'mobile' : 'catalog',
  mobileMode: params.get('mode') || 'result',
  productId: params.get('product') || products[0].id,
  category: '全部',
  colorIndex: Number(params.get('color')) || 0,
  profileId: params.get('avatar') || 'standard-curved',
  heightBand: params.get('height') || '160–169 cm',
  quick: { height: '160–169 cm', build: '标准', shape: '曲线型' },
  precise: { height: 165, weight: 55, chest: 84, waist: 68, hips: 91 },
  scenario: 'success',
  progress: 0,
  resultSeconds: 45,
  selectedSize: '',
  modal: '',
  toast: '',
  phoneComplete: false,
  profileReady: Boolean(params.get('avatar')),
  resultReady: mobileRoute && params.get('mode') === 'result',
  changingProduct: false,
};

const categories = ['全部', ...new Set(products.map((product) => product.category))];
let processTimer;
let countdownTimer;

function icon(name, size = 20) {
  return `<i data-lucide="${name}" style="width:${size}px;height:${size}px" aria-hidden="true"></i>`;
}

function currentProduct() {
  return products.find((product) => product.id === state.productId) || products[0];
}

function currentColor() {
  return currentProduct().colors[state.colorIndex] || currentProduct().colors[0];
}

function applyPhoneProfile(payload) {
  if (!payload || payload.sessionId !== sessionId || mobileRoute) return;
  state.profileId = payload.profileId;
  state.heightBand = payload.heightBand;
  state.phoneComplete = true;
  state.profileReady = true;
  state.resultReady = false;
  if (state.page === 'phone-wait') {
    setPage('confirm');
    toast('手机填写已完成');
  }
}

syncChannel?.addEventListener('message', (event) => applyPhoneProfile(event.data));
window.addEventListener('storage', (event) => {
  if (event.key === `forme-fitting-${sessionId}` && event.newValue) {
    applyPhoneProfile(JSON.parse(event.newValue));
  }
});
const savedPhoneProfile = localStorage.getItem(`forme-fitting-${sessionId}`);
if (savedPhoneProfile) applyPhoneProfile(JSON.parse(savedPhoneProfile));

function currentProfile() {
  return avatarProfiles.find((profile) => profile.id === state.profileId) || avatarProfiles[4];
}

const generatedAssetRoot = '/assets/tryon-generated';
const productAssetKeys = {
  'noir-blazer': 'noir-blazer-blue',
  'ivory-dress': 'ivory-dress-purple',
  'denim-jacket': 'denim-jacket-red',
  'red-knit': 'red-knit-print',
  'pleated-skirt': 'pleated-skirt-stripe',
  'trench-coat': 'trench-coat-yellow',
};

const secondaryProductAssetKeys = {
  'noir-blazer': 'noir-blazer-fog-grey',
  'ivory-dress': 'ivory-dress-black',
  'denim-jacket': 'denim-jacket-indigo',
  'red-knit': 'red-knit-warm-white',
  'pleated-skirt': 'pleated-skirt-sand-gold',
  'trench-coat': 'trench-coat-pine-green',
};

const labeledProfileFolders = {
  'slim-curved': 'slim/reference-matched',
  'standard-curved': 'reference-matched',
  'full-curved': 'full/reference-matched',
};

const avatarMasterAssets = {
  'slim-straight': 'slim-straight/avatar-master.png',
  'slim-curved': 'slim/avatar-master.png',
  'slim-pear': 'slim-pear/avatar-master.png',
  'standard-straight': 'standard-straight/avatar-master.png',
  'standard-curved': 'avatar-master.png',
  'standard-pear': 'standard-pear/avatar-master.png',
  'full-straight': 'full-straight/avatar-master.png',
  'full-curved': 'full/avatar-master.png',
  'full-pear': 'full-pear/avatar-master.png',
};

// The extra body types were generated as one batch, so keep their product mapping
// here instead of exposing the internal discretization to the interface.
const additionalBodyTypeAssets = {
  'slim-straight': { 'noir-blazer': 2, 'ivory-dress': 1, 'denim-jacket': 4, 'red-knit': 3, 'pleated-skirt': 6, 'trench-coat': 7 },
  'slim-pear': { 'noir-blazer': 5, 'ivory-dress': 9, 'denim-jacket': 8, 'red-knit': 10, 'pleated-skirt': 11, 'trench-coat': 12 },
  'standard-straight': { 'noir-blazer': 13, 'ivory-dress': 14, 'denim-jacket': 15, 'red-knit': 22, 'pleated-skirt': 18, 'trench-coat': 17 },
  'standard-pear': { 'noir-blazer': 16, 'ivory-dress': 21, 'denim-jacket': 19, 'red-knit': 27, 'pleated-skirt': 28, 'trench-coat': 25 },
  'full-straight': { 'noir-blazer': 20, 'ivory-dress': 26, 'denim-jacket': 24, 'red-knit': 29, 'pleated-skirt': 30, 'trench-coat': 32 },
  'full-pear': { 'noir-blazer': 23, 'ivory-dress': 33, 'denim-jacket': 35, 'red-knit': 34, 'pleated-skirt': 31, 'trench-coat': 36 },
};

function tryOnImageUrl(profile = currentProfile(), product = currentProduct(), colorIndex = state.colorIndex) {
  if (colorIndex === 1) {
    const secondaryAsset = secondaryProductAssetKeys[product.id];
    if (secondaryAsset) return `${generatedAssetRoot}/color-variants/${profile.id}/${secondaryAsset}.png`;
  }

  const assetKey = productAssetKeys[product.id] || productAssetKeys['noir-blazer'];
  const labeledFolder = labeledProfileFolders[profile.id];
  if (labeledFolder) return `${generatedAssetRoot}/${labeledFolder}/${assetKey}.png`;

  const batchNumber = additionalBodyTypeAssets[profile.id]?.[product.id];
  if (batchNumber) {
    return `${generatedAssetRoot}/additional-body-types/body-type-combination-${String(batchNumber).padStart(2, '0')}.png`;
  }

  return `${generatedAssetRoot}/reference-matched/${assetKey}.png`;
}

function avatarMasterUrl(profile = currentProfile()) {
  return `${generatedAssetRoot}/${avatarMasterAssets[profile.id] || avatarMasterAssets['standard-curved']}`;
}

function tryOnImageMarkup(className = '') {
  const product = currentProduct();
  return `<img class="tryon-image ${className}" src="${tryOnImageUrl()}" alt="${product.name} 试穿效果">`;
}

function silhouetteFigure(profile = currentProfile(), dressed = false, className = '') {
  const product = currentProduct();
  const color = currentColor();
  const buildScale = { '偏瘦': 0.86, '标准': 1, '丰满': 1.16 }[profile.build] || 1;
  const shape = {
    '直筒型': { shoulder: 92, waist: 77, hip: 92 },
    '曲线型': { shoulder: 98, waist: 63, hip: 99 },
    '梨型': { shoulder: 86, waist: 67, hip: 108 },
  }[profile.shape] || { shoulder: 96, waist: 68, hip: 98 };
  const shoulder = shape.shoulder * buildScale;
  const waist = shape.waist * buildScale;
  const hip = shape.hip * buildScale;
  const left = (width) => 160 - width / 2;
  const right = (width) => 160 + width / 2;
  const heightScale = state.heightBand.startsWith('150') ? 0.92 : state.heightBand.startsWith('170') ? 1.06 : 1;
  const translateY = 548 * (1 - heightScale);
  const textureId = `fabric-${product.id}-${state.colorIndex}-${profile.id}`.replace(/[^a-z0-9-]/gi, '');
  const spriteIndex = Math.max(0, products.findIndex((item) => item.id === product.id));
  const spriteX = -(spriteIndex % 3) * 320;
  const spriteY = -Math.floor(spriteIndex / 3) * 560;
  const garmentType = {
    'noir-blazer': 'coat',
    'ivory-dress': 'top',
    'denim-jacket': 'sweatshirt',
    'red-knit': 'longcoat',
    'pleated-skirt': 'shirt',
    'trench-coat': 'pants',
  }[product.id] || 'top';

  const garment = {
    coat: `<path class="garment-piece" d="M ${left(shoulder + 14)} 135 Q 160 112 ${right(shoulder + 14)} 135 L ${right(waist + 20)} 250 L ${right(hip + 28)} 438 Q 160 462 ${left(hip + 28)} 438 L ${left(waist + 20)} 250 Z"/><path class="garment-sleeve" d="M ${left(shoulder)} 150 L 68 305 M ${right(shoulder)} 150 L 252 305"/><path class="garment-detail" d="M 160 132 L 147 250 M 160 132 L 173 250 M ${left(waist + 8)} 252 L ${right(waist + 8)} 252"/>`,
    longcoat: `<path class="garment-piece" d="M ${left(shoulder + 16)} 137 Q 160 112 ${right(shoulder + 16)} 137 L ${right(waist + 22)} 250 L ${right(hip + 34)} 500 Q 160 520 ${left(hip + 34)} 500 L ${left(waist + 22)} 250 Z"/><path class="garment-sleeve" d="M ${left(shoulder)} 150 L 66 330 M ${right(shoulder)} 150 L 254 330"/><path class="garment-detail" d="M 160 134 L 160 490 M ${left(waist + 10)} 258 L ${right(waist + 10)} 258"/>`,
    sweatshirt: `<path class="garment-piece" d="M ${left(shoulder + 18)} 142 Q 160 116 ${right(shoulder + 18)} 142 L ${right(waist + 25)} 294 Q 160 310 ${left(waist + 25)} 294 Z"/><path class="garment-sleeve wide" d="M ${left(shoulder)} 157 L 62 323 M ${right(shoulder)} 157 L 258 323"/><path class="garment-detail" d="M 136 143 Q 160 177 184 143 M ${left(waist + 18)} 286 L ${right(waist + 18)} 286"/>`,
    shirt: `<path class="garment-piece" d="M ${left(shoulder + 12)} 140 Q 160 117 ${right(shoulder + 12)} 140 L ${right(waist + 12)} 290 Q 160 302 ${left(waist + 12)} 290 Z"/><path class="garment-sleeve" d="M ${left(shoulder)} 151 L 71 286 M ${right(shoulder)} 151 L 249 286"/><path class="garment-detail" d="M 160 140 L 160 288 M 143 140 L 160 165 L 177 140"/>`,
    top: `<path class="garment-piece" d="M ${left(shoulder + 4)} 155 Q 160 134 ${right(shoulder + 4)} 155 L ${right(waist + 8)} 278 Q 160 292 ${left(waist + 8)} 278 Z"/><path class="garment-detail" d="M ${left(shoulder - 12)} 157 Q 160 178 ${right(shoulder - 12)} 157"/>`,
    pants: `<path class="garment-piece" d="M ${left(hip + 8)} 290 Q 160 276 ${right(hip + 8)} 290 L ${right(hip / 2 + 25)} 540 L 166 540 L 160 340 L 154 540 L ${left(hip / 2 + 25)} 540 Z"/><path class="garment-detail" d="M ${left(hip + 4)} 304 L ${right(hip + 4)} 304 M 160 302 L 160 338"/>`,
  }[garmentType];

  return `<div class="silhouette-figure ${dressed ? 'dressed' : 'plain'} ${className}" role="img" aria-label="${dressed ? `${product.name} 试穿效果` : '虚拟形象剪影'}">
    <svg viewBox="0 0 320 560" aria-hidden="true">
      <defs><pattern id="${textureId}" width="320" height="560" patternUnits="userSpaceOnUse"><image href="/assets/forme-garments-v1.png" x="${spriteX}" y="${spriteY}" width="960" height="1120" preserveAspectRatio="none"/><rect width="320" height="560" fill="${color.hex}" fill-opacity=".1"/></pattern></defs>
      <g transform="translate(0 ${translateY}) scale(1 ${heightScale})">
        <g class="figure-body">
          <circle cx="160" cy="72" r="31"/>
          <rect x="148" y="100" width="24" height="31" rx="10"/>
          <path d="M ${left(shoulder)} 140 Q 160 118 ${right(shoulder)} 140 L ${right(waist)} 258 Q 160 278 ${left(waist)} 258 Z"/>
          <path class="figure-arms" d="M ${left(shoulder - 5)} 151 L 73 330 M ${right(shoulder - 5)} 151 L 247 330"/>
          <path d="M ${left(hip)} 270 Q 160 245 ${right(hip)} 270 L ${right(hip - 16)} 340 L 177 340 L 181 538 L 160 538 L 154 354 L 148 538 L 127 538 L 143 340 L ${left(hip - 16)} 340 Z"/>
        </g>
        ${dressed ? `<g class="figure-garment" style="--garment-color:${color.hex}"><g fill="url(#${textureId})">${garment}</g></g>` : ''}
      </g>
    </svg>
  </div>`;
}

function money(value) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(value);
}

function setPage(page) {
  state.page = page;
  state.modal = '';
  window.clearInterval(processTimer);
  window.clearInterval(countdownTimer);
  window.scrollTo({ top: 0, behavior: 'instant' });
  render();
}

function toast(message) {
  state.toast = message;
  render();
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => {
    state.toast = '';
    render();
  }, 2400);
}

function profileFromQuick() {
  const exact = avatarProfiles.find((profile) => profile.build === state.quick.build && profile.shape === state.quick.shape);
  return exact || avatarProfiles[4];
}

function profileFromInputs(values) {
  const heightM = values.height / 100;
  const bmi = values.weight / (heightM * heightM);
  const build = bmi < 19 ? '偏瘦' : bmi > 24 ? '丰满' : '标准';
  const hipDiff = values.hips - values.chest;
  const curveRatio = values.waist / Math.min(values.chest, values.hips);
  const shape = hipDiff >= 7 ? '梨型' : curveRatio <= 0.77 ? '曲线型' : '直筒型';
  return avatarProfiles.find((profile) => profile.build === build && profile.shape === shape)
    || avatarProfiles.find((profile) => profile.build === build)
    || avatarProfiles[4];
}

function flowHeader(active = 1) {
  const steps = ['选款', '创建形象', 'AI 生成', '带走结果'];
  return `
    <header class="kiosk-header">
      <button class="brand" data-action="home" aria-label="返回商品首页">
        <span class="brand-mark">F</span>
        <span><strong>FORME</strong><small>VIRTUAL FITTING STUDIO</small></span>
      </button>
      <ol class="flow-steps" aria-label="试衣步骤">
        ${steps.map((step, index) => {
          const stepNumber = index + 1;
          return `<li class="${stepNumber === active ? 'active' : ''}"><button data-flow-step="${stepNumber}" ${stepNumber === active ? 'aria-current="step"' : ''}><b>0${stepNumber}</b><span>${step}</span></button></li>`;
        }).join('')}
      </ol>
      <div class="header-actions">
        <button class="icon-btn" data-action="privacy" title="隐私说明">${icon('shield-check')}</button>
        <button class="icon-btn" data-action="settings" title="Demo 设置">${icon('settings-2')}</button>
      </div>
    </header>`;
}

function backBar(title, subtitle, active = 2) {
  return `${flowHeader(active)}
    <div class="page-heading">
      <button class="icon-btn" data-action="back" title="返回">${icon('arrow-left')}</button>
      <div><h1>${title}</h1><p>${subtitle}</p></div>
    </div>`;
}

function renderCatalog() {
  const filtered = state.category === '全部' ? products : products.filter((product) => product.category === state.category);
  const product = currentProduct();
  return `
    <div class="kiosk-page catalog-page">
      ${flowHeader(1)}
      <main class="catalog-stage">
        <section class="catalog-hero">
          <img src="${product.colors[0].url}" style="object-position:${product.colors[0].position}" alt="${product.name}">
          <div class="hero-index">LOOK ${String(products.findIndex((item) => item.id === product.id) + 1).padStart(2, '0')}</div>
          <div class="hero-copy"><p>${product.category} / ${product.badge}</p><h1>${product.name}</h1><span>${product.subtitle}</span><strong>${money(product.price)}</strong><button class="primary-btn hero-action" data-action="start">${state.changingProduct ? '使用当前形象试穿' : '开始试穿'} ${icon('arrow-right', 26)}</button></div>
        </section>
        <section class="catalog-panel">
          <div class="catalog-prompt"><p>${state.changingProduct ? 'CURRENT FIT / KEEP YOUR AVATAR' : "FORME CENTRAL / TODAY'S EDIT"}</p><h2>${state.changingProduct ? '换一件，继续<br>使用当前形象' : '选一套，看看<br>上身效果'}</h2></div>
          <nav class="category-nav" aria-label="服装分类">${categories.map((category) => `<button class="${state.category === category ? 'active' : ''}" data-category="${category}">${category}</button>`).join('')}</nav>
          <div class="product-grid">
            ${filtered.map((item) => `
              <button class="product-card ${item.id === state.productId ? 'selected' : ''}" data-product="${item.id}">
                <span class="product-image"><img src="${item.colors[0].url}" style="object-position:${item.colors[0].position}" alt="${item.name}" loading="lazy"></span>
                <span class="product-copy"><strong>${item.name}</strong><small>${money(item.price)}</small></span>
              </button>`).join('')}
          </div>
          <div class="privacy-note">${icon(state.changingProduct ? 'refresh-cw' : 'shield-check', 22)}<span>${state.changingProduct ? '当前形象已保留，选择商品后直接生成' : '无需照片或账号，本次体验结束后自动清除'}</span></div>
        </section>
      </main>
    </div>`;
}

function renderAvatarChoice() {
  return `
    <div class="kiosk-page">
      ${backBar('创建虚拟形象', '选择一种方式开始，稍后仍可返回调整。')}
      <main class="choice-stage">
        <section class="choice-intro">
          <p class="eyebrow">CREATE YOUR FIT</p>
          <h2>选择创建方式</h2>
          <p>用最顺手的方式完成虚拟形象，整个过程不需要上传真人照片。</p>
        </section>
        <div class="choice-grid">
          <button class="choice-option recommended" data-action="quick">
            <span class="choice-visual quick-visual"><i></i><i></i><i></i></span>
            <span class="choice-tag">推荐 · 约 20 秒</span>
            <strong>快速选择</strong>
            <span>在大屏选择身高范围与基础身形。</span>
            <b>在大屏开始 ${icon('arrow-right')}</b>
          </button>
          <button class="choice-option" data-action="precise">
            <span class="choice-visual phone-visual">${icon('smartphone', 56)}<i>${icon('ruler', 24)}</i></span>
            <span class="choice-tag neutral">约 1 分钟</span>
            <strong>手机填写</strong>
            <span>扫码填写身高、体重与围度。</span>
            <b>扫码填写 ${icon('qr-code')}</b>
          </button>
        </div>
      </main>
    </div>`;
}

function segmented(key, values) {
  return `<div class="segmented" data-group="${key}">${values.map((value) => `<button class="${state.quick[key] === value ? 'active' : ''}" data-quick-key="${key}" data-quick-value="${value}">${value}</button>`).join('')}</div>`;
}

function renderQuick() {
  const preview = profileFromQuick();
  return `
    <div class="kiosk-page">
      ${backBar('选择基础身形', '选择最接近你的选项，效果生成后仍可调整。')}
      <main class="split-stage quick-stage">
        <section class="form-panel">
          <div class="field-block"><label>身高范围</label>${segmented('height', ['150–159 cm', '160–169 cm', '170 cm 以上'])}</div>
          <div class="field-block"><label>整体体型</label>${segmented('build', ['偏瘦', '标准', '丰满'])}</div>
          <div class="field-block"><label>身体比例</label>${segmented('shape', ['直筒型', '曲线型', '梨型'])}</div>
          <p class="inline-note">${icon('info', 18)} 不确定也没关系，稍后可以随时调整并重新生成。</p>
          <button class="primary-btn wide" data-action="confirm-quick">继续 ${icon('arrow-right')}</button>
        </section>
        <section class="avatar-preview">
          <span class="preview-label">形象预览</span>
          <img class="avatar-master-image" src="${avatarMasterUrl(preview)}" alt="${preview.build}${preview.shape}虚拟形象">
          <div class="avatar-caption"><strong>你的虚拟形象</strong><span>预览会随选择更新</span></div>
        </section>
      </main>
    </div>`;
}

function renderPhoneWait() {
  return `
    <div class="kiosk-page">
      ${backBar('使用手机填写', '扫描二维码，在手机上完成身形设置。')}
      <main class="phone-handoff">
        <section class="handoff-copy">
          <p class="eyebrow">CONTINUE ON PHONE</p>
          <h1>拿出手机<br>继续创建</h1>
          <p>填写完成后将直接进入手机商品页。</p>
          <div class="phone-steps"><span><b>01</b> 扫描二维码</span><span><b>02</b> 填写并确认</span><span><b>03</b> 查看试穿商品</span></div>
        </section>
        <section class="qr-panel">
          <div class="qr-frame"><canvas class="js-qr" data-qr="${mobileUrl('avatar')}"></canvas></div>
          <strong>扫码打开填写页</strong><span>二维码 10 分钟内有效</span>
          <button class="secondary-btn demo-phone-btn" data-action="simulate-phone">演示手机联动 ${icon('external-link', 18)}</button>
        </section>
      </main>
    </div>`;
}

function renderPreciseForm(inPhone = false) {
  const fields = [
    ['height', '身高', 'cm', 140, 195], ['weight', '体重', 'kg', 35, 120],
    ['chest', '胸围', 'cm', 65, 125], ['waist', '腰围', 'cm', 50, 115], ['hips', '臀围', 'cm', 70, 135],
  ];
  return `
    <form class="precise-form" data-form="precise">
      <div class="form-lead"><span>${icon('shield-check', 22)}</span><div><strong>本次体验结束后自动清除</strong><p>我们不会把身体数据写入会员或订单。</p></div></div>
      <div class="measure-grid">
        ${fields.map(([key, label, unit, min, max]) => `<label><span>${label}</span><span class="input-unit"><input name="${key}" type="number" min="${min}" max="${max}" value="${state.precise[key]}" required><b>${unit}</b></span></label>`).join('')}
      </div>
      <label class="consent"><input type="checkbox" required checked><span>我已了解：AI 效果仅供款式与轮廓参考，不代表实际尺码和合身度。</span></label>
      <button class="primary-btn wide" type="submit">确认并继续 ${icon(inPhone ? 'send' : 'arrow-right')}</button>
    </form>`;
}

function renderConfirm() {
  const product = currentProduct();
  const profile = currentProfile();
  return `
    <div class="kiosk-page">
      ${backBar('准备试穿', '确认形象与服装后开始生成。')}
      <main class="split-stage confirm-stage">
        <section class="avatar-preview large"><span class="preview-label">虚拟形象</span><img class="avatar-master-image" src="${avatarMasterUrl(profile)}" alt="已选择的虚拟形象"></section>
        <section class="confirm-copy">
          <p class="eyebrow">READY TO TRY ON</p><h2>形象已准备好</h2>
          <div class="outfit-row"><img src="${product.colors[0].url}" style="object-position:${product.colors[0].position}" alt="${product.name}"><div><small>即将试穿</small><strong>${product.name}</strong><span>${currentColor().name} · ${money(product.price)}</span></div></div>
          <p class="inline-note">${icon('shield-check', 18)} 无需照片。AI 效果仅供款式和整体轮廓参考。</p>
          <div class="button-row"><button class="secondary-btn" data-action="adjust">重新选择</button><button class="primary-btn" data-action="generate">开始生成 ${icon('sparkles')}</button></div>
        </section>
      </main>
    </div>`;
}

function renderProcessing() {
  const product = currentProduct();
  const stages = [
    ['人物准备', 15], ['服装适配', 48], ['细节优化', 78], ['即将完成', 96],
  ];
  const activeStage = stages.findIndex(([, threshold]) => state.progress < threshold);
  return `
    <div class="kiosk-page processing-page">
      ${flowHeader(3)}
      <main class="processing-stage">
        <section class="scan-preview">${tryOnImageMarkup('processing-image')}<span class="scan-line"></span><span class="ai-chip">${icon('sparkles', 16)} AI 生成中</span></section>
        <section class="processing-copy">
          <p class="eyebrow">预计还需 ${Math.max(1, Math.ceil((100 - state.progress) / 20))} 秒</p>
          <h1>正在把 ${product.name}<br>适配到你的虚拟形象</h1>
          <div class="progress-track"><i style="width:${state.progress}%"></i></div><strong class="progress-number">${state.progress}%</strong>
          <ol class="generation-steps">${stages.map(([label], index) => `<li class="${index < activeStage || activeStage === -1 ? 'done' : index === activeStage ? 'active' : ''}">${index < activeStage || activeStage === -1 ? icon('check', 16) : `<b>${index + 1}</b>`}<span>${label}</span></li>`).join('')}</ol>
          <div class="product-fact"><span>款式提示</span><p>${product.subtitle}。生成结果用于判断颜色、风格和整体轮廓，实际合身度请以到店试穿为准。</p></div>
          <button class="text-btn" data-action="cancel-generation">取消生成</button>
        </section>
      </main>
    </div>`;
}

function resultUrl() {
  return mobileUrl('result');
}

function mobileUrl(mode) {
  const url = new URL(window.location.href);
  url.search = '';
  url.searchParams.set('screen', 'mobile');
  url.searchParams.set('mode', mode);
  url.searchParams.set('product', state.productId);
  url.searchParams.set('session', sessionId);
  if (mode === 'result') {
    url.searchParams.set('color', String(state.colorIndex));
    url.searchParams.set('avatar', state.profileId);
    url.searchParams.set('height', state.heightBand);
    url.searchParams.set('expires', String(Date.now() + 30 * 60 * 1000));
  }
  return url.toString();
}

function renderResult() {
  const product = currentProduct();
  const sizes = Object.entries(product.stock);
  const otherProducts = products.filter((item) => item.id !== product.id);
  return `
    <div class="kiosk-page result-page">
      ${flowHeader(4)}
      <main class="result-layout">
        <section class="result-visual">
          ${tryOnImageMarkup('result-image')}
          <span class="result-disclaimer">AI 效果仅供款式与轮廓参考</span>
        </section>
        <section class="result-details">
          <p class="success-kicker">${icon('circle-check', 18)} 试穿效果已生成</p><h1>${product.name}</h1><p class="product-subtitle">${product.subtitle}</p><strong class="result-price">${money(product.price)}</strong>
          <div class="detail-group"><label>颜色</label><div class="color-options">${product.colors.map((color, index) => `<button class="${state.colorIndex === index ? 'active' : ''}" data-color="${index}"><i style="background:${color.hex}"></i><span>${color.name}</span></button>`).join('')}</div></div>
          <div class="detail-group"><label>本店尺码库存${state.selectedSize ? ` · 已选 ${state.selectedSize}` : ''}</label><div class="size-stock">${sizes.map(([size, count]) => `<button class="${state.selectedSize === size ? 'active' : ''} ${count === 0 ? 'soldout' : ''}" data-size="${size}" ${count === 0 ? 'disabled' : ''}><b>${size}</b><small>${count ? `${count} 件` : '缺货'}</small></button>`).join('')}</div></div>
          <div class="result-actions"><button class="secondary-btn" data-action="change-product">${icon('shirt')} 换一件</button><button class="secondary-btn" data-action="regenerate">${icon('refresh-cw')} 重新生成</button></div>
          <section class="try-more-section">
            <div class="try-more-heading"><div><span>KEEP TRYING</span><h2>再试试其他款式</h2></div><small>保留当前形象，直接生成</small></div>
            <div class="try-more-list">
              ${otherProducts.map((item) => `
                <button class="try-more-card" data-try-product="${item.id}">
                  <img src="${item.colors[0].url}" style="object-position:${item.colors[0].position}" alt="${item.name}">
                  <span><strong>${item.name}</strong><small>${money(item.price)}</small></span>
                  ${icon('arrow-right', 17)}
                </button>`).join('')}
            </div>
          </section>
          <div class="handoff-strip"><div class="small-qr"><canvas class="js-qr" data-qr="${resultUrl()}"></canvas></div><div><strong>扫码带到手机</strong><span>查看实时库存、到店试穿或购买</span><small>${state.resultSeconds} 秒后自动清除大屏结果</small></div><button class="primary-btn" data-action="store-buy">本店购买</button></div>
          <button class="clear-link" data-action="clear-session">${icon('trash-2', 16)} 结束并清除本次数据</button>
        </section>
      </main>
    </div>`;
}

function renderFailure(type) {
  const timeout = type === 'timeout';
  return `
    <div class="kiosk-page">
      ${flowHeader(3)}
      <main class="status-stage">
        <span class="status-icon ${timeout ? 'warning' : 'error'}">${icon(timeout ? 'clock-3' : 'refresh-cw', 42)}</span>
        <p class="eyebrow">${timeout ? '生成时间超出预期' : '本次生成没有完成'}</p>
        <h1>${timeout ? '还需要一点时间' : '我们没有生成可用的效果'}</h1>
        <p>${timeout ? '任务仍在处理中，你可以继续等待，也可以扫码到手机查看结果。' : '系统已自动重试一次。你可以再次尝试、换一件商品，或直接查看商品详情。'}</p>
        <div class="status-actions">
          <button class="primary-btn" data-action="retry">${timeout ? '继续等待' : '再次生成'} ${icon('refresh-cw')}</button>
          <button class="secondary-btn" data-action="change-product">换一件商品</button>
          <button class="secondary-btn" data-action="product-qr">扫码看商品</button>
        </div>
      </main>
    </div>`;
}

function renderMobile() {
  if (state.mobileMode === 'avatar') {
    return `<div class="mobile-page"><header class="mobile-header"><span class="brand-mark">F</span><div><strong>FORME</strong><small>VIRTUAL FITTING</small></div></header><main class="mobile-content"><p class="eyebrow">CREATE YOUR FIT</p><h1>填写身体参数</h1>${renderPreciseForm(true)}</main><footer class="mobile-privacy">${icon('shield-check', 16)} 本次体验结束后自动清除</footer></div>`;
  }
  const product = currentProduct();
  const color = currentColor();
  const expired = Number(params.get('expires')) < Date.now();
  if (expired) return `<div class="mobile-page"><main class="mobile-empty"><span>${icon('clock-3', 36)}</span><h1>试穿结果已失效</h1><p>为保护隐私，试穿结果仅短期保留。请回到门店大屏重新试穿。</p></main></div>`;
  return `
    <div class="mobile-page result-mobile">
      <header class="mobile-header"><span class="brand-mark">F</span><div><strong>FORME</strong><small>CENTRAL STORE</small></div><button class="icon-btn" data-action="favorite" title="收藏">${icon('heart')}</button></header>
      <main class="mobile-content no-top"><div class="mobile-result-image">${tryOnImageMarkup('mobile-image')}<span>AI 试穿效果</span></div>
        <section class="mobile-product"><p>${product.category} · ${color.name}</p><h1>${product.name}</h1><strong>${money(product.price)}</strong><span>${product.subtitle}</span></section>
        <section class="mobile-section"><div class="mobile-section-title"><h2>选择尺码</h2><button data-action="size-help">尺码建议</button></div><div class="mobile-sizes">${Object.entries(product.stock).map(([size, count]) => `<button class="${state.selectedSize === size ? 'active' : ''} ${count === 0 ? 'soldout' : ''}" data-size="${size}" ${count === 0 ? 'disabled' : ''}><b>${size}</b><span>${count ? `${count} 件` : '缺货'}</span></button>`).join('')}</div></section>
        <section class="mobile-section"><h2>怎么带走</h2><div class="fulfilment-list"><button data-fulfilment="pickup">${icon('shopping-bag')}<span><strong>本店购买，立即取货</strong><small>选择后锁定 10 分钟</small></span>${icon('chevron-right')}</button><button data-fulfilment="fitting">${icon('door-open')}<span><strong>保留商品，进店试穿</strong><small>出示预约码，店员备货</small></span>${icon('chevron-right')}</button><button data-fulfilment="delivery">${icon('truck')}<span><strong>线上配送</strong><small>预计 2–3 天送达</small></span>${icon('chevron-right')}</button><button data-fulfilment="transfer">${icon('map-pin')}<span><strong>附近门店 / 跨店取货</strong><small>${stores[1].name} 有货</small></span>${icon('chevron-right')}</button></div></section>
      </main>
      <div class="mobile-buybar"><div><small>合计</small><strong>${money(product.price)}</strong></div><button data-action="checkout">去购买</button></div>
    </div>`;
}

function renderSettings() {
  if (state.modal !== 'settings') return '';
  return `<div class="modal-backdrop" data-dismiss-modal><section class="dialog" role="dialog" aria-modal="true"><button class="dialog-close" data-action="close-modal">${icon('x')}</button><p class="eyebrow">DEMO STATES</p><h2>选择生成状态</h2><div class="scenario-list">${[['success','正常成功','约 5 秒进入结果页'],['failure','生成失败','查看失败后的处理方式'],['timeout','生成超时','查看等待超时状态']].map(([value,title,copy]) => `<button class="${state.scenario === value ? 'active' : ''}" data-scenario="${value}"><span>${state.scenario === value ? icon('check') : ''}</span><div><strong>${title}</strong><small>${copy}</small></div></button>`).join('')}</div><button class="primary-btn wide" data-action="close-modal">完成</button></section></div>`;
}

function renderActionModal() {
  const copy = {
    privacy: ['隐私说明', '无需照片或账号。身体参数仅用于本次形象生成，结束后自动删除；二维码只包含短期会话信息。'],
    'store-buy': ['本店购买', '选择尺码后可保留库存 10 分钟，并生成到店取货码。'],
    'product-qr': ['扫码查看商品', '手机端可查看商品信息和模拟库存，不需要重新生成试穿效果。'],
    favorite: ['已收藏试穿结果', '登录后可以长期保存，并在其他设备继续查看。'],
    'size-help': ['尺码建议', '请选择常穿尺码，并以到店试穿结果为准。'],
    pickup: ['本店取货', '已保留所选尺码 10 分钟，支付前会再次确认库存。'],
    fitting: ['预约试穿', '商品会模拟保留 10 分钟。到店后向店员出示预约码即可试穿。'],
    delivery: ['线上配送', '下一步可填写收货地址并选择支付方式。'],
    transfer: ['跨店取货', `${stores[1].name} 显示有货，确认后将为你保留。`],
    checkout: ['确认购买', state.selectedSize ? `已选择 ${state.selectedSize} 码。这里将进入支付，Demo 到此结束。` : '请先选择一个有货尺码，再进入购买流程。'],
  };
  if (!copy[state.modal]) return '';
  const [title, body] = copy[state.modal];
  const showQr = state.modal === 'product-qr';
  return `<div class="modal-backdrop" data-dismiss-modal><section class="dialog compact" role="dialog" aria-modal="true"><button class="dialog-close" data-action="close-modal">${icon('x')}</button><span class="dialog-icon">${icon(showQr ? 'qr-code' : 'circle-check', 32)}</span><h2>${title}</h2><p>${body}</p>${showQr ? `<div class="qr-frame small"><canvas class="js-qr" data-qr="${resultUrl()}"></canvas></div>` : ''}<button class="primary-btn wide" data-action="close-modal">我知道了</button></section></div>`;
}

function renderPhoneModal() {
  if (state.modal !== 'phone') return '';
  return `<div class="modal-backdrop phone-backdrop" data-dismiss-modal><section class="phone-simulator" role="dialog" aria-modal="true"><div class="phone-top"><span>9:41</span><i></i><button data-action="close-modal">${icon('x', 18)}</button></div><header><span class="brand-mark">F</span><div><strong>FORME</strong><small>VIRTUAL FITTING</small></div></header><main><h2>填写身体参数</h2><p>确认后将继续到试穿页面。</p>${renderPreciseForm(true)}</main></section></div>`;
}

function render() {
  const pages = {
    catalog: renderCatalog,
    'avatar-choice': renderAvatarChoice,
    quick: renderQuick,
    'phone-wait': renderPhoneWait,
    confirm: renderConfirm,
    processing: renderProcessing,
    result: renderResult,
    failure: () => renderFailure('failure'),
    timeout: () => renderFailure('timeout'),
    mobile: renderMobile,
  };
  app.innerHTML = `${(pages[state.page] || renderCatalog)()}${renderSettings()}${renderActionModal()}${renderPhoneModal()}${state.toast ? `<div class="toast">${icon('circle-check', 18)} ${state.toast}</div>` : ''}`;
  createIcons({ icons });
  hydrateQrCodes();
}

async function hydrateQrCodes() {
  await Promise.all([...document.querySelectorAll('.js-qr')].map(async (canvas) => {
    await QRCode.toCanvas(canvas, canvas.dataset.qr, { width: canvas.closest('.small-qr') ? 116 : 188, margin: 1, color: { dark: '#1e2923', light: '#ffffff' } });
  }));
}

function startGeneration() {
  state.page = 'processing';
  state.progress = 8;
  state.resultReady = false;
  render();
  window.clearInterval(processTimer);
  processTimer = window.setInterval(() => {
    state.progress = Math.min(100, state.progress + 13 + Math.floor(Math.random() * 9));
    if (state.progress >= 100) {
      window.clearInterval(processTimer);
      window.setTimeout(() => {
        if (state.scenario === 'failure') setPage('failure');
        else if (state.scenario === 'timeout') setPage('timeout');
        else {
          state.resultSeconds = 45;
          state.resultReady = true;
          setPage('result');
          startCountdown();
        }
      }, 450);
    } else render();
  }, 650);
}

function startCountdown() {
  window.clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    state.resultSeconds -= 1;
    if (state.resultSeconds <= 0) {
      window.clearInterval(countdownTimer);
      state.profileId = 'standard-curved';
      state.colorIndex = 0;
      state.profileReady = false;
      state.resultReady = false;
      state.changingProduct = false;
      setPage('catalog');
      toast('会话已结束，数据已清除');
    } else if (state.resultSeconds % 5 === 0 || state.resultSeconds <= 5) render();
  }, 1000);
}

function handleBack() {
  const previous = {
    'avatar-choice': 'catalog', quick: 'avatar-choice', 'phone-wait': 'avatar-choice', confirm: 'avatar-choice',
  };
  setPage(previous[state.page] || 'catalog');
}

function handleFlowStep(step) {
  if (step === 1) {
    state.changingProduct = state.profileReady;
    return setPage('catalog');
  }
  if (step === 2) {
    state.changingProduct = false;
    return setPage('avatar-choice');
  }
  if (!state.profileReady) {
    setPage('avatar-choice');
    return toast('请先创建虚拟形象');
  }
  if (step === 3) return setPage('confirm');
  if (step === 4 && state.resultReady) {
    setPage('result');
    return startCountdown();
  }
  setPage('confirm');
  return toast('请先完成 AI 生成');
}

app.addEventListener('click', (event) => {
  if (event.target.matches('[data-dismiss-modal]')) {
    state.modal = '';
    return render();
  }
  const flowStep = event.target.closest('[data-flow-step]');
  if (flowStep) return handleFlowStep(Number(flowStep.dataset.flowStep));
  const productButton = event.target.closest('[data-product]');
  if (productButton) {
    state.productId = productButton.dataset.product;
    state.colorIndex = 0;
    state.selectedSize = '';
    state.resultReady = false;
    return render();
  }
  const category = event.target.closest('[data-category]');
  if (category) {
    state.category = category.dataset.category;
    const available = state.category === '全部' ? products : products.filter((product) => product.category === state.category);
    if (!available.some((product) => product.id === state.productId)) state.productId = available[0].id;
    return render();
  }
  const quickOption = event.target.closest('[data-quick-key]');
  if (quickOption) {
    state.quick[quickOption.dataset.quickKey] = quickOption.dataset.quickValue;
    return render();
  }
  const color = event.target.closest('[data-color]');
  if (color) {
    state.colorIndex = Number(color.dataset.color);
    state.selectedSize = '';
    return render();
  }
  const tryProduct = event.target.closest('[data-try-product]');
  if (tryProduct) {
    state.productId = tryProduct.dataset.tryProduct;
    state.colorIndex = 0;
    state.selectedSize = '';
    return startGeneration();
  }
  const scenario = event.target.closest('[data-scenario]');
  if (scenario) {
    state.scenario = scenario.dataset.scenario;
    return render();
  }
  const size = event.target.closest('[data-size]');
  if (size) {
    state.selectedSize = size.dataset.size;
    return toast(`已选择 ${state.selectedSize} 码`);
  }
  const fulfilment = event.target.closest('[data-fulfilment]');
  if (fulfilment) {
    state.modal = fulfilment.dataset.fulfilment;
    return render();
  }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'home') {
    state.changingProduct = false;
    return setPage('catalog');
  }
  if (action === 'back') return handleBack();
  if (action === 'start') {
    if (state.changingProduct && state.profileReady) {
      state.changingProduct = false;
      state.selectedSize = '';
      return startGeneration();
    }
    return setPage('avatar-choice');
  }
  if (action === 'quick') return setPage('quick');
  if (action === 'precise') return setPage(state.phoneComplete ? 'confirm' : 'phone-wait');
  if (action === 'confirm-quick') {
    state.profileId = profileFromQuick().id;
    state.heightBand = state.quick.height;
    state.profileReady = true;
    state.resultReady = false;
    return setPage('confirm');
  }
  if (action === 'simulate-phone') {
    state.modal = 'phone';
    return render();
  }
  if (action === 'continue-confirm') return setPage('confirm');
  if (action === 'adjust') return setPage('avatar-choice');
  if (action === 'generate' || action === 'retry') return startGeneration();
  if (action === 'cancel-generation') return setPage('confirm');
  if (action === 'change-product') {
    state.changingProduct = state.profileReady;
    state.selectedSize = '';
    return setPage('catalog');
  }
  if (action === 'regenerate') return startGeneration();
  if (action === 'clear-session') {
    state.profileId = 'standard-curved';
    state.colorIndex = 0;
    state.profileReady = false;
    state.resultReady = false;
    state.changingProduct = false;
    setPage('catalog');
    return toast('本次体验数据已清除');
  }
  if (action === 'settings' || action === 'privacy' || action === 'store-buy' || action === 'product-qr' || action === 'favorite' || action === 'size-help' || action === 'checkout') {
    state.modal = action;
    return render();
  }
  if (action === 'close-modal') {
    state.modal = '';
    return render();
  }
});

app.addEventListener('submit', (event) => {
  if (!event.target.matches('[data-form="precise"]')) return;
  event.preventDefault();
  const form = new FormData(event.target);
  const values = Object.fromEntries(['height', 'weight', 'chest', 'waist', 'hips'].map((key) => [key, Number(form.get(key))]));
  state.precise = values;
  state.heightBand = values.height < 160 ? '150–159 cm' : values.height >= 170 ? '170 cm 以上' : '160–169 cm';
  state.profileId = profileFromInputs(values).id;
  state.phoneComplete = true;
  state.profileReady = true;
  state.resultReady = false;
  const payload = { sessionId, profileId: state.profileId, heightBand: state.heightBand };
  localStorage.setItem(`forme-fitting-${sessionId}`, JSON.stringify(payload));
  syncChannel?.postMessage(payload);
  if (mobileRoute) {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', 'result');
    url.searchParams.set('avatar', state.profileId);
    url.searchParams.set('height', state.heightBand);
    url.searchParams.set('color', '0');
    url.searchParams.set('expires', String(Date.now() + 30 * 60 * 1000));
    window.location.replace(url);
  } else {
    state.modal = '';
    setPage('confirm');
    toast('手机填写已完成');
  }
});

render();
