export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  subModel: string;
  pcd: string;      // Pitch Circle Diameter (e.g., 5x114.3)
  cb: string;       // Center Bore (e.g., 67.1)
  boltPattern: string;
  image: string;    // Silhouette / side-view vehicle image for Fitment Simulation
}

export type ProductType = 'wheel' | 'tire';

export interface Product {
  id: string;
  name: string;
  type: ProductType;
  brand: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  
  // Specific to Wheels
  size?: number;       // e.g., 18 (in inches)
  width?: number;      // e.g., 8.5 (in inches)
  offset?: number;     // e.g., 35 (in mm)
  pcdCompat?: string[]; // PCD patterns supported, e.g., ["5x114.3", "5x120"]
  cbCompat?: number;    // Center bore supported, e.g., 73.1
  color?: string;       // e.g., Gloss Black, Dark Bronze, Formula Silver
  weight?: number;      // e.g., 8.2 (in kg)
  
  // Specific to Tyres
  tireWidth?: number;  // e.g., 225
  tireAspect?: number; // e.g., 40
  tireSizeCompat?: number; // Inner diameter matching the wheel size (e.g. 18)
  speedRating?: string; // e.g., W, Y
  compound?: string;    // e.g., R-Compound, Sports Ultra High Performance
}

export interface Compatibility {
  id: string;
  vehicleId: string;
  productId: string;
  fitmentNotes?: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: string;
  date: string;
  timeSlot: string;
  servicesSelected: string[];
  totalPrice: number;
  status: 'Pending' | 'Confirmed' | 'Completed';
}

export interface OrderItem {
  product: Product;
  quantity: number;
  bundleDiscountApplied?: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  paymentStatus: 'Paid' | 'Unpaid';
  createdAt: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}
