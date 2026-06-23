import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { mockVehicles, mockProducts, mockSlots } from "./src/data/mockData";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database State for Real-Time Interaction
let productsState = [...mockProducts];
let bookingsState: any[] = [
  {
    id: "booking_1",
    customerName: "K. Somchai (น้าชาย ลายเสือ)",
    customerPhone: "081-234-5678",
    vehicleInfo: "Honda Civic Type R [2023 - FL5]",
    date: "2026-06-25",
    timeSlot: "10:30 - 12:00",
    servicesSelected: ["4-Wheel Mounting & Static Balancing (ติดตั้ง+ถ่วงล้อ 4 วง)", "3D Laser Wheel Alignment (ตั้งศูนย์ล้อ 3 มิติ)"],
    totalPrice: 2000,
    status: "Confirmed"
  },
  {
    id: "booking_2",
    customerName: "K. Jirayu (เปรี้ยว ล้อหวาน)",
    customerPhone: "089-987-6543",
    vehicleInfo: "Toyota GR Yaris [2021 - GXPA16]",
    date: "2026-06-26",
    timeSlot: "14:30 - 16:00",
    servicesSelected: ["Extreme Chamber Suspension Tune (ปรับมุมแคมเบอร์ขาซิ่ง)"],
    totalPrice: 1500,
    status: "Pending"
  }
];

let ordersState: any[] = [
  {
    id: "order_1001",
    customerName: "K. Wittaya",
    customerPhone: "085-555-5555",
    items: [
      {
        product: productsState[0], // TE37 Saga
        quantity: 4,
        bundleDiscountApplied: 5000
      },
      {
        product: productsState[5], // Cup 2
        quantity: 4,
        bundleDiscountApplied: 2000
      }
    ],
    totalAmount: 167000,
    paymentStatus: "Paid",
    createdAt: new Date().toISOString()
  }
];

// User interaction / conversion stats
let clickAnalytics = {
  fitmentSearches: 42,
  virtualTries: 89,
  bundleBuilds: 24,
  stripeCheckoutClicks: 11,
  aiChats: 35
};

// Lazy initialization of Gemini client
let aiClient: any = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// ---------------------- API ROUTES ----------------------

// Fetch Vehicles
app.get("/api/vehicles", (req, res) => {
  res.json(mockVehicles);
});

// Fetch/Manage Products
app.get("/api/products", (req, res) => {
  res.json(productsState);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  const idx = productsState.findIndex(p => p.id === id);
  if (idx !== -1) {
    productsState[idx] = { ...productsState[idx], ...updatedData };
    res.json({ success: true, product: productsState[idx] });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Fetch/Create Bookings
app.get("/api/bookings", (req, res) => {
  res.json(bookingsState);
});

app.post("/api/bookings", (req, res) => {
  const { customerName, customerPhone, vehicleInfo, date, timeSlot, servicesSelected, totalPrice } = req.body;
  
  if (!customerName || !customerPhone || !date || !timeSlot) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const newBooking = {
    id: `booking_${Date.now()}`,
    customerName,
    customerPhone,
    vehicleInfo,
    date,
    timeSlot,
    servicesSelected: servicesSelected || [],
    totalPrice: totalPrice || 0,
    status: "Pending"
  };

  bookingsState.unshift(newBooking);
  res.json({ success: true, booking: newBooking });
});

app.patch("/api/bookings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const idx = bookingsState.findIndex(b => b.id === id);
  if (idx !== -1) {
    bookingsState[idx].status = status;
    res.json({ success: true, booking: bookingsState[idx] });
  } else {
    res.status(404).json({ error: "Booking session not found" });
  }
});

// Create Order (Simulated Stripe & Coupon Engine)
app.get("/api/orders", (req, res) => {
  res.json(ordersState);
});

app.post("/api/orders", (req, res) => {
  const { customerName, customerPhone, items, totalAmount, paymentStatus } = req.body;

  if (!customerName || !customerPhone || !items) {
    return res.status(400).json({ error: "Invalid order schema" });
  }

  // Deduct stock levels in local state
  items.forEach((item: any) => {
    const prodIdx = productsState.findIndex(p => p.id === item.product.id);
    if (prodIdx !== -1) {
      productsState[prodIdx].stock = Math.max(0, productsState[prodIdx].stock - item.quantity);
    }
  });

  const newOrder = {
    id: `order_${1000 + ordersState.length + 1}`,
    customerName,
    customerPhone,
    items,
    totalAmount,
    paymentStatus: paymentStatus || "Paid",
    createdAt: new Date().toISOString()
  };

  ordersState.unshift(newOrder);
  res.json({ success: true, order: newOrder });
});

// Analytics click recorder
app.post("/api/analytics/track", (req, res) => {
  const { event } = req.body;
  if (event && event in clickAnalytics) {
    (clickAnalytics as any)[event]++;
  }
  res.json(clickAnalytics);
});

app.get("/api/analytics", (req, res) => {
  res.json({
    metrics: clickAnalytics,
    ordersCount: ordersState.length,
    bookingCount: bookingsState.length,
    revenue: ordersState.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.totalAmount : 0), 0)
  });
});

