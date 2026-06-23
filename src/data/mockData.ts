import { Vehicle, Product } from '../types';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v_civic_fl5',
    brand: 'Honda',
    model: 'Civic Type R',
    year: '2023',
    subModel: 'FL5 (2.0 Turbo VTEC)',
    pcd: '5x120',
    cb: '64.1',
    boltPattern: 'M14x1.5',
    image: '/src/assets/images/civic_fl5_profile_1782224461816.jpg' // High fidelity profile rendering of FL5 Type R
  },
  {
    id: 'v_gr_yaris',
    brand: 'Toyota',
    model: 'GR Yaris',
    year: '2021',
    subModel: 'GXPA16 (1.6 Turbo 4WD)',
    pcd: '5x114.3',
    cb: '60.1',
    boltPattern: 'M12x1.5',
    image: '/src/assets/images/yaris_profile_1782224738710.jpg'
  },
  {
    id: 'v_re_amemiya_rx7',
    brand: 'Mazda',
    model: 'RX-7',
    year: '1999',
    subModel: 'FD3S Series 8 (Rotary Twin-Turbo)',
    pcd: '5x114.3',
    cb: '67.1',
    boltPattern: 'M12x1.25',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNwb3J0cyUyMGNhcnxlbnwwfHwwfHx8MA%3D%3D'
  },
  {
    id: 'v_m3_g80',
    brand: 'BMW',
    model: 'M3 Coupe / Sedan',
    year: '2022',
    subModel: 'G80 / G82 Competition',
    pcd: '5x112',
    cb: '66.6',
    boltPattern: 'M14x1.25',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJtdyUyMG0zfGVufDB8fDB8fHww'
  },
  {
    id: 'v_sti_va',
    brand: 'Subaru',
    model: 'WRX STI',
    year: '2020',
    subModel: 'VAB EJ20 Final Edition',
    pcd: '5x114.3',
    cb: '56.1',
    boltPattern: 'M12x1.25',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHN1YmFydXxlbnwwfHwwfHx8MA%3D%3D'
  }
];

