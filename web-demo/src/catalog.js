export const products = [
  {
    id: 'han-blue',
    name: '天青战国袍',
    subtitle: '交领广袖 · 提花织锦',
    price: 899,
    category: '汉服',
    badge: '本店热选',
    colors: [
      { name: '天青', hex: '#88a9bd', image: 'https://www.lanmei66.cloud/merchants/3/shops/5/album_images/515/d5365da8-a27d-4038-8114-0959ba2dc67e.jpeg' },
      { name: '月白', hex: '#e8e2d8', image: 'https://www.lanmei66.cloud/merchants/3/shops/5/album_images/515/b8ed11fb-2a07-4c3e-9237-52129be4880a.jpeg' },
    ],
    stock: { XS: 2, S: 6, M: 8, L: 3, XL: 0 },
  },
  {
    id: 'miao-red',
    name: '赤羽苗绣长裙',
    subtitle: '银饰套装 · 手工绣片',
    price: 759,
    category: '民族服',
    badge: '库存紧张',
    colors: [
      { name: '朱红', hex: '#a72c2b', image: 'https://www.lanmei66.cloud/test/album-images/2/297/20b4a1d9-5111-40cf-9658-fcb931a2076e.jpg' },
      { name: '绛红', hex: '#6f2429', image: 'https://www.lanmei66.cloud/test/album-images/2/297/9e07dc7c-06f6-40ee-a311-bd808dedb394.jpg' },
    ],
    stock: { XS: 0, S: 2, M: 1, L: 0, XL: 0 },
  },
  {
    id: 'xiaowei-white',
    name: '小唯月影裙',
    subtitle: '一字肩 · 云纹束腰',
    price: 699,
    category: '国风新中式',
    badge: '新款',
    colors: [
      { name: '月白', hex: '#f0eee9', image: 'https://www.lanmei66.cloud/test/album-images/2/296/2a0f332a-9fa6-4ef3-9757-87bf5292497e.jpg' },
      { name: '烟粉', hex: '#cfafb1', image: 'https://www.lanmei66.cloud/test/album-images/2/296/513c9c69-7862-4adb-b390-bca6e7a953be.jpg' },
    ],
    stock: { XS: 3, S: 4, M: 6, L: 4, XL: 1 },
  },
  {
    id: 'zhinv-green',
    name: '织女春水衫',
    subtitle: '轻纱叠穿 · 渐变裙摆',
    price: 629,
    category: '汉服',
    badge: '本店有货',
    colors: [
      { name: '春水', hex: '#b6c9a1', image: 'https://www.lanmei66.cloud/test/album-images/2/181/ba50fdf1-ed2e-485e-b251-8366a4b27e49.jpg' },
      { name: '桃粉', hex: '#d9b5b4', image: 'https://www.lanmei66.cloud/test/album-images/2/181/1158f2e6-84fa-4464-a8be-3f761b41e93a.jpg' },
    ],
    stock: { XS: 1, S: 5, M: 7, L: 5, XL: 2 },
  },
  {
    id: 'qipao-green',
    name: '竹影真丝旗袍',
    subtitle: '中长款 · 侧开衩',
    price: 1099,
    category: '旗袍',
    badge: '店员推荐',
    colors: [
      { name: '竹青', hex: '#405841', image: 'https://www.lanmei66.cloud/test/album-images/1/120/e034446f-30f1-461c-871d-990891912da6.jpg' },
      { name: '墨绿', hex: '#1f372a', image: 'https://www.lanmei66.cloud/test/album-images/1/120/14a3ee47-4074-40dd-994a-38843337d5df.jpg' },
    ],
    stock: { XS: 0, S: 3, M: 4, L: 2, XL: 0 },
  },
  {
    id: 'han-pink',
    name: '海棠明制长衫',
    subtitle: '立领对襟 · 海棠刺绣',
    price: 829,
    category: '汉服',
    badge: '可调货',
    colors: [
      { name: '海棠粉', hex: '#e5c4c2', image: 'https://www.lanmei66.cloud/merchants/1/shops/1/album_images/516/dc4a28d3-1738-4d77-b395-85773c9ceae5.jpg' },
      { name: '冰蓝', hex: '#b8cbd5', image: 'https://www.lanmei66.cloud/merchants/1/shops/1/album_images/516/f59a959d-0ef5-433a-a517-e2ff27214b7d.jpg' },
    ],
    stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
  },
];

export const avatarProfiles = [
  { id: 'slim-straight', build: '偏瘦', shape: '直筒型', label: '清瘦直线型', image: products[2].colors[0].image },
  { id: 'slim-curved', build: '偏瘦', shape: '曲线型', label: '清瘦曲线型', image: products[3].colors[0].image },
  { id: 'slim-pear', build: '偏瘦', shape: '梨型', label: '清瘦下身型', image: products[3].colors[0].image },
  { id: 'standard-straight', build: '标准', shape: '直筒型', label: '匀称直线型', image: products[0].colors[0].image },
  { id: 'standard-curved', build: '标准', shape: '曲线型', label: '匀称曲线型', image: products[4].colors[0].image },
  { id: 'standard-pear', build: '标准', shape: '梨型', label: '匀称下身型', image: products[1].colors[0].image },
  { id: 'full-straight', build: '丰满', shape: '直筒型', label: '丰满直线型', image: products[5].colors[0].image },
  { id: 'full-curved', build: '丰满', shape: '曲线型', label: '丰满曲线型', image: products[4].colors[0].image },
  { id: 'full-pear', build: '丰满', shape: '梨型', label: '丰满下身型', image: products[1].colors[0].image },
];

export const stores = [
  { id: 'honghe', name: '蓝梅 · 红河水乡店', distance: '当前门店' },
  { id: 'taipinghu', name: '蓝梅 · 太平湖店', distance: '2.4 km' },
  { id: 'huahua', name: '蓝梅 · 花花旅拍店', distance: '4.8 km' },
];