// Gemini Live Chat Assistant Suggestions Engine
app.post("/api/chat", async (req, res) => {
  const { prompt, history } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const client = getGeminiClient();
    if (!client) {
      // Elegant, high-fidelity fallback response when GEMINI_API_KEY is not configured
      const localAdvice = generateSmartFitmentAdvice(prompt);
      return res.json({ text: localAdvice, mode: "Local Intelligent Rules Engine" });
    }

    const systemPrompt = `You are "จีจี้ ล้อซิ่ง (Gee Lil-Racing AI)", an expert in track setup, camber configurations, offset parameters, PCD matching, and high-performance sport wheels and tires.
We sell legendary JDM wheels (TE37, CE28, TC105X, Enkei RPF1, BBS LM) and premium sports tires.
Keep your tone extremely exciting, professional, knowledgeable about racing fitment, drift, and street performance.
Answer in Thai with technical English terms (e.g., Offset, Face, Chamber, Alignment, Forged, PCD, Fitment).
Give specific tire width and wheel width suggestions whenever a user asks about fitment.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text, mode: "Gee Gemini AI v3.5-Flash" });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.json({
      text: `ขออภัยครับ จีจี้ AI บริการขัดข้องชั่วคราว ดมกลิ่นท่อไอเสียเพลินไปหน่อย! แต่ตามสเปกทั่วไปแล้ว หากถามเกี่ยวกับ JDM Fitment:
1. ล้อดยอดฮิต TE37 ขอบ 18 กว้าง 9.5 Offset +38 PCD 5x114.3 คลาสสิกสุดในตาราง JDM!
2. ล้อ Enkei RPF1 กว้าง 8.5/9.0 ออฟเซ็ต +30 จะให้หน้าฟิตพอดีซุ้มล้อแบบดุดัน ไม่ติดโช้คครับ.
(Error Detail: ${err.message})`,
      mode: "Fallback Rules Engine"
    });
  }
});

// Local intelligent rules helper for offline fallback or sandbox builds
function generateSmartFitmentAdvice(userInput: string): string {
  const input = userInput.toLowerCase();
  if (input.includes("te37") || input.includes("volk")) {
    return `สวัสดีครับพี่! "Volk Racing TE37" คือที่สุดแห่งล้อฟอร์จยอดฮิตตลอดกาล สติกเกอร์แดงก้านยิงทราย! 
- แนะนำสำหรับ JDM ทั่วไป: 18x9.5 ET+38 PCD 5x114.3 คู่กับยาง 245/40R18 หรือ 255/35R18 (Michelin Pilot Sport 4S) ได้หล่อแบบพอดีซุ้ม ไม่ขูดโช้ค ไม่ติดบังโคลนแน่นอนครับ
- สำหรับ Civic Type R FL5: สเปกตรงเบอร์ต้องเป็นเทคโนโลยี 5x120 เท่านั้นครับ! สเปก 18x9.5 ET+45 หล่อกระชับพวงมาลัยซิ่งคมมากครับพี่!`;
  }
  if (input.includes("alignment") || input.includes("ตั้งศูนย์") || input.includes("แคมเบอร์") || input.includes("camber")) {
    return `สำหรับฟิตเมนต์ซิ่งแทร็คและสายดริฟต์ การตั้งแคมเบอร์หน้า-หลัง (Camber Alignment) สำคัญมากครับพี่!
- สาย Street ซิ่งทั่วไป: แคมเบอร์หน้า -1.5 ถึง -2.0 ดีกรี, หลัง -1.2 ถึง -1.5 ดีกรี ช่วยให้เข้าโค้งหนึบ โดยหน้ายางด้านในไม่สึกไวจนเกินไป
- สาย Track Day / Circuit: แคมเบอร์หน้า -2.5 ถึง -3.2 ดีกรี จะเกาะโค้งเหนียวแน่นปึ้ก เข้าโค้ง S-Curve ไม่มีหน้าดื้อครับ!`;
  }
  if (input.includes("ยาง") || input.includes("tire") || input.includes("ad09") || input.includes("cup2")) {
    return `ยางประสิทธิภาพสูงทางร้ายจีจี้ที่แนะนำสำหรับล้อหน้า 9.5 นิ้ว:
1. Michelin Pilot Sport Cup 2 (Semi-Slick): ตัวจบวิ่งสนาม พัฒนาคู่วันแทร็ค หนึบจับใจ คุมแก้มยางเยี่ยมยอด!
2. Yokohama Advan AD09: ยางซิ่งกึ่งสปอร์ตลายเทพ เสียงทุ้มทนทาน เหมาะสำหรับสายหล่อขับถนนและสปินเบิร์นรอยัลครับพี่!`;
  }
  return `ยินดีต้อนรับสู่ จีจี้ ล้อซิ่ง (Gee Official Setup Hub) ครับพี่! 
เรามีชุดล้อฟอร์จน้ำหนักเบาสเปกแท้ สำหรับใส่ซิ่ง วิ่งสนาม ตลอดจนยางระดับพรีเมียม!
พี่อยากได้คำแนะนำฟิตเมนต์เบื้องต้นสำหรับรถรุ่นไหนเป็นพิเศษไหมครับ? แจ้งแบรนด์ รุ่น และขนาดล้อที่สนใจได้เลยครับ จีจี้จัดให้ตรงเบอร์แน่นอน!`;
}

// ---------------------- LEAF MIDDLWARE ----------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Gee Server] Running high-octane setup on http://localhost:${PORT}`);
  });
}

startServer();
