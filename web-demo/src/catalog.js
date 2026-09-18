const image = (id, position = 'center') => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=88`,
  position,
});

export const products = [
  {
    id: 'noir-blazer',
    name: 'No. 07 廓形风衣',
    subtitle: '可拆卸围巾 · 宽肩剪裁',
    price: 1299,
    category: '外套',
    badge: '店内热选',
    colors: [
      { name: '穹顶蓝', hex: '#7596ba', ...image('photo-1539109136881-3be0616acf4b') },
      { name: '雾灰', hex: '#9a9994', ...image('photo-1529139574466-a303027c1d8b') },
    ],
    stock: { XS: 2, S: 6, M: 8, L: 3, XL: 0 },
  },
  {
    id: 'ivory-dress',
    name: 'Contour 一字领上衣',
    subtitle: '弹力针织 · 修身剪裁',
    price: 699,
    category: '上衣',
    badge: '新品',
    colors: [
      { name: '鸢尾紫', hex: '#6e315c', ...image('photo-1566174053879-31528523f8ae') },
      { name: '夜幕黑', hex: '#272727', ...image('photo-1496747611176-843222e1e57c') },
    ],
    stock: { XS: 3, S: 5, M: 6, L: 2, XL: 0 },
  },
  {
    id: 'denim-jacket',
    name: 'Signal 图案卫衣',
    subtitle: '柔软棉质 · 宽松短版',
    price: 599,
    category: '上衣',
    badge: '本店有货',
    colors: [
      { name: '信号红', hex: '#b83232', ...image('photo-1529139574466-a303027c1d8b') },
      { name: '深靛蓝', hex: '#273747', ...image('photo-1545291730-faff8ca1d4b0') },
    ],
    stock: { XS: 1, S: 4, M: 7, L: 5, XL: 2 },
  },
  {
    id: 'red-knit',
    name: 'Bloom 印花长外套',
    subtitle: '轻量面料 · 艺术印花',
    price: 1099,
    category: '外套',
    badge: '低库存',
    colors: [
      { name: '春日印花', hex: '#b8695c', ...image('photo-1496747611176-843222e1e57c') },
      { name: '暖白', hex: '#e8e2d8', ...image('photo-1515886657613-9f3515b0c78f') },
    ],
    stock: { XS: 0, S: 1, M: 2, L: 0, XL: 0 },
  },
  {
    id: 'pleated-skirt',
    name: 'Arc 条纹收腰衬衫',
    subtitle: '立体条纹 · 收腰剪裁',
    price: 699,
    category: '上衣',
    badge: '店员推荐',
    colors: [
      { name: '黑白条纹', hex: '#74736f', ...image('photo-1583496661160-fb5886a0aaaa') },
      { name: '沙金', hex: '#b59d77', ...image('photo-1485968579580-b6d095142e6e') },
    ],
    stock: { XS: 2, S: 3, M: 5, L: 2, XL: 1 },
  },
  {
    id: 'trench-coat',
    name: 'Line 高腰阔腿裤',
    subtitle: '垂感面料 · 高腰长线条',
    price: 799,
    category: '下装',
    badge: '可跨店调货',
    colors: [
      { name: '日光黄', hex: '#d1a830', ...image('photo-1515886657613-9f3515b0c78f') },
      { name: '松针绿', hex: '#4c5748', ...image('photo-1537832816519-689ad163238b') },
    ],
    stock: { XS: 0, S: 0, M: 0, L: 0, XL: 0 },
  },
];

export const avatarProfiles = [
  { id: 'slim-straight', build: '偏瘦', shape: '直筒型', label: 'A' },
  { id: 'slim-curved', build: '偏瘦', shape: '曲线型', label: 'B' },
  { id: 'slim-pear', build: '偏瘦', shape: '梨型', label: 'C' },
  { id: 'standard-straight', build: '标准', shape: '直筒型', label: 'D' },
  { id: 'standard-curved', build: '标准', shape: '曲线型', label: 'E' },
  { id: 'standard-pear', build: '标准', shape: '梨型', label: 'F' },
  { id: 'full-straight', build: '丰满', shape: '直筒型', label: 'G' },
  { id: 'full-curved', build: '丰满', shape: '曲线型', label: 'H' },
  { id: 'full-pear', build: '丰满', shape: '梨型', label: 'I' },
];

export const stores = [
  { id: 'central', name: 'FORME · Central 店', distance: '当前门店' },
  { id: 'harbour', name: 'FORME · Harbour 店', distance: '2.4 km' },
  { id: 'westfield', name: 'FORME · Westfield 店', distance: '4.8 km' },
];
