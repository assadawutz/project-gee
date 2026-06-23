import React, { useState, useEffect } from 'react';
import { mockSlots, mockServices } from '../data/mockData';
import { CalendarClock, ShieldCheck, User, Phone, CheckCircle2, ListFilter, Users, Loader2 } from 'lucide-react';
import { Booking } from '../types';

interface BookingCalendarProps {
  onAddBooking: (bookingData: {
    customerName: string;
    customerPhone: string;
    vehicleInfo: string;
    date: string;
    timeSlot: string;
    servicesSelected: string[];
    totalPrice: number;
    status: 'Pending';
  }) => Promise<boolean>;
  existingBookings: Booking[];
  onTrackAction: (event: string) => void;
  onShowToast?: (message: string, type?: 'success' | 'warn' | 'error' | 'info') => void;
}

export default function BookingCalendar({
  onAddBooking,
  existingBookings = [],
  onTrackAction,
  onShowToast
}: BookingCalendarProps) {
  // Wizard states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicle, setVehicle] = useState('Honda Civic Type R [FL5]');
  const [selectedDate, setSelectedDate] = useState('2026-06-25');
  const [selectedSlot, setSelectedSlot] = useState(mockSlots[1]); // default second slot
  const [selectedServices, setSelectedServices] = useState<string[]>([mockServices[0].name]); // default wheel balancing
  
  const [submitting, setSubmitting] = useState(false);
  const [successNote, setSuccessNote] = useState(false);

  // Compute live services total price
  const totalServicesPrice = selectedServices.reduce((sum, serviceName) => {
    const serviceObj = mockServices.find((s) => s.name === serviceName);
    return sum + (serviceObj ? serviceObj.price : 0);
  }, 0);

  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedDate || !selectedSlot) {
      if (onShowToast) {
        onShowToast("กรุณากรอกข้อมูลส่วนตัวเพื่อลงทะเบียนจองสิทธิ์ด้วยครับพี่!", "warn");
      }
      return;
    }

    setSubmitting(true);
    const ok = await onAddBooking({
      customerName: name,
      customerPhone: phone,
      vehicleInfo: vehicle,
      date: selectedDate,
      timeSlot: selectedSlot,
      servicesSelected: selectedServices,
      totalPrice: totalServicesPrice,
      status: 'Pending'
    });

    setSubmitting(false);
    if (ok) {
      setSuccessNote(true);
      onTrackAction('bookingCount');
      if (onShowToast) {
        onShowToast("ลงทะเบียนจองสิทธิ์เซ็ตอัปสำเร็จเรียบร้อยแล้วครับพี่!", "success");
      }
      // Reset form fields
      setName('');
      setPhone('');
      setTimeout(() => setSuccessNote(false), 6000);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Overview Card */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md">
        <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white flex items-center space-x-2.5">
          <CalendarClock className="w-8 h-8 text-[#ccff00]" />
          <span>Gee Real-Time Booking Terminal</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-medium">
          จองคิวเข้ารับการติดตั้ง ปรับแต่ง และตั้งศูนย์ล้อ 3 มิติหน้าอู่จีจี้ล้อซิ่ง เลือกรอบตรงใจ คิวงานรวดเร็ว ไม่ต้องยืนรอนานให้เมื่อยตุ้ม!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Booking Form steps wizard - Left 7 columns */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-6">
          <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
            <h3 className="font-sans font-black text-base text-white uppercase">แบบฟอร์มลงทะเบียนจองเซ็ตอัป</h3>
            <span className="text-[10px] bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono px-2 py-0.5 rounded tracking-widest">STEP-BY-STEP</span>
          </div>

          {/* Alert of success */}
          {successNote && (
            <div className="rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 text-xs font-semibold animate-bounce">
              <span className="flex items-center space-x-1.5 font-bold uppercase">
                <CheckCircle2 className="w-4 h-4 text-[#ccff00]" />
                <span>ลงทะเบียนเสร็จสิ้น! คิวงานแต่งล้อของพี่ได้รับการจัดแจงเรียบร้อย ตรวจได้ที่แฟ้มด้านข้าง!</span>
              </span>
            </div>
          )}

          {/* Form items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>ชื่อผู้ติดต่อ (Customer Name):</span>
              </label>
              <input
                type="text"
                required
                placeholder="เช่น น้ารุ่ง คลองสาม"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-[#ccff00]" />
                <span>เบอร์โทรศัพท์ (Mobile Phone):</span>
              </label>
              <input
                type="tel"
                required
                placeholder="เช่น 089-xxx-xxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
              />
            </div>

            <div className="flex flex-col space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">ข้อมูลรถยนต์ (Selected JDM/Sport Car Specs):</label>
              <input
                type="text"
                placeholder="เช่น Honda Civic Type R (FL5) ปี 2023"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-none"
              />
            </div>

          </div>

          {/* Date and Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">วันนัดหมายติดตั้ง (Date):</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs font-mono font-bold text-white focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] outline-noneColor"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">เวลาเข้าจอง (Time Slot):</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs font-bold text-white focus:border-[#ccff00] outline-none"
              >
                {mockSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Services multi-selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">เลือกรายการบริการที่ประสงค์เข้ารับ (Services Requested):</label>
            <div className="grid grid-cols-1 gap-2.5">
              {mockServices.map((service, index) => {
                const checked = selectedServices.includes(service.name);
                return (
                  <div
                    key={index}
                    onClick={() => toggleService(service.name)}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer select-none transition-all duration-200 ${
                      checked 
                        ? 'border-[#ccff00] bg-[#ccff00]/5 text-white' 
                        : 'border-zinc-900 bg-zinc-950/60 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        className="rounded border-zinc-800 bg-zinc-950 text-[#ccff00] focus:ring-[#ccff00] cursor-pointer"
                      />
                      <span className="text-xs font-bold uppercase">{service.name}</span>
                    </div>
                    <span className="text-xs font-black text-[#ccff00] font-mono">
                      + {service.price.toLocaleString()} ฿
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing sum & CTA button */}
          <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">ประมาณค่าแรงบริการ:</p>
              <p className="text-xl font-black text-[#ccff00] font-sans italic tracking-tight">
                {totalServicesPrice.toLocaleString()} ฿
              </p>
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-[#ccff00] text-[#0a0a0a] rounded-xl font-sans font-black text-xs uppercase tracking-wider text-center hover:bg-lime-400 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0a0a0a]" />
                  <span>กำลังลงทะเบียนข้อมูลเข้าระบบ...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#0a0a0a]" />
                  <span>ยืนยันวันจองและคิวนัดติดตั้ง!</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Existing Bookings overview list - Right 5 columns */}
        <div className="lg:col-span-5 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-6 space-y-4">
          <div className="border-b border-zinc-900 pb-3 flex items-center space-x-2 text-white">
            <Users className="w-5 h-5 text-[#ccff00]" />
            <h3 className="font-sans font-black text-base uppercase">ลำดับตรวจสอบคิววันนี้</h3>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {existingBookings.map((b) => {
              const pending = b.status === 'Pending';
              const confirmed = b.status === 'Confirmed';
              
              return (
                <div 
                  key={b.id}
                  className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 space-y-2.5 transition-colors hover:border-[#ccff00]/20"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-white">{b.customerName}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      confirmed 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : pending 
                        ? 'bg-amber-950 text-amber-400 border border-amber-800' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {b.status === 'Confirmed' ? 'ยันยันแล้ว (Confirmed)' : 'รอคิวเข้าระบบ (Pending)'}
                    </span>
                  </div>

                  <p className="font-bold text-[11px] text-zinc-400 uppercase leading-snug">รถ: <strong className="text-zinc-200">{b.vehicleInfo}</strong></p>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-500 py-1 border-t border-b border-zinc-90 w-full">
                    <div>
                      <span>วันนัด: </span>
                      <strong className="text-zinc-300">{b.date}</strong>
                    </div>
                    <div>
                      <span>ช่วงเวลา: </span>
                      <strong className="text-[#ccff00]">{b.timeSlot}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {b.servicesSelected?.map((s: string, idx: number) => (
                      <span key={idx} className="bg-zinc-900 border border-zinc-800/80 rounded px-1.5 py-0.5 text-[8px] font-bold text-zinc-400 truncate max-w-[200px]" title={s}>
                        {s.split(' (')[0]}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-baseline pt-2 text-[11px]">
                    <span className="text-zinc-500 font-bold">ค่าเหนื่อยรวม:</span>
                    <strong className="text-[#ccff00] font-mono font-black">{b.totalPrice.toLocaleString()} ฿</strong>
                  </div>

                </div>
              );
            })}

            {existingBookings.length === 0 && (
              <p className="text-center py-12 text-xs text-zinc-600 font-semibold">ยังไม่มีลำดับจองการแต่งล้อในระบบวันนี้เลยครับพี่!</p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
