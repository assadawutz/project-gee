import civicFeImg from "../assets/images/civic_fe_profile_1782248647242.jpg";
import revoImg from "../assets/images/revo_profile_1782248660310.jpg";
import dmaxImg from "../assets/images/dmax_profile_1782248674172.jpg";
import fortunerImg from "../assets/images/fortuner_profile_1782248748933.jpg";
import te37Img from "../assets/images/te37_bronze_1782248685607.jpg";
import rpf1Img from "../assets/images/rpf1_silver_1782248695150.jpg";
import ce28Img from "../assets/images/ce28_bronze_1782248706460.jpg";
import ps5Img from "../assets/images/ps5_tire_1782248718023.jpg";
import ko2Img from "../assets/images/ko2_tire_1782248731367.jpg";

import { Vehicle, Product } from "../types";

export const mockVehicles: Vehicle[] = [
  { id: "v_civic_fe", brand: "Honda", model: "Civic FE", year: "2022", subModel: "RS (1.5 Turbo)", pcd: "5x114.3", cb: "64.1", boltPattern: "M12x1.5", image: civicFeImg },
  { id: "v_civic_fk", brand: "Honda", model: "Civic FK", year: "2017", subModel: "Type R", pcd: "5x120", cb: "64.1", boltPattern: "M14x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_civic_fc", brand: "Honda", model: "Civic FC", year: "2019", subModel: "RS", pcd: "5x114.3", cb: "64.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_city_gn", brand: "Honda", model: "City GN", year: "2021", subModel: "RS", pcd: "4x100", cb: "56.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_hrv_rv", brand: "Honda", model: "HR-V RV", year: "2023", subModel: "e:HEV", pcd: "5x114.3", cb: "64.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_yaris_nsp152", brand: "Toyota", model: "Yaris", year: "2022", subModel: "NSP152", pcd: "4x100", cb: "54.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_altis_zwe211", brand: "Toyota", model: "Altis", year: "2021", subModel: "ZWE211", pcd: "5x100", cb: "54.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_gr86_zn8", brand: "Toyota", model: "GR86", year: "2023", subModel: "ZN8", pcd: "5x100", cb: "56.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_wrx_vb", brand: "Subaru", model: "WRX", year: "2023", subModel: "VB", pcd: "5x114.3", cb: "56.1", boltPattern: "M12x1.25", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_mazda3_bp", brand: "Mazda", model: "Mazda 3", year: "2022", subModel: "BP", pcd: "5x114.3", cb: "67.1", boltPattern: "M12x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_gtr_r35", brand: "Nissan", model: "GT-R", year: "2023", subModel: "R35", pcd: "5x114.3", cb: "66.1", boltPattern: "M12x1.25", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_almera_n18", brand: "Nissan", model: "Almera", year: "2022", subModel: "N18", pcd: "4x100", cb: "60.1", boltPattern: "M12x1.25", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_m2_g87", brand: "BMW", model: "M2", year: "2023", subModel: "G87", pcd: "5x112", cb: "66.6", boltPattern: "M14x1.25", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_mustang_s650", brand: "Ford", model: "Mustang", year: "2024", subModel: "S650", pcd: "5x114.3", cb: "70.5", boltPattern: "M14x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
  { id: "v_golfr_mk8", brand: "VW", model: "Golf R", year: "2023", subModel: "MK8", pcd: "5x112", cb: "57.1", boltPattern: "M14x1.5", image: "https://images.unsplash.com/photo-1628157588553-9ee700a10346?w=800" },
];

export const mockProducts: Product[] = [
  // Wheels
  { id: "w_te37_saga", name: "Volk Racing TE37 Saga S-Plus", type: "wheel", brand: "Rays Engineering", price: 32500, stock: 12, image: te37Img, description: "ล้อฟอร์จแท้จากญี่ปุ่น (Made in Japan) น้ำหนักเบาเป็นพิเศษ", size: 18, width: 9.5, offset: 38, pcdCompat: ["5x114.3", "5x120"], cbCompat: 73.1, color: "Bronze", weight: 8.4 },
  { id: "w_ce28_sl", name: "Volk Racing CE28 SL", type: "wheel", brand: "Rays Engineering", price: 34500, stock: 8, image: ce28Img, description: "ล้อฟอร์จ 10 ก้านที่เบาที่สุดรุ่นหนึ่งจาก Rays", size: 18, width: 8.5, offset: 44, pcdCompat: ["5x114.3", "5x112"], cbCompat: 73.1, color: "Bronze", weight: 7.9 },
  { id: "w_ze40_ta", name: "Volk Racing ZE40 Time Attack", type: "wheel", brand: "Rays Engineering", price: 36000, stock: 6, image: ce28Img, description: "ดีไซน์ที่เน้นความแข็งแกร่งสูงสุด สี Time Attack", size: 18, width: 9.0, offset: 35, pcdCompat: ["5x114.3"], cbCompat: 73.1, color: "Black/Red", weight: 8.2 },
  { id: "w_rpf1", name: "Enkei RPF1 Racing Series", type: "wheel", brand: "Enkei", price: 11500, stock: 24, image: rpf1Img, description: "ล้อแม็กน้ำหนักเบาด้วยเทคโนโลยี MAT Technology", size: 18, width: 8.5, offset: 30, pcdCompat: ["5x114.3", "5x112"], cbCompat: 73.1, color: "Silver", weight: 8.1 },
  { id: "w_nt03", name: "Enkei NT03+M", type: "wheel", brand: "Enkei", price: 12500, stock: 16, image: rpf1Img, description: "ล้อลายขอบเสริมความแข็งแรง สไตล์ตัวแข่ง Circuit", size: 18, width: 9.0, offset: 35, pcdCompat: ["5x114.3"], cbCompat: 73.1, color: "Silver", weight: 8.5 },
  // Tires
  { id: "t_michelin_ps5", name: "Michelin Pilot Sport 5", type: "tire", brand: "Michelin", price: 6800, stock: 24, image: ps5Img, description: "ยางสปอร์ตเจเนอเรชันที่ 5 มอบความคุมค่า", tireWidth: 225, tireAspect: 45, tireSizeCompat: 18, speedRating: "Y", compound: "Dynamic Response" },
  { id: "t_michelin_ps4s", name: "Michelin Pilot Sport 4S", type: "tire", brand: "Michelin", price: 8500, stock: 18, image: ps5Img, description: "ยางสมรรถนะสูงระดับ Ultimate สำหรับรถสปอร์ต", tireWidth: 245, tireAspect: 40, tireSizeCompat: 18, speedRating: "Y", compound: "Bi-Compound" },
  { id: "t_bridgestone_re004", name: "Bridgestone Potenza Adrenalin RE004", type: "tire", brand: "Bridgestone", price: 5400, stock: 32, image: ps5Img, description: "ยางสปอร์ตที่ตอบสนองการควบคุมได้อย่างฉับไว", tireWidth: 225, tireAspect: 40, tireSizeCompat: 18, speedRating: "W", compound: "Triple-S Compound" },
  { id: "t_yoko_ad09", name: "Yokohama ADVAN Neova AD09", type: "tire", brand: "YOKOHAMA", price: 9800, stock: 16, image: ps5Img, description: "ที่สุดของยาง Street Sport สำหรับสนามแข่ง", tireWidth: 245, tireAspect: 35, tireSizeCompat: 18, speedRating: "W", compound: "MS Compound 2R" },
];

export const mockSlots = [
  "09:00 - 10:30",
  "10:30 - 12:00",
  "13:00 - 14:30",
  "14:30 - 16:00",
  "16:00 - 17:30",
  "17:30 - 19:00",
];

export const mockServices = [
  {
    name: "4-Wheel Mounting & Static Balancing (ติดตั้ง+ถ่วงล้อ 4 วง)",
    price: 1200,
  },
  { name: "3D Laser Wheel Alignment (ตั้งศูนย์ล้อ 3 มิติ)", price: 800 },
  {
    name: "Suspension Tune & Brake Service (ติดตั้งโช๊คอัพ/ผ้าเบรก)",
    price: 1000,
  },
  { name: "Engine Oil Change (เปลี่ยนถ่ายน้ำมันเครื่อง)", price: 500 },
  {
    name: "Exhaust & UnderGuard Install (ติดตั้งท่อไอเสีย/แผ่นใต้เครื่อง)",
    price: 800,
  },
];
