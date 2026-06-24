import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, HelpCircle, Flame, Disc, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';

interface AIChatProps {
  onTrackAction: (event: string) => void;
}

export default function AIChat({ onTrackAction }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: `สวัสดีครับพี่! ผมคือ "จีจี้ ล้อซิ่ง AI" (Gee Lil-Racing AI Assistant) ยินดีต้อนรับเข้าสู่อู่แคมเบอร์ฟิตเนสแทร็คทางหลวง! 

พี่อยากหาล้อฟอร์จเบาๆ เช่น TE37/CE28 ใส่กับรถตัวซิ่งคันไหน? หรือระแวงเกี่ยวกับมุมแคมเบอร์ (Camber Stance), ค่า PCD ตรงรุ่น, หรือสเปกสูตรยางสนาม Michelin Cup 2? 

สอบถามทิ้งคำถามไว้ได้เลยครับ จีจี้สอยข้อมูลแน่นตรงดีสปอร์ตมาตอบด่วนจี๋!`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeModelMode, setActiveModelMode] = useState<string>('Gee Gemini AI v3.5-Flash');
  
  const endRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick suggestions
  const suggestions = [
    "Recommend: แนะนำฟิตเมนต์ล้อเท่ๆ ขอบ 18 สำหรับ Civic FL5 หน่อยจีจี้",
    "Hot & New: ช่วงนี้มีล้อแม็กหรือยางอะไรกำลังฮิตและมาใหม่บ้าง?",
    "Review: ล้อ ENKEI RPF1 มีข้อดีด้านน้ำหนักและดีไซน์ยังไง รีวิวให้หน่อย?",
    "Consultation & AI Suggests: ปรึกษาตั้งแคมเบอร์หน้า -2.5 ดีกรี วิ่งถนนกินยางข้างในหรือป่าว?"
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: ChatMessage = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);
    onTrackAction('aiChats');

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (res.ok) {
        const data = await res.json();
        const serverMsg: ChatMessage = {
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString()
        };
        if (data.mode) {
          setActiveModelMode(data.mode);
        }
        setMessages(prev => [...prev, serverMsg]);
      } else {
        throw new Error("API request error is thrown");
      }

    } catch (err) {
      // Local fallback in case error
      const errorMsg: ChatMessage = {
        sender: 'assistant',
        text: `ขออภัยครับพี่! จีจี้ดมยางซิ่งเพลินไปนิด แต่ถ้าเดาฟิตเมนต์จากกูรูจีจี้: สำหรับล้อ TE37 ยอดนิยม แนะนำสเปก 18x9.5 ET+38 PCD 5x114.3 คู่กับยาง Michelin Cup 2 ขนาด 245/40R18 จะให้หน้าฟิตแก้มยางพับซุ้มเรียบหรูพอดีสวยงามแบบ JDM ตลอดกาลแน่นอนครับพี่!`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a]/50 p-6 md:p-8 backdrop-blur-md">
        <h2 className="font-sans font-black tracking-tight text-2xl md:text-3xl uppercase italic text-white flex items-center space-x-2.5">
          <Bot className="w-8 h-8 text-[#ff3300]" />
          <span>Gee Lil-Racing AI Assistant</span>
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-medium">
          ระบบแนะนำจัดฟิตเมนต์ล้อ ยางสมรรถนะสูง และมุมช่วงล่างด้วยปัญญาประดิษฐ์ ถามจดสเปกเบอร์เดียวรู้ใจอู่จีจี้ทันที!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Chat Wrapper - Left 8 Units */}
        <div className="lg:col-span-8 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 flex flex-col justify-between h-[520px]">
          
          {/* Header Diagnostic */}
          <div className="border-b border-zinc-900 pb-2.5 flex items-center justify-between text-zinc-500 font-mono text-[9px]">
            <div className="flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff3300] animate-ping"></span>
              <span>CLIENT BINDING: WEB SOCKET & REST SECURE PROXY ON</span>
            </div>
            <span>ENGINE: <strong className="text-[#ff3300]">{activeModelMode}</strong></span>
          </div>

          {/* Messages Container Area */}
          <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((m, index) => {
              const isUser = m.sender === 'user';
              
              return (
                <div 
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed space-y-1 ${
                    isUser 
                      ? 'bg-[#ff3300] text-[#0a0a0a] rounded-tr-none' 
                      : 'bg-zinc-950 border border-zinc-900 text-zinc-200 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    
                    {/* Role Tag & Time */}
                    <div className="flex items-center justify-between opacity-60 text-[9px] uppercase font-black tracking-wider mb-1">
                      <span>{isUser ? 'คุณผู้สอบถาม' : 'จีจี้ ล้อซิ่ง AI'}</span>
                      <span>{m.timestamp}</span>
                    </div>

                    <p>{m.text}</p>

                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-center space-x-2">
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl rounded-tl-none p-3 text-xs flex items-center space-x-2.5 text-zinc-500">
                  <Disc className="w-4 h-4 text-[#ff3300] animate-spin" />
                  <span>จีจี้กำลังเจาะสเปกออฟเซ็ต คาดยางให้ด่วนจี๋...</span>
                </div>
              </div>
            )}
            <div ref={endRef}></div>
          </div>

          {/* Chat User Input Block */}
          <div className="pt-3 border-t border-zinc-900 flex space-x-2">
            <input
              type="text"
              placeholder="พิมคำถามฟิตเมนต์ล้อ TE37, CE28 หรือสเปก ยาง AD09 ที่นี่..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs font-semibold text-white focus:border-[#ff3300] focus:ring-1 focus:ring-[#ff3300] outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading}
              className="p-3 bg-[#ff3300] text-[#0a0a0a] rounded-xl font-bold hover:bg-[#ff4500] disabled:opacity-40"
              aria-label="ส่งข้อความ"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Suggested Quick Prompt list - Right 4 Units */}
        <div className="lg:col-span-4 rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-5 space-y-4">
          <div className="border-b border-zinc-900 pb-2.5 flex items-center space-x-2 text-white">
            <HelpCircle className="w-4 h-4 text-[#ff3300]" />
            <h3 className="font-sans font-black text-xs uppercase tracking-wider">คำถามตรงเป้าเจายางซิ่ง</h3>
          </div>

          <ul className="space-y-2.5">
            {suggestions.map((s, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleSendMessage(s)}
                  disabled={loading}
                  className="w-full p-3 rounded-xl border border-zinc-900 bg-zinc-950/40 text-left hover:bg-zinc-950 hover:border-[#ff3300]/40 duration-200 transition-all text-xs font-semibold text-zinc-400 group-hover:text-white"
                >
                  <p className="text-zinc-400 hover:text-white leading-normal truncate">{s}</p>
                </button>
              </li>
            ))}
          </ul>

          {/* Custom micro rating alert info */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/80 p-4 text-[10px] text-zinc-500 font-mono space-y-1.5">
            <p className="font-sans font-black text-[11px] text-[#ff3300] uppercase mb-1 flex items-center">
              <Flame className="w-3.5 h-3.5 mr-1" /> JDM Expert Guide:
            </p>
            <p>1. ค้นหาค่า Offset ET ดึกยางเพื่อหลบซับถังพับโช้คแถมสเกลวงล้อสมรรถนะสูง</p>
            <p>2. สามารถเปรียบเทียบสเปก Te37, CE28 คู่ขนาน AD09, Cup2 ได้อย่างครบถ้วนในแชท</p>
          </div>

        </div>

      </div>

    </div>
  );
}
