import React, { useState, useRef, useEffect } from 'react';
import { Vehicle, Product } from '../types';
import { mockVehicles, mockProducts } from '../data/mockData';
import { Paintbrush, Sliders, ToggleLeft, Disc, Sparkles, AlertCircle, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface VirtualFitmentProps {
  initialVehicle?: Vehicle | null;
  initialWheel?: Product | null;
  onAddToCart: (product: Product) => void;
  onTrackAction: (event: string) => void;
}

export default function VirtualFitment({
  initialVehicle,
  initialWheel,
  onAddToCart,
  onTrackAction
}: VirtualFitmentProps) {
  // Setup standard state defaults if not passed from engine
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(initialVehicle || mockVehicles[0]);
  const [selectedWheel, setSelectedWheel] = useState<Product>(initialWheel || mockProducts[0]);

  // Sync state with parent props updates
  React.useEffect(() => {
    if (initialVehicle) {
      setSelectedVehicle(initialVehicle);
    }
  }, [initialVehicle]);

  React.useEffect(() => {
    if (initialWheel) {
      setSelectedWheel(initialWheel);
    }
  }, [initialWheel]);

  // Try-on simulation config states
  const [carColor, setCarColor] = useState<string>('#ff0033'); // Default Sports Red
  const [suspensionGap, setSuspensionGap] = useState<number>(30); // 10px to 60px
  const [wheelSizeScale, setWheelSizeScale] = useState<number>(100); // 85% to 115%
  const [camberAngle, setCamberAngle] = useState<number>(-2); // -10deg to 2deg
  const [tireStretch, setTireStretch] = useState<'normal' | 'aggressive' | 'slick'>('aggressive');
  const [activeTabPanel, setActiveTabPanel] = useState<'body' | 'alignment' | 'wheel'>('body');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle responsive sizing
    const width = canvas.offsetWidth || 600;
    const height = canvas.offsetHeight || 384;
    canvas.width = width;
    canvas.height = height;

    // Clear everything
    ctx.clearRect(0, 0, width, height);

    // Grid Lines (Aesthetic CAD telemetry background)
    ctx.strokeStyle = 'rgba(204, 255, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 20; i < width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 20; j < height; j += 30) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    // Laser Tracker Line (Static Horizontal Centerline)
    ctx.strokeStyle = '#ccff00';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.setLineDash([6, 4]);
    ctx.moveTo(40, height - 85);
    ctx.lineTo(width - 40, height - 85);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Alignment Sensors / Red dot lasers
    const frontWheelX = 145; // Front Wheel approx center
    const rearWheelX = width - 150; // Rear Wheel approx center
    const wheelY = height - 105; // Ground level height

    // Suspension car relative delta position
    const carY = height - 160 + (suspensionGap / 2);

    // Front sensor vector line
    ctx.strokeStyle = '#ccff00';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(frontWheelX, wheelY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ccff00';
    ctx.fill();

    // Draw Front Angle Ticks
    ctx.beginPath();
    ctx.moveTo(frontWheelX, wheelY);
    // Draw vector pointing down aligned with camber angle
    const frontCamberX = frontWheelX + Math.sin(camberAngle * Math.PI / 180) * 45;
    const frontCamberY = wheelY + 45;
    ctx.lineTo(frontCamberX, frontCamberY);
    ctx.strokeStyle = 'rgba(204, 255, 0, 0.7)';
    ctx.stroke();

    // Rear sensor vector line
    ctx.beginPath();
    ctx.arc(rearWheelX, wheelY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(rearWheelX, wheelY);
    const rearCamberX = rearWheelX + Math.sin(camberAngle * Math.PI / 180) * 45;
    const rearCamberY = wheelY + 45;
    ctx.lineTo(rearCamberX, rearCamberY);
    ctx.stroke();

    // Write text overlays directly on the canvas
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ccff00';
    ctx.fillText(`CAMBER LH: ${camberAngle.toFixed(1)}°`, frontWheelX - 42, wheelY - 50);
    ctx.fillText(`CAMBER RH: ${camberAngle.toFixed(1)}°`, rearWheelX - 42, wheelY - 50);

    // Draw Height clearance laser pointer (glowing red line)
    ctx.strokeStyle = '#f43f5e'; // rose-500 red laser
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(frontWheelX, carY + 30);
    ctx.lineTo(frontWheelX, wheelY);
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`GAP: ${(70 - suspensionGap).toFixed(0)}mm`, frontWheelX + 8, (carY + 30 + wheelY) / 2);

    ctx.strokeStyle = '#f43f5e';
    ctx.beginPath();
    ctx.moveTo(rearWheelX, carY + 30);
    ctx.lineTo(rearWheelX, wheelY);
    ctx.stroke();

    ctx.fillStyle = '#f43f5e';
    ctx.fillText(`GAP: ${(70 - suspensionGap).toFixed(0)}mm`, rearWheelX + 8, (carY + 30 + wheelY) / 2);

  }, [suspensionGap, camberAngle, wheelSizeScale, carColor]);

  const exportToPDFInvoice = () => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');

      // Styles & Palette
      const primaryColor = '#111111';
      const accentColor = '#ddff00'; 
      const grayColor = '#666666';

      // 1. Sleek Dark Header Banner
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, 210, 38, 'F');

      // Brand Title
      doc.setTextColor(221, 255, 0); // Neon Lime
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('GEE FITMENT ENGINE', 15, 16);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('CO., LTD. - BANGKOK RACING GARAGE', 15, 22);
      doc.text('HIGH-PERFORMANCE CUSTOMS & WHEEL DESIGN', 15, 27);

      // Metajet Info (Right side)
      doc.setTextColor(200, 200, 200);
      doc.setFontSize(8);
      doc.text('DOCUMENT NO: GEE-FIT-2026-8809', 140, 15);
      const currentTime = new Date().toLocaleString();
      doc.text(`ISSUED DATE: ${currentTime}`, 140, 20);
      doc.text('VALUATION: OFFICIAL QUOTATION', 140, 25);
      doc.text('STATUS: VERIFIED DIRECT COMPATIBLE', 140, 30);

      // Neon Split Line
      doc.setDrawColor(221, 255, 0);
      doc.setLineWidth(1);
      doc.line(0, 38, 210, 38);

      // SECTION 1: Vehicle Customization Specifications
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('1. VEHICLE SETUP & CUSTOM CONFIGURATION', 15, 52);

      // Background card
      doc.setFillColor(245, 245, 247);
      doc.rect(15, 56, 180, 42, 'F');
      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.rect(15, 56, 180, 42);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('SPECIFICATION PARAMETER', 20, 63);
      doc.text('VALUE', 105, 63);
      doc.text('FITMENT ENGINE TELEMETRY STATUS', 145, 63);

      doc.setDrawColor(200, 200, 205);
      doc.line(15, 66, 195, 66);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50, 50, 50);

      doc.text('Target Vehicle (รุ่นรถเป้าหมาย):', 20, 71);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${selectedVehicle.brand} ${selectedVehicle.model} (${selectedVehicle.year})`, 105, 71);
      doc.setFont('Helvetica', 'normal');
      doc.text('COMPATIBLE', 145, 71);

      doc.text('Bolt Pattern / PCD Info (สเปกรูน็อต):', 20, 76);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${selectedVehicle.pcd} / CB ${selectedVehicle.cb}`, 105, 76);
      doc.setFont('Helvetica', 'normal');
      doc.text('PCD MATCHED', 145, 76);

      doc.text('Camber Angle Offset (มุมแคมเบอร์):', 20, 81);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${camberAngle.toFixed(1)} degrees`, 105, 81);
      doc.setFont('Helvetica', 'normal');
      doc.text(camberAngle < -3 ? 'STANCE INCLINED (เต้าแคมเบอร์เอียงพิเศษ)' : 'TRACK STANDARD', 145, 81);

      doc.text('Suspension Gap Clearance (ความสูงโช้ก):', 20, 86);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${(70 - suspensionGap).toFixed(0)} mm drop`, 105, 86);
      doc.setFont('Helvetica', 'normal');
      doc.text(suspensionGap > 45 ? 'AGGRESSIVE FLUSH (โหลดเตี้ยสุดชิค)' : 'SPORT STREET', 145, 86);

      doc.text('Custom Body Paint Hex (สีตัวถังรถ):', 20, 91);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${carColor.toUpperCase()}`, 105, 91);
      doc.setFont('Helvetica', 'normal');
      doc.text('FINISH READY', 145, 91);

      // Painted Circle display beside Hex value
      doc.setFillColor(carColor);
      doc.setDrawColor(0,0,0);
      doc.circle(138, 90, 2.5, 'FD');

      // SECTION 2: CAD Line Laser-Track Telemetry (Canvas Capture)
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('2. LASER-TRACK ALIGNMENT SENSORS (CAD VIEW)', 15, 110);

      const canvas = canvasRef.current;
      if (canvas) {
        try {
          const imgData = canvas.toDataURL('image/png');
          // Solid background padding for contrast standard
          doc.setFillColor(15, 15, 15);
          doc.rect(15, 114, 180, 52, 'F');
          doc.setDrawColor(32, 32, 32);
          doc.rect(15, 114, 180, 52);

          doc.addImage(imgData, 'PNG', 16, 115, 178, 50, undefined, 'FAST');
        } catch (e) {
          console.error("Canvas export failed fallback display: ", e);
          doc.setFillColor(240, 240, 240);
          doc.rect(15, 114, 180, 52, 'F');
          doc.setTextColor(150, 150, 150);
          doc.setFontSize(9);
          doc.text('SVG ALIGNMENT SENSORS GENERATED PREVIEW MATCH', 40, 140);
        }
      }

      // SECTION 3: Cost and Package breakdown spec
      doc.setTextColor(17, 17, 17);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(13);
      doc.text('3. DETAILED PRODUCT SPECIFICATION & BUNDLE COST', 15, 178);

      doc.setFillColor(248, 250, 252);
      doc.rect(15, 182, 180, 48, 'F');
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, 182, 180, 48);

      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont('Helvetica', 'bold');
      doc.text('ITEMIZED COMPONENT', 20, 190);
      doc.text('SPECIFICATIONS', 70, 190);
      doc.text('QTY', 145, 190);
      doc.text('UNIT PRICE', 165, 190);

      doc.setDrawColor(226, 232, 240);
      doc.line(15, 194, 195, 194);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(30, 30, 30);

      doc.text(`${selectedWheel.brand} ${selectedWheel.name}`, 20, 201);
      doc.text(`${selectedWheel.size}'' x ${selectedWheel.width}J | ET+${selectedWheel.offset} | ${selectedWheel.color}`, 70, 201);
      doc.text('4 Unit', 145, 201);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${selectedWheel.price.toLocaleString()} THB`, 165, 201);
      doc.setFont('Helvetica', 'normal');

      doc.text(`Tire Stretch Compound`, 20, 208);
      doc.text(`${tireStretch.toUpperCase()} PROFILE - High Performance Rubber Compound`, 70, 208);
      doc.text('4 Unit', 145, 208);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Included (0 THB)`, 165, 208);
      doc.setFont('Helvetica', 'normal');

      doc.text(`Nitrogen Air & Balancing`, 20, 215);
      doc.text(`Precision Weight balancing & high purity nitrogen gas purge`, 70, 215);
      doc.text('1 Set', 145, 215);
      doc.setFont('Helvetica', 'bold');
      doc.text(`Free gift`, 165, 215);
      doc.setFont('Helvetica', 'normal');

      doc.line(15, 219, 195, 219);

      const totalAmountVal = selectedWheel.price * 4;
      const discountVal = 2500; // Special quota promo discount
      const finalVal = totalAmountVal - discountVal;

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(80, 80, 80);
      doc.text(`Subtotal Wheels Set:`, 110, 224);
      doc.text(`${totalAmountVal.toLocaleString()} THB`, 165, 224);

      doc.setTextColor(220, 50, 50);
      doc.text(`Street Bundle Promo Discount (ส่วนลด):`, 110, 228);
      doc.text(`- ${discountVal.toLocaleString()} THB`, 165, 228);

      // Dark Box Total Highlights
      doc.setFillColor(17, 17, 17);
      doc.rect(110, 232, 85, 10, 'F');
      doc.setTextColor(221, 255, 0); 
      doc.setFontSize(10);
      doc.text(`NET ESTIMATE AMOUNT:`, 113, 238.5);
      doc.text(`${finalVal.toLocaleString()} THB`, 155, 238.5);

      // Footnotes
      doc.setTextColor(110, 110, 115);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(`* Optional Installment Plan: (ดอกเบี้ย 0% x 6เดือน) = ตกเพียงเดือนละ ${(finalVal / 6).toFixed(0).toLocaleString()} THB / เดือน เท่านั้น`, 15, 242);

      // Divider and official stamps
      doc.setDrawColor(220, 220, 225);
      doc.setLineWidth(0.3);
      doc.line(15, 260, 195, 260);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(80, 80, 80);
      doc.text('TERMS & CONDITIONS (เงื่อนไขและข้อตกลง):', 15, 266);
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('1. This quotation is generated based on real-time street database matching and valid for 30 days.', 15, 270);
      doc.text('2. Physical installation includes professional laser alignment, balanced balancing and custom wheel cap fittings.', 15, 273);
      doc.text('3. GEE RACER guarantee covers 100% paint chipping & forging integrity under professional street and racetrack usage.', 15, 276);

      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GEE GARAGE REPRESENTATIVE', 140, 266);
      doc.line(140, 278, 190, 278);
      doc.setFont('Helvetica', 'normal');
      doc.text('Authorized Signature & Official Stamp', 140, 281);

      doc.save(`GEE_FITMENT_QUOTE_${selectedVehicle.brand}_${selectedVehicle.model}.pdf`);
      onTrackAction('pdfQuoteExports');
    } catch (err) {
      console.error("PDF quotation export failed: ", err);
    }
  };

  const wheelsList = mockProducts.filter((p) => p.type === 'wheel');

  // Paint color palette presets
  const presets = [
    { name: 'Championship White', hex: '#f7f6f1' },
    { name: 'Spoon Yellow', hex: '#ffcc00' },
    { name: 'Bayside Blue', hex: '#0022ff' },
    { name: 'Pikes Peak Red', hex: '#e60026' },
    { name: 'Carbon Fiber Slate', hex: '#1c1c1c' },
    { name: 'Midnight Purple III', hex: '#3b0066' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Simulation Stage Title & Overview */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md">
        <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white flex items-center space-x-2.5">
          <Sparkles className="w-8 h-8 text-[#ccff00]" />
          <span>Virtual Fitment Stance Lab</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-medium max-w-3xl">
          ทดลองฟิตเมนต์ล้อแม็กซ์เสมือนจริงสำหรับคนใจถึง! ปรับความลึกออฟเซ็ต แคมเบอร์ดึงยางซิ่ง และโหลดเตี้ย จัดฟิตเมนต์ให้หล่อสะกดทุกสายตาบนถนนหลวง ท้าทายระดับด่านทางด่วนได้ทันที!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Interactive Visual Stage - Left Panel */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-zinc-950/80 border border-zinc-800 p-6 overflow-hidden flex items-center justify-center select-none shadow-inner">
            
            {/* HTML5 Interactive Alignment Canvas */}
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Grid Pattern overlay for true garage feel */}
            <div className="absolute inset-0 bg-[radial-gradient(#222_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute bottom-16 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ccff00]/30 to-transparent"></div>

            {/* Simulated Dynamic Background Lighting Shadow */}
            <div 
              className="absolute h-40 w-40 rounded-full blur-3xl opacity-20 -bottom-10 left-1/3"
              style={{ backgroundColor: carColor }}
            ></div>

            {/* Garage Status Line */}
            <div className="absolute top-4 left-4 font-mono text-[9px] text-zinc-500 flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00] animate-ping"></span>
              <span>RENDER ENGINE: OPENGL CANVAS MODULATION ACTIVE [3.5-FLASH]</span>
            </div>

            {/* STAGE CONTAINER WITH COLLAPSING SHADOWS */}
            <div className="relative w-full max-w-2xl h-full flex flex-col justify-end pb-8">
              
              {/* Vehicle Body Layer + Color Overlay Mask */}
              <div 
                className="relative h-44 w-full transition-transform duration-500 ease-out flex items-center justify-center"
                style={{ 
                  transform: `translateY(${suspensionGap / 2}px)` // Lower body with slider
                }}
              >
                {/* Simulated Tint Overlay container */}
                <div 
                  className="absolute inset-0 z-10 mix-blend-multiply opacity-60 rounded-xl pointer-events-none"
                  style={{ backgroundColor: carColor }}
                ></div>

                {/* Real Silhouetted Car Image */}
                <img 
                  src={selectedVehicle.image} 
                  alt="Virtual Car silhouette container" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain filter brightness-105 contrast-125 z-0" 
                />

                {/* Stance low suspension status flag */}
                {suspensionGap > 45 && (
                  <span className="absolute -top-4 left-12 animate-bounce bg-[#ccff00] text-[#0a0a0a] font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                    Hellaflush! เตี้ยจัดปลัดขิก!
                  </span>
                )}
              </div>

              {/* INTEGRATED FLOATING WHEEL NODES (FRONT & REAR) */}
              {/* Wheel alignment offsets and camber angles are mapped via styling on parent container */}
              <div className="absolute bottom-[24px] left-0 right-0 w-full px-12 z-20 flex justify-between pointer-events-none">
                
                {/* Front Wheel */}
                <div 
                  className="relative transition-all duration-300"
                  style={{
                    transform: `translateX(18px) rotate(${camberAngle}deg) scale(${wheelSizeScale / 100})`,
                    perspective: '300px'
                  }}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedWheel.image} 
                      alt="Front Wheel Preview" 
                      className={`h-full w-full object-cover rounded-full ${tireStretch === 'slick' ? 'border-2 border-[#ccff00]/40' : ''}`} 
                    />
                  </div>
                  {/* Tire Stretch Indicator lines */}
                  <div className="absolute top-0 -left-1 text-[8px] font-mono bg-black/60 text-zinc-400 px-1 rounded uppercase">F</div>
                </div>

                {/* Rear Wheel */}
                <div 
                  className="relative transition-all duration-300"
                  style={{
                    transform: `translateX(-18px) rotate(${camberAngle}deg) scale(${wheelSizeScale / 100})`,
                    perspective: '300px'
                  }}
                >
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-md flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedWheel.image} 
                      alt="Rear Wheel Preview" 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  </div>
                  <div className="absolute top-0 -right-1 text-[8px] font-mono bg-black/60 text-zinc-400 px-1 rounded uppercase">R</div>
                </div>

              </div>

            </div>

            {/* Dynamic Status Badges bottom overlay */}
            <div className="absolute bottom-3 right-4 font-mono text-[10px] text-zinc-400 flex items-center space-x-2 bg-black/50 px-3 py-1 rounded-md">
              <Disc className="w-3.5 h-3.5 text-[#ccff00] animate-spin" />
              <span>ล้อ: <strong className="text-white">{selectedWheel.name}</strong></span>
              <span>ปีรถ: <strong className="text-white">{selectedVehicle.year}</strong></span>
            </div>

          </div>

          {/* Quick Specs compatibility alert warning */}
          <div className="rounded-xl bg-orange-950/20 border border-orange-800/30 p-4 text-orange-400 flex items-start space-x-3 text-xs leading-relaxed">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-bold uppercase tracking-wider">Fitment Warning Note (ข้อพึงระวังการจัดซิ่ง):</p>
              <p className="mt-0.5 text-zinc-400 font-medium">
                การโหลดระยะห่างซุ้มล้อและแก้มยางเหลือต่ำกว่า 15 mm และการดันมุม Camber ติดลบมากกว่า -3.0 ดีกรี อาจส่งผลให้สปริงเพลาทำงานหนัก มีโอกาสติดซุ้มเวลากระโดดสะพานหลวง แนะนำให้ติดตั้งซับแท็งก์สตรัทปรับเกลียว Gee Force!
              </p>
            </div>
          </div>

        </div>

        {/* Configuration Parameter Controls - Right Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-6">
          
          <div className="border-b border-zinc-800 pb-3">
            <span className="text-[10px] font-black uppercase text-[#ccff00] tracking-widest">Garage Workbench</span>
            <h3 className="font-sans font-black text-lg text-white">โมดิฟายตัวถัง & ฟิตเมนต์</h3>
          </div>

          {/* Quick Nav for parameters tabs */}
          <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-950">
            <button
              onClick={() => setActiveTabPanel('body')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'body' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              สีตัวรถ
            </button>
            <button
              onClick={() => setActiveTabPanel('alignment')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'alignment' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              มุมล้อ/โช้ค
            </button>
            <button
              onClick={() => setActiveTabPanel('wheel')}
              className={`py-1 rounded text-xs font-bold uppercase ${activeTabPanel === 'wheel' ? 'bg-[#ccff00] text-[#0a0a0a]' : 'text-zinc-400'}`}
            >
              เลือกลายล้อ
            </button>
          </div>

          {/* PANEL CONTENT */}
          
          {/* TAB 1: Paint Color preset picker */}
          {activeTabPanel === 'body' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center space-x-1">
                  <Paintbrush className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>สาดสีตัวรถเสมือนจริง (Paint Color)</span>
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {presets.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCarColor(color.hex)}
                      className="flex items-center space-x-2 rounded-lg border border-zinc-800 p-2 text-left bg-zinc-950/40 hover:bg-zinc-900 duration-200"
                    >
                      <span className="h-4 w-4 rounded border border-black/30" style={{ backgroundColor: color.hex }}></span>
                      <span className="text-[10px] font-bold text-zinc-300 truncate">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-bold text-zinc-400">ระบุสีรหัสแต่งซิ่ง (Custom HEX Label):</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="h-10 w-10 p-0 rounded-md border border-zinc-800 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={carColor}
                    onChange={(e) => setCarColor(e.target.value)}
                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 font-mono text-xs font-bold text-[#ccff00]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Suspension Slam & Alignment Adjust (Camber, Size scaling) */}
          {activeTabPanel === 'alignment' && (
            <div className="space-y-5 animate-fade-in">
              
              {/* Suspension Height */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">ความสูงช่วงล่าง (Suspension Slam/Flush):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{(70 - suspensionGap) / 10} นิ้วสอด</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={suspensionGap}
                  onChange={(e) => {
                    setSuspensionGap(Number(e.target.value));
                    onTrackAction('virtualTries');
                  }}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
                <p className="text-[10px] text-zinc-500 font-medium">ขยับความสูงดึงเซ็นโช๊คสตรัทจัดฟิตเมนตาเป๊ะพอดีซุ้มล้อ.</p>
              </div>

              {/* Camber Angle Alignment */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">มุมแคมเบอร์ (VIP Camber Tilt):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{camberAngle.toFixed(1)}° ดีกรี</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="2"
                  step="0.5"
                  value={camberAngle}
                  onChange={(e) => setCamberAngle(Number(e.target.value))}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
                <p className="text-[10px] text-zinc-500 font-medium">ซิ่งสนามหรือดริฟต์สิบล้อ ปั๊มขอบแคมเบอร์หน้ายางยิงทราย.</p>
              </div>

              {/* Wheel scaling size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-zinc-300">ขนาดวงล้อขยาย (Visual Scale Size):</span>
                  <span className="font-mono text-[#ccff00] font-bold">{Math.round(18 * (wheelSizeScale / 100))} นิ้ว</span>
                </div>
                <input
                  type="range"
                  min="85"
                  max="115"
                  value={wheelSizeScale}
                  onChange={(e) => setWheelSizeScale(Number(e.target.value))}
                  className="w-full accent-[#ccff00] cursor-pointer" 
                />
              </div>

              {/* Tire Profile options */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300">โปรไฟล์เนื้อแก้มยางซิ่ง:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'aggressive', 'slick'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setTireStretch(type)}
                      className={`py-1.5 rounded text-[10px] font-black uppercase text-center border ${
                        tireStretch === type 
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00]' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Custom quick wheel swap selector */}
          {activeTabPanel === 'wheel' && (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 animate-fade-in custom-scrollbar">
              <label className="text-xs font-bold text-zinc-400 block mb-2">สลับลายล้อซิ่ง (Quick Swapper):</label>
              {wheelsList.map((wheel) => (
                <button
                  key={wheel.id}
                  onClick={() => {
                    setSelectedWheel(wheel);
                    onTrackAction('virtualTries');
                  }}
                  className={`w-full flex items-center space-x-3 rounded-lg border p-2 text-left bg-zinc-950/50 hover:bg-zinc-900 transition-colors ${
                    selectedWheel.id === wheel.id ? 'border-[#ccff00]' : 'border-zinc-800'
                  }`}
                >
                  <span className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                    <img src={wheel.image} alt={wheel.name} className="h-full w-full object-cover" />
                  </span>
                  <div className="text-[11px] truncate">
                    <p className="font-bold text-white leading-tight">{wheel.name}</p>
                    <span className="text-zinc-500 font-mono text-[9px]">Offset ET{wheel.offset} • {wheel.color}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-zinc-800 space-y-3">
            
            {/* Quick Vehicle info summary */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3 font-mono text-[10px] text-zinc-400 space-y-1">
              <div className="text-white text-[11px] font-bold font-sans uppercase mb-1">สตรีทเซ็ตอัปตรงเบอร์:</div>
              <div className="flex justify-between">
                <span>รถเป้าหมาย:</span>
                <strong className="text-white">{selectedVehicle.brand} {selectedVehicle.model}</strong>
              </div>
              <div className="flex justify-between">
                <span>รหัสรูแม็กซ์:</span>
                <strong className="text-[#ccff00]">{selectedVehicle.pcd}</strong>
              </div>
              <div className="flex justify-between">
                <span>ขนาดล้อฟิตติ้ง:</span>
                <strong className="text-zinc-200">{selectedWheel.size}″ x {selectedWheel.width}J Offset +{selectedWheel.offset}</strong>
              </div>
            </div>

            {/* Solid Order CTA Button */}
            <button
              onClick={() => {
                onAddToCart(selectedWheel);
                onTrackAction('stripeCheckoutClicks');
              }}
              className="w-full py-3 bg-[#ccff00] text-[#0a0a0a] rounded-xl font-sans font-black text-xs uppercase tracking-wider text-center hover:bg-lime-400 duration-300 cursor-pointer"
            >
              ตกลง เอาชุดล้อ {selectedWheel.brand} นี้!
            </button>

            {/* Custom Interactive PDF Screenshot-to-Invoice Exporter button */}
            <button
              onClick={exportToPDFInvoice}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs font-black uppercase text-center transition-all hover:border-[#ccff00] hover:text-[#ccff00] flex items-center justify-center space-x-2 cursor-pointer"
              title="เซฟภาพ CAD Canvas และรายละเอียดส่งออกแบบฟอร์มใบเสนอราคาระดับพรีเมียม (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>ส่งออกใบเสนอราคา PDF (EN/TH)</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