export const mockProducts: Product[] = [
  // Wheels (ล้อแม็ก)
  {
    id: 'w_te37_saga',
    name: 'Volk Racing TE37 Saga S-Plus',
    type: 'wheel',
    brand: 'Rays Engineering',
    price: 32000, // Price in THB per wheel
    stock: 12,
    image: '/src/assets/images/te37_bronze_wheel_1782224387236.jpg',
    description: 'The legendary forged 6-spoke racing wheel. Unmatched strength, lightweight performance, and traditional racing aesthetics.',
    size: 18,
    width: 9.5,
    offset: 38,
    pcdCompat: ['5x114.3', '5x120'],
    cbCompat: 73.1,
    color: 'Bronze (Almite)',
    weight: 8.4
  },
  {
    id: 'w_ce28n',
    name: 'Volk Racing CE28N Club Racer II',
    type: 'wheel',
    brand: 'Rays Engineering',
    price: 34000,
    stock: 8,
    image: '/src/assets/images/ce28_gunmetal_1782224752661.jpg',
    description: 'The lightest wheel in Rays stable. 10-spoke design optimized for high brake clearance and supreme weight reduction.',
    size: 18,
    width: 8.5,
    offset: 44,
    pcdCompat: ['5x114.3', '5x112', '5x120'],
    cbCompat: 73.1,
    color: 'Diamond Dark Gunmetal',
    weight: 7.9
  },
  {
    id: 'w_tc105x',
    name: 'WedsSport TC105X Premium',
    type: 'wheel',
    brand: 'Weds',
    price: 19500,
    stock: 16,
    image: '/src/assets/images/tc105x_wheel_1782224770041.jpg',
    description: 'Japanese Super GT racing technology. Dynamic N-Frame spoke reinforcement brings superior rigidness.',
    size: 18,
    width: 9.0,
    offset: 35,
    pcdCompat: ['5x114.3', '5x112'],
    cbCompat: 73.1,
    color: 'EJ-Bronze',
    weight: 7.8
  },
  {
    id: 'w_rpf1',
    name: 'Enkei RPF1 Racing Series',
    type: 'wheel',
    brand: 'Enkei',
    price: 12500,
    stock: 24,
    image: '/src/assets/images/rpf1_silver_wheel_1782224406269.jpg',
    description: 'Formula 1 replica design. MAT technology ensures high density aluminum properties comparable to forged wheels.',
    size: 18,
    width: 8.5,
    offset: 30,
    pcdCompat: ['5x114.3', '5x112'],
    cbCompat: 73.1,
    color: 'F1 Silver',
    weight: 8.1
  },
  {
    id: 'w_lm_bbs',
    name: 'BBS LM 2-Piece Die-Forged',
    type: 'wheel',
    brand: 'BBS Germany',
    price: 48000,
    stock: 4,
    image: '/src/assets/images/bbs_lm_gold_1782224424577.jpg',
    description: 'The ultimate luxury motorsport mesh design. 2-piece forged structure, diamond cut rim lip.',
    size: 19,
    width: 9.5,
    offset: 32,
    pcdCompat: ['5x112', '5x120'],
    cbCompat: 82.0,
    color: 'Gold Face with Machined Lip',
    weight: 10.2
  },

  // Tires (ยางรถยนต์)
  {
    id: 't_cup2',
    name: 'Michelin Pilot Sport Cup 2',
    type: 'tire',
    brand: 'Michelin',
    price: 11500,
    stock: 20,
    image: '/src/assets/images/michelin_cup2_tire_1782224444654.jpg',
    description: 'Track-ready street legal sports tire. Bi-Compound technology provides blistering lap times and unmatched dry cornering.',
    tireWidth: 235,
    tireAspect: 40,
    tireSizeCompat: 18,
    speedRating: 'Y',
    compound: 'Track & Street Extreme Sport'
  },
  {
    id: 't_ad09',
    name: 'Yokohama ADVAN Neova AD09',
    type: 'tire',
    brand: 'Yokohama',
    price: 9500,
    stock: 16,
    image: '/src/assets/images/yokohama_ad09_1782224786362.jpg',
    description: 'Supreme street sport tire. Features asymmetric tread patterns and dynamic carbon compound for maximum drift control and handling.',
    tireWidth: 245,
    tireAspect: 35,
    tireSizeCompat: 18,
    speedRating: 'W',
    compound: 'MS High-Grip Compound'
  },
  {
    id: 't_r888r',
    name: 'Toyo Proxes R888R Semi-Slick',
    type: 'tire',
    brand: 'Toyo Tires',
    price: 8800,
    stock: 12,
    image: '/src/assets/images/toyo_r888r_1782224803584.jpg',
    description: 'Competition radial semi-slick. Ideal for track days, autocross, and extreme performance car modifications.',
    tireWidth: 255,
    tireAspect: 35,
    tireSizeCompat: 18,
    speedRating: 'W',
    compound: 'GG-Compound Semi-Slick'
  },
  {
    id: 't_michelin_ps4s',
    name: 'Michelin Pilot Sport 4S',
    type: 'tire',
    brand: 'Michelin',
    price: 8200,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=60',
    description: 'The golden standard of ultra-high-performance tires. Superb wet braking, quiet cruising, and superb longevity.',
    tireWidth: 225,
    tireAspect: 40,
    tireSizeCompat: 18,
    speedRating: 'Y',
    compound: 'UHP Street & Dry/Wet compound'
  },
  {
    id: 't_re71rs',
    name: 'Bridgestone Potenza RE-71RS',
    type: 'tire',
    brand: 'Bridgestone',
    price: 10400,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=400&auto=format&fit=crop&q=60',
    description: 'Refined track performance. Bridgestone premier racing model engineered for immediate heating and extreme traction limits.',
    tireWidth: 265,
    tireAspect: 35,
    tireSizeCompat: 19,
    speedRating: 'Y',
    compound: 'Extreme Grip Compound'
  }
];

export const mockSlots = [
  '09:00 - 10:30',
  '10:30 - 12:00',
  '13:00 - 14:30',
  '14:30 - 16:00',
  '16:00 - 17:30',
  '17:30 - 19:00'
];

export const mockServices = [
  { name: '4-Wheel Mounting & Static Balancing (ติดตั้ง+ถ่วงล้อ 4 วง)', price: 1200 },
  { name: '3D Laser Wheel Alignment (ตั้งศูนย์ล้อ 3 มิติ)', price: 800 },
  { name: 'Brembo Track Setup Brake Check (ทดสอบกำลังเบรกสนาม)', price: 600 },
  { name: 'Extreme Chamber Suspension Tune (ปรับมุมแคมเบอร์ขาซิ่ง)', price: 1500 },
  { name: 'Gee Nitrogen Tyre Inflation (เติมลมยางไนโตรเจนสูตรพิเศษ)', price: 200 }
];
