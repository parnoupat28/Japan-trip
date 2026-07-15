import React, { useState, useEffect } from 'react';

// Sub-component for individual Event to prevent Hook rule violations in loops
function EventTimelineItem({ event }) {
  const [isTransitOpen, setIsTransitOpen] = useState(false);

  return (
    <div className="relative group">
      {/* Time Dot Icon */}
      <span className="absolute -left-8 md:-left-10 top-0.5 bg-slate-900 border border-cyan-500/50 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center text-xs md:text-sm shadow-md group-hover:border-cyan-400 transition-colors">
        {event.icon}
      </span>
      
      {/* Time and Title with Google Maps Link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-cyan-400 font-black text-xs tracking-wide bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            {event.time}
          </span>
          <h4 className="font-bold text-white text-xs md:text-sm leading-tight">{event.title}</h4>
        </div>
        
        {event.mapLink && (
          <a 
            href={event.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 px-2.5 py-1.5 rounded-xl transition-all"
          >
            📍 แผนที่ Google Maps
          </a>
        )}
      </div>

      {/* Description */}
      <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
        {event.desc}
      </p>

      {/* Accordion Toggle for Detailed Transit Instructions */}
      {event.expandedTransit && (
        <div className="mt-3">
          <button
            onClick={() => setIsTransitOpen(!isTransitOpen)}
            className="inline-flex items-center gap-1 text-[11px] font-black text-cyan-400 hover:text-cyan-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-colors"
          >
            {isTransitOpen ? '▲ ซ่อนวิธีเดินทาง' : '⚡ คลิกดูวิธีเดินทางอย่างละเอียด...'}
          </button>
          {isTransitOpen && (
            <div className="mt-2 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed max-w-3xl animate-fade-in">
              <span className="font-extrabold text-cyan-400 block mb-1">🧭 ขั้นตอนนำทางสเปกทอง:</span>
              {event.expandedTransit}
            </div>
          )}
        </div>
      )}

      {/* Pay Method Info */}
      <div className="mt-3.5 text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5">
        <span className="text-emerald-400 font-extrabold">💳 วิธีชำระเงิน/ค่าใช้จ่าย:</span>
        <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-medium">{event.payMethod}</span>
      </div>
    </div>
  );
}

export default function App() {
  // Application State
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDay, setActiveDay] = useState(0);
  const [checkedPackItems, setCheckedPackItems] = useState({});
  const [checkedBuyItems, setCheckedBuyItems] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({
    flight: false,
    nono: false,
    mercure: false,
    jr_hida_go: false,
    jr_hida_back: false,
  });
  
  // Custom Budget adjustments
  const [customBudget, setCustomBudget] = useState({
    flight: 75000,
    hotel: 45000, // 3 nights Nono + 4 nights Mercure
    transport: 15000,
    food: 24000,
    entrance: 4500, // 4,500 THB
    shopping: 10000,
  });

  // Countdown timer to Jan 22, 2027
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const targetDate = new Date('2027-01-22T22:00:00+07:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      
      if (difference <= 0) {
        clearInterval(interval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Hollywood twin request template
  const hollywoodTwinTemplate = "Please arrange Hollywood Twin style (push two twin beds together) and request a bed guard for my child.";

  const handleCopyText = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    triggerToast('ก๊อปปี้สคริปต์ขอเตียงชิดเรียบร้อยแล้วจ้าเทอ! 💬');
  };

  // Toggle items
  const togglePackItem = (item) => {
    setCheckedPackItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleBuyItem = (item) => {
    setCheckedBuyItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Calculations
  const calculatedTotal = Object.values(customBudget).reduce((a, b) => a + b, 0);
  const totalBudgetLimit = 180000;

  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'model',
      text: 'หวัดดีเทอ! เราคือ AI เลขาคู่ลุยหิมะอัจฉริยะที่เชื่อมระบบกูเกิลค้นหาข้อมูลจริงรอบด้าน มีคำถามอะไรเกี่ยวกับรถไฟ พายุหิมะ คูปอง ของกินโทยามะ/นาโกย่า หรือของเล่นน้องภรัณ ถามเรามาได้เลยน้าาา ❄️🤖',
      sources: []
    }
  ]);

  // Alternate Plan State
  const [selectedDayAlt, setSelectedDayAlt] = useState(1);
  const [alternatePlanResult, setAlternatePlanResult] = useState('');
  const [isAltLoading, setIsAltLoading] = useState(false);
  const [altSources, setAltSources] = useState([]);

  const callGeminiAPI = async (userMessage, customSystemInstruction = '', retries = 3, delay = 1000) => {
    const apiKey = ""; // Canvas injects this automatically
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: userMessage }]
        }
      ],
      tools: [{ "google_search": {} }],
      systemInstruction: {
        parts: [{ text: customSystemInstruction }]
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return callGeminiAPI(userMessage, customSystemInstruction, retries - 1, delay * 2);
        }
        throw new Error('ระบบ Gemini ปฏิเสธการตอบรับ ลองอีกครั้งนะเทอ');
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];
      
      if (candidate && candidate.content?.parts?.[0]?.text) {
        const text = candidate.content.parts[0].text;
        let sources = [];
        const groundingMetadata = candidate.groundingMetadata;
        if (groundingMetadata && groundingMetadata.groundingAttributions) {
          sources = groundingMetadata.groundingAttributions
            .map(attribution => ({
              uri: attribution.web?.uri,
              title: attribution.web?.title,
            }))
            .filter(source => source.uri && source.title);
        }
        return { text, sources };
      } else {
        throw new Error('โครงสร้างการตอบรับจาก AI ไม่ถูกต้อง');
      }
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiAPI(userMessage, customSystemInstruction, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  const getSystemPrompt = () => {
    return `คุณคือ "เลขาคู่คิด AI ลุยหิมะอัจฉริยะ" ส่วนตัวของคุณหมอบัน แฟน และน้องภรัณ (เด็กชายอายุ 7 ขวบ) 
    คุณต้องตอบคำถามด้วยภาษาไทยที่เป็นกันเอง มีความออดอ้อนน่ารัก และใช้สรรพนามหรือลงท้ายประโยคด้วยคำว่า "เทอ" หรือ "จ้าเทอ" หรือ "น้าเทอ" ทุกครั้งเหมือนเพื่อนสนิทเม้าท์มอยกัน
    ข้อมูลสำคัญที่ต้องรู้เกี่ยวกับทริปนี้:
    - สมาชิก: 3 คนคือ พ่อ (คุณหมอบัน), แม่ (แฟน), และลูกชายวัย 7 ขวบ (น้องภรัณ ชอบสะสม Dragon Ball, เลิฟออนเซน, กุ้งเทมปุระ, ปลาไหล, ไข่ม้วน)
    - ยานพาหนะ: ขนส่งสาธารณะ 100% (รถไฟ JR Hida, รถด่วนทอง μ-SKY, รถราง Loop Line โทยามะ, รถบัส Chihou ชานชาลา 16)
    - ที่พัก: โรงแรม Onyado Nono Toyama (มีออนเซนบ่อหินในห้อง ถอดรองเท้าเดินบนเสื่อทาทามิอุ่นๆ) และ The Cypress Mercure Hotel Nagoya (นอนเตียงคู่ดันชิด Hollywood Twin)
    - วันเดินทาง: 22 ม.ค. - 30 ม.ค. 2570 ซึ่งหนาวและหิมะหนามากในฝั่งโทยามะ
    - จุดประสงค์: ท่องเที่ยวหิมะครั้งแรก คุมงบประหยัดแต่ต้องการความพรีเมียม สบาย ปลอดภัย และไม่หลงทาง
    เมื่อผู้ใช้ถามคำถาม ให้ใช้ความสามารถในการค้นหาข้อมูลจริง (Google Search Grounding) เพื่ออ้างอิงสภาพอากาศล่าสุด, ตารางรถไฟ, ร้านอาหารยอดนิยมแถวโทยามะและนาโกย่า, พิกัดดรักสโตร์ แบรนด์สินค้าพรีเมียม (เช่น On Cloud) หรือแหล่งของเล่นที่ตรงเงื่อนไขของครอบครัว`;
  };

  const handleSendChatMessage = async (presetText) => {
    const text = presetText || chatInput;
    if (!text.trim() || isAiLoading) return;

    const userMessage = { role: 'user', text };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const response = await callGeminiAPI(text, getSystemPrompt());
      setChatHistory(prev => [...prev, {
        role: 'model',
        text: response.text,
        sources: response.sources
      }]);
    } catch (error) {
      setChatHistory(prev => [...prev, {
        role: 'model',
        text: `โอยยเทอออ! ระบบมีปัญหานิดหน่อยจ้าเทอ: ${error.message} ลองถามเราใหม่อีกทีน้าาา`,
        sources: []
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleGenerateAlternatePlan = async () => {
    if (isAltLoading) return;
    setIsAltLoading(true);
    setAlternatePlanResult('');
    setAltSources([]);

    const dayInfo = dailyItinerary[selectedDayAlt];
    const userPrompt = `ช่วยวิเคราะห์แผนเดินทางสำหรับ ${dayInfo.dayNum} (${dayInfo.title}) วันที่ ${dayInfo.date} ซึ่งมีกำหนดไปทำกิจกรรมกลางแจ้งลุยหิมะ
    ช่วยออกแบบ "แผนสำรองในร่ม 100% (Indoor Alternative Plan)" ในกรณีที่เกิดพายุหิมะถล่มจนปิดพื้นที่หรือรถไฟขัดข้อง
    โดยมีเงื่อนไขดังนี้:
    1. ต้องเหมาะสำหรับน้องภรัณ (อายุ 7 ขวบ) ไม่เดินหนาวลมข้างนอกนาน ไม่ลุยกระแสลมหนาวพัดตีหน้า
    2. เดินทางสะดวกด้วยรถไฟใต้ดิน รถราง หรือการเดินอินดอร์ในร่มแถวสถานีโทยามะหรือนาโกย่า (ตามแต่พิกัดวันนั้น)
    3. ระบุชื่อร้านอาหารและชื่อพิกัดหลบภัยหนาวที่มีชื่อเสียงจริง และระบุวิธีเดินทางโดยละเอียดด้วยจ้าเทอ
    4. ใช้ Google Search เพื่อหาข้อมูลสถานที่อัปเดตจริงๆ`;

    try {
      const response = await callGeminiAPI(userPrompt, getSystemPrompt());
      setAlternatePlanResult(response.text);
      setAltSources(response.sources);
    } catch (error) {
      setAlternatePlanResult(`แงงงเทอออ! มีข้อผิดพลาดจ้า: ${error.message} ลองกดปุ่มคำนวณใหม่อีกรอบนะเทอ!`);
    } finally {
      setIsAltLoading(false);
    }
  };

  const foodMenus = [
    {
      location: 'Onyado Nono Toyama (อาหารเช้า)',
      original: 'Ikura, Shiroebi, Crab, Tuna Bowl',
      phonetic: 'อิกุระ, ชิโรเอะบิ, คานิ, ทูน่า ด้ง',
      thai: 'ข้าวหน้าไข่ปลาแซลมอนล้นชามเคี้ยวเป๊าะแป๊ะ กุ้งขาวดิบอัญมณี เนื้อปูแกะ และทูน่าบด ตักหน้ารวมได้ไม่อั้น',
      price: 'ฟรี! (รวมอยู่ในราคาที่พักแล้ว)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Beni Zuwai Gani',
      phonetic: 'เบนิ ซูไว กานิ',
      thai: 'ปูหิมะแดงญี่ปุ่นนึ่งสดๆ ร้อนๆ เสิร์ฟทั้งตัว แกะง่ายเนื้อหวานฉ่ำ',
      price: 'ประมาณ 4,500 JPY (~1,035 บาท)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Shiroebi Tempura',
      phonetic: 'ชิโรเอะบิ เทมปุระ',
      thai: 'กุ้งขาวอัญมณีชุบแป้งเทมปุระทอดกรอบ สีเหลืองทอง กรอบเคี้ยวมันของโปรดน้องภรัณ',
      price: 'ประมาณ 880 JPY (~202 บาท)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Toyama Bay Seafood Don',
      phonetic: 'โทยามะ เบย์ ซีฟู้ด ดอน',
      thai: 'ข้าวหน้าอาหารทะเลรวมมิตรดิบส่งตรงจากอ่าวโทยามะ สดใหม่เด้งสู้ฟัน',
      price: 'ประมาณ 2,200 JPY (~506 บาท)'
    },
    {
      location: 'Yabaton (สถานีรถไฟนาโกย่า)',
      original: 'Teppan Tonkatsu',
      phonetic: 'เทปปัน ทงคัตสึ',
      thai: 'หมูชุบแป้งทอดกรอบสีทอง เสิร์ฟบนกระทะเหล็กแผ่นร้อนราดซอสมิโซะแดงเดือดรสกลมกล่อม',
      price: 'ประมาณ 1,900 JPY (~437 บาท)'
    },
    {
      location: 'Atsuta Horaiken (นาโกย่า)',
      original: 'Hitsumabushi',
      phonetic: 'ฮิตสึมาบูชิ',
      thai: 'ข้าวหน้าปลาไหลย่างซอสถ่านโบราณหอมกรุ่นสับชิ้นเล็ก ทานได้ 4 สไตล์ผสมวาซาบิและน้ำซุปดะชิอุ่น',
      price: 'ประมาณ 4,600 JPY (~1,058 บาท)'
    },
    {
      location: 'Atsuta Horaiken (นาโกย่า)',
      original: 'Umaki',
      phonetic: 'อูมากิ',
      thai: 'ไข่ม้วนสไตล์โตเกียวเนื้อหนานุ่ม สอดไส้เนื้อปลาไหลย่างซอสหวานฉ่ำละมุนลิ้นน้องภรัณชอบมาก',
      price: 'ประมาณ 1,100 JPY (~253 บาท)'
    },
    {
      location: 'Sekai no Yamachan (นาโกย่า)',
      original: 'Tebasaki',
      phonetic: 'เทบะซากิ',
      thai: 'ปีกไก่ทอดสไตล์นาโกย่าคั่วเกลือพริกไทยดำรสแซ่บเผ็ดร้อนเบรกแตก กินกับเครื่องดื่มอุ่นๆ ฟินมาก',
      price: 'ราคาตามเซ็ตกล่อง'
    }
  ];

  const placeReviews = [
    {
      placeName: 'Onyado Nono Toyama Natural Hot Spring',
      category: '🏨 เรียวกัง & ออนเซนโทยามะ',
      rating: '4.9/5',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=700&auto=format&fit=crop&q=80',
      source: 'กลุ่ม Facebook: กลุ่มคนชอบเที่ยวญี่ปุ่นด้วยตัวเอง',
      reviewer: 'คุณแม่ทรายสายเที่ยวครอบครัว',
      reviewText: 'แม่ๆ คนไหนพาลูกลุยหิมะ แนะนำที่ Onyado Nono Toyama เลยค่ะ! เดินถอดรองเท้าตั้งแต่ประตูด้านหน้า พื้นเสื่อทาทามิอุ่นเท้าและนุ่มมาก น้องภรัณ (ลูกชาย 7 ขวบ) เดินสบายไม่หนาวเท้าเลย ออนเซนในห้องกว้าง บ่อหินแช่ฟินสุดๆ ตกค่ำมีราเมงโชยุฟรีและไอติมบริการด้วย คุ้มค่าห้องมากค่ะ!',
      tip: 'อาหารเช้าห้ามพลาดเด็ดขาด! ตักไข่ปลา Ikura แซลมอนล้นๆ และกุ้งขาวดิบอัญมณีของดีโทยามะแบบไม่อั้น แฟนประทับใจจนบอกคุ้มตั้งแต่คืนแรกเลยค่ะ',
      link: 'https://pantip.com/topic/36527875'
    },
    {
      placeName: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      category: '🦀 ของกินพรีเมียมอ่าวโทยามะ',
      rating: '4.8/5',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=700&auto=format&fit=crop&q=80',
      source: 'Pantip: รีวิวร้านอร่อยโทยามะอัปเดตล่าสุด',
      reviewer: 'สมาชิกหมายเลข 490214',
      reviewText: 'เดินออกจากสถานีโทยามะมาไม่เกิน 1 นาที มุดเข้าห้าง MAROOT ชั้น 1 จะเจอร้าน Toyama Wan Shokudo ขอบอกว่า Beni Zuwai Gani หรือปูหิมะแดงตัวจริงเสียงจริง หวานเจี๊ยบ เนื้อแกะง่ายพูนจาน และชิโรเอะบิเทมปุระ (กุ้งขาวชุบแป้งทอด) ของโปรดลูกชาย กรอบกรวบแย่งกันกินสนุกเลย รูดบัตรเครดิตสบายใจจ้า',
      tip: 'ที่นี่เด่นเรื่องความสดส่งตรงจากอ่าวโทยามะ แนะนำข้าวหน้าทะเลซีฟู้ดดอนราดน้ำจิ้มซีฟู้ดพกไปเองคือสวรรค์บนดิน!',
      link: 'https://visit-toyama-japan.com/th/travel-inspiration/Toyama-crab'
    },
    {
      placeName: 'สวนปราสาทโทยามะ (Toyama Castle Park)',
      category: '🏯 พิกัดสู้หิมะเดือด',
      rating: '4.7/5',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=700&auto=format&fit=crop&q=80',
      source: 'กลุ่ม Facebook: แบกเป้เซอเซอ เที่ยวญี่ปุ่น',
      reviewer: 'คุณวิทย์ ช่างภาพสายลุยหิมะ',
      reviewText: 'สวนปราสาทโทยามะตอนหิมะปกคลุมคือสวยตะโกนครับ! มีสะพานแดงคลาสสิกที่ตัดกับฉากปราสาทสีขาวโพลน ถ่ายรูปสวยสเปกครอบครัวมาก ลานกว้างใหญ่ข้างนอกเงียบสงบ เหมาะมากที่จะเอากล่องพิมพ์เป็ดพลาสติก 100 เยนมาสอยกดปั๊มหิมะให้น้องปั้นปาใส่กัน มุดเข้าไปข้างในอุ่นเพราะมีฮีตเตอร์สบายตัวเลย',
      tip: 'แวะร้าน 100 เยนหน้าสถานีก่อนนะ สอยบล็อกปั๊มหิมะเป็ดมาปั๊มวางเรียงๆ บนขอบกำแพงหิน ได้รูปสวยพรีเมียมเวอร์',
      link: 'https://www.japankakkoii.com/japan-travel/review-toyama-castle-kansui-park/'
    },
    {
      placeName: 'สวนสัตว์ Toyama City Family Park',
      category: '🐼 ตะลุยสโนว์แลนด์สิงสาราสัตว์',
      rating: '4.8/5',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?w=700&auto=format&fit=crop&q=80',
      source: 'กลุ่ม Facebook: เที่ยวญี่ปุ่นสไตล์ครอบครัวลุยเดี่ยว',
      reviewer: 'แม่ก้อยพาลูกตะลอนโลก',
      reviewText: 'ทริปพาลูกเที่ยวโทยามะหน้าหนาว ต้องพาลูกลุยสวนสัตว์ที่นี่ค่ะ วิวเนินป่าสนที่มีหิมะเกาะหนาเตอะสวยงามมาก มีลานเนินให้เช่าแผ่นจานเลื่อนสไลเดอร์ ลากลูกวิ่งลื่นบนลานหิมะสนุกสนานกรี๊ดลั่นเลย ไฮไลท์คือนกสายพันธุ์ภูเขาไรโชที่จะเปลี่ยนสีขนเป็นสีขาวปุย และเสือโคร่งข้ามหิมะ ตัวเมืองหนาวดูคึกคักเป็นพิเศษจ้า',
      tip: 'ขากลับให้นั่งรถบัสป้าย 16 ตรงข้ามสวนสัตว์ แตะบัตร Toica ของลูกจะหักครึ่งราคาออโต้จ้า สะดวกเว่อร์',
      link: 'https://japantravel.navitime.com/th/area/jp/spot/02301-2500633/'
    },
    {
      placeName: 'Port of Nagoya Public Aquarium',
      category: '🐬 อควาเรียมดูวาฬเพชฌฆาตและโลมาแสนอุ่น',
      rating: '4.9/5',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=700&auto=format&fit=crop&q=80',
      source: 'กลุ่ม Facebook: เที่ยว Nagoya ด้วยตัวเอง',
      reviewer: 'คุณพ่อโบ๊ตสายเปย์ลูกรัก',
      reviewText: 'อควาเรียมระดับท็อปของญี่ปุ่น พาลูกมาดู Orca (วาฬเพชฌฆาต) และวาฬเบลูก้าขาวตัวจริงเสียงจริง ดีงามตรงที่บริเวณอัฒจันทร์โชว์ปลาโลมากลางแจ้ง มีเบาะนั่งติดฮีตเตอร์อุ่นๆ แปะตูดทำให้สู้ความหนาวอุณหภูมิเลขตัวเดียวดูโชว์ได้ชิลๆ เลยครับ ในตึกใต้วารีอุ่นรอดหนาว 100% พายุฝูงปลาซาร์ดีนล้านตัวสวยประทับใจแฟนมากครับ!',
      tip: 'ตึกอควาเรียมกว้างขวางและอุ่นรอดความเย็น 100% พาลูกมาหลบพายุหิมะเดินชมนนกเพนกวินได้แบบอิ่มเอมใจ',
      link: 'https://pantip.com/topic/36264135'
    },
    {
      placeName: 'ร้านปลาไหลร้อยปี Atsuta Horaiken',
      category: '🍱 ข้าวหน้าปลาไหลอบเตาถ่านโบราณ',
      rating: '5/5',
      image: 'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=700&auto=format&fit=crop&q=80',
      source: 'Pantip: ทริปนาโกย่า ต้องเก็บปลาไหลร้อยปี',
      reviewer: 'คุณเชอร์รี่นักรีวิวสายชิม',
      reviewText: 'ยกให้เป็นที่ 1 ของทริปนาโกย่าเลยค่ะ สำหรับเมนู Hitsumabushi ข้าวหน้าปลาไหลสับย่างเตาถ่านหอมควันโขมง ซอสเข้าเนื้อ หนังกรอบนอกนุ่มใน คลุกวาซาบิต้นหอมราดน้ำซุปดะชิอุ่นๆ เป็นคำที่ฟินน้ำตาไหล น้องภรัณลูกชายเลิฟไข่ม้วนอูมากิมาก เนื้อไข่หนานุ่มหอมกลิ่นปลาไหลสุดๆ รูดการ์ดจ่ายเงินสะดวกสบายมากค่ะ',
      tip: 'ช่วงค่ำคนจะเยอะ แนะนำรีบมาจองคิวล่วงหน้าเพื่อความฟินแบบไม่ต้องรอนานนะเทอออ',
      link: 'https://pantip.com/topic/39751365'
    }
  ];

  const dailyItinerary = [
    {
      dayNum: 'Day 0',
      title: 'เหินฟ้าข้ามราตรีสู่นาโกย่า',
      date: 'ศุกร์ 22 ม.ค. 2570',
      events: [
        {
          time: '22:00 น.',
          title: 'สตาร์ททริปความสุข @ ท่าอากาศยานสุวรรณภูมิ',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Suvarnabhumi+Airport',
          desc: 'เดินทางถึง ท่าอากาศยานสุวรรณภูมิ โหลดกระเป๋าสัมภาระ ผ่าน ตม. เตรียมเหินฟ้าไฟลต์บินตรงข้ามคืน (Thai Airways หรือ AirAsia X) หลับชาร์จพลังอุ่นๆ บนเครื่องบินโบยบินข้ามขอบฟ้า',
          payMethod: 'Prepaid (ชำระล่วงหน้าแล้ว)',
          icon: '✈️',
          expandedTransit: 'เดินทางจากสนามบินสุวรรณภูมิ แนะนำเข้าประตูด้านหน้า Row H หรือ Row J สำหรับสายการบินไทย หรือ Row D สำหรับสายการบินไทยแอร์เอเชีย เอ็กซ์ แนะนำให้เช็คอินออนไลน์ล่วงหน้า 24 ชั่วโมง เพื่อลดเวลารอเข้าคิวน้องภรัณจะได้ไม่ยืนเมื่อยขาจ้า!'
        }
      ]
    },
    {
      dayNum: 'Day 1',
      title: 'แลนดิ้งสู่นาโกย่า - บุกเหนือสู่โทยามะ - แแช่ออนเซนบ่อหิน',
      date: 'เสาร์ 23 ม.ค. 2570',
      events: [
        {
          time: '08:00 น.',
          title: 'แลนดิ้งสนามบินชูบุเซ็นแทรร์ (Chubu Centrair)',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Chubu+Centrair+International+Airport',
          desc: 'ผ่านพิธีการตรวจคนเข้าเมือง รับสัมภาระเรียบร้อยแล้ว จูงมือน้องภรัณเดินเท้าตามทางเชื่อมอินดอร์ไป Access Plaza เพื่อเตรียมขึ้นรถไฟ (เดินราบเรียบ 5-7 นาที)',
          payMethod: 'Free',
          icon: '🛬',
          expandedTransit: 'หลังรับสัมภาระ เดินออกจากประตูทางออกผู้โดยสารขาเข้า (Arrival Exit) เลี้ยวซ้ายเดินตามป้ายอักษรเขียนว่า "Access Plaza" เป็นทางราบราบเรียบ เดินสบาย 5 นาที มีทางลาดสำหรับรถเข็นเด็ก ไม่หลงแน่นอนเทอ'
        },
        {
          time: '09:30 น.',
          title: 'ขบวนรถด่วนทอง μ-SKY (มิวสกาย) มุ่งหน้าเข้าเมือง',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Meitetsu+Nagoya+Station',
          desc: 'กระโดดขึ้นขบวนรถไฟด่วนพิเศษสีทอง μ-SKY วิ่งดิ่งตรงเข้าสถานี Meitetsu Nagoya Station รวดเร็วทันใจใน 28 นาที',
          payMethod: 'Prepaid จองล่วงหน้า (ผู้ใหญ่ ¥1,250 / ลูกใช้สิทธิ์เด็ก)',
          icon: '🚄',
          expandedTransit: 'ไปที่เคาน์เตอร์ Meitetsu Ticket Office ที่สถานีรถไฟในสนามบิน ยื่นพาสปอร์ตและใบจอง หรือซื้อตั๋วที่ตู้ จากนั้นเดินเข้าเกทที่ชานชาลาที่ 1 (Platform 1) นั่งตามเบาะระบุบนหน้าตั๋ว แนะนำนอนพักสายตายาว 28 นาทีถึงสถานี Nagoya เลยเทอ!'
        },
        {
          time: '10:30 น.',
          title: 'ทำบัตรเด็ก Toica และช้อป Ekiben พรีเมียม @ สถานี JR Nagoya',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Nagoya+Station',
          desc: 'เดินเชื่อมตึกไปที่ JR Ticket Office ณ สถานี JR Nagoya ยื่นพาสปอร์ตจริงน้องภรัณทำบัตร Child IC Card Toica (หักครึ่งราคาอัตโนมัติ) เติมเงินสดเยนตุน ¥3,500 ชิลง่าย แล้วเลือกซื้อข้าวกล่องรถไฟอุ่นๆ พกขึ้นรถด่วน',
          payMethod: 'Cash (เติมบัตรลูก ¥3,500) & แตะ Pasmo ซื้อเบนโตะ',
          icon: '🎟️',
          expandedTransit: 'เดินออกจากสถานี Meitetsu เดินเชื่อมเข้าตึก JR Nagoya Station ทางเข้าหลัก ฝั่งทิศเหนือ เดินหาห้องตั๋วสีเขียว (JR Ticket Office / Midori-no-窓口) ยื่นพาสปอร์ตจริงของน้องภรัณแล้วแจ้งเจ้าหน้าที่ว่า "Child Toica Card Please" เจ้าหน้าที่จะกดทำบัตรแข็งให้เสร็จภายใน 3 นาทีเทอ!'
        },
        {
          time: '11:45 น.',
          title: 'ขบวนรถด่วน JR Limited Express Hida (นาโกย่า -> โทยามะ)',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Nagoya+Station',
          desc: 'ขบวนรถออกเดินทางชานชาลาที่ 11 วิ่งเลาะภูเขาลำธารเกาะหิมะขาวสวยงามสะกดสายตา แนะนำเลือกที่นั่งฝั่งขวา (ที่นั่งแถว D) เพื่อวิวหุบเขาที่สวยที่สุด และให้น้องภรัณนอนหลับสบาย in แอร์อุ่นๆ ยาว 3 ชม. 50 นาที',
          payMethod: 'Prepaid จองออนไลน์ล่วงหน้า (ผู้ใหญ่ ¥7,230)',
          icon: '🚄',
          expandedTransit: 'เดินไปที่เกทรถไฟ JR เสียบตั๋วรถด่วนคู่ Hida เข้าไป ขึ้นไปรอที่ชานชาลาที่ 11 (Platform 11) ขบวนรถไฟด่วน Hida จะจอดรอ แนะนำเดินเข้าตู้โดยสารที่ระบุ ที่นั่งแถว D (ฝั่งขวาของตัวรถ) จะเห็นทิวทัศน์หิมะและแม่น้ำฮิดะไหลเลาะแบบสวยสุดใจจ้า'
        },
        {
          time: '15:45 น.',
          title: 'วาร์ปเข้าเช็คอินเรียวกังเสื่อทาทามิ Onyado Nono Toyama',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Onyado+Nono+Toyama+Natural+Hot Spring',
          desc: 'แลนดิ้งสถานี Toyama เดินออกทางออกทิศใต้ แตะบัตรขึ้นรถราง Loop Line (สายสีขาว) ลงป้าย Kokusai-kaigijo-mae ลากเป๋าเข้าพักเรียวกังแสนหรูหรา ถอดรองเท้าแช่ออนเซนบ่อหินธรรมชาติส่วนตัวในห้องนอนอุ่นฉ่าฟินพ่นควัน',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥210 / เด็ก ¥110)',
          icon: '🏨',
          expandedTransit: 'ลงจากรถไฟ JR ที่ Toyama Station เดินตามป้าย "South Exit" ออกมาลานจอดด้านหน้า จะเจอสถานีรถรางโทยามะ (Toyama Tram Stop) รอรถรางสาย "Loop Line (สายสีขาว)" แตะบัตรโดยสารตอนขึ้นและลง ลงที่ป้าย Kokusai-kaigijo-mae โรงแรม Onyado Nono จะอยู่เยื้องไปฝั่งขวา เดิน 1 นาทีถึงเลยเทอ!'
        },
        {
          time: '18:00 น.',
          title: 'ดินเนอร์อภิมหาปูหิมะแดงตัวจริง @ ร้าน Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+Wan+Shokudo+MAROOT',
          desc: 'นั่งรถรางกลับมาสถานีโทยามะ มุดเข้าตึกเชื่อมอินดอร์, พุ่งตัวไปที่ร้านเชฟดัง Toyama Wan Shokudo สั่งปูหิมะแดงสดหวานนึ่งทั้งตัว กุ้งขาวชิโรเอะบิเทมปุระกรอบๆ ของโปรดน้องภรัณ และข้าวหน้าปลาดิบรวมเนื้อฉ่ำหวานเด้งดึ๋ง',
          payMethod: 'Credit Card (รูดปาร์ตี้พรีเมียม)',
          icon: '🦀',
          expandedTransit: 'จาก Onyado Nono เดินออกมาที่เดิม ขึ้นรถรางสายมุ่งหน้าไป Toyama Station ลงสุดป้ายหน้าสถานี เดินเลี้ยวขวาจะเจอทางเข้าตึกห้าง MAROOT ทันที ร้านอาหารตั้งอยู่ชั้น 1 ด้านหน้าหาไม่ยากจ้า รูดบัตรแสนสบาย!'
        }
      ]
    },
    {
      dayNum: 'Day 2',
      title: 'สงครามปาหิมะกลางปราสาทโบราณ - อุโมงค์ไฟล้านดวง',
      date: 'อาทิตย์ 24 ม.ค. 2570',
      events: [
        {
          time: '08:00 น.',
          title: 'มื้อเช้าถล่มซีฟู้ดสวรรค์ชั้นตักเอง @ Onyado Nono Toyama',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Onyado+Nono+Toyama+Natural+Hot+Spring',
          desc: 'ตื่นนอนก้าวเท้าไปถล่มไลน์บุฟเฟ่ต์ตักไข่ปลาแซลมอน (Ikura) ล้นชาม กุ้งขาวดิบหวานๆ เนื้อปูสดปั้น และทูน่าสับ โปะกี่รอบก็ได้จนอิ่มพุงพาร่างพร้อมลุย',
          payMethod: 'Prepaid (รวมในสิทธิ์จองที่พักแล้ว)',
          icon: '🍣',
          expandedTransit: 'เดินลงลิฟท์มาชั้น 1 ห้องอาหารหลักเปิดบริการตั้งแต่เช้าตรู่ ยื่นคีย์การ์ดห้องพักแล้วเดินถือจานไปลุยตักไลน์ซีฟู้ดได้เลย แนะนำให้ตักกุ้งชิโรเอะบิและไข่ปลาพูนๆ ราดน้ำซอสสไตล์โฮมเมดฟินลืมโลก!'
        },
        {
          time: '10:00 น.',
          title: 'ศึกสงครามปาหิมะ @ สวนปราสาทโทยามะ (Toyama Castle Park)',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+Castle+Ruin+Park',
          desc: 'เดินลุยหิมะเพียง 3 นาทีจากโรงแรมเข้าสวนปราสาท ถ่ายภาพเกล็ดหิมะเกาะสะพานหินฉากหลังปราสาทขาวสวย ปล่อยน้องภรัณพ่นพลังปั๊มรูปเป็ดหิมะ สไลเดอร์เลื่อนหิมะ ปาลูกบอลหิมะสู้กันสุดมัน แล้วมุดเข้าตึกปราสาทชมดาบซามูไรอุ่นๆ',
          payMethod: 'Free (ค่าตั๋วเข้าปราสาทด้านในราคาประหยัด)',
          icon: '🏯',
          expandedTransit: 'จากหน้าเรียวกัง Onyado Nono เลี้ยวซ้ายเดินตามทางเดินเท้าลัดเลาะริมคูเมืองกว้างข้ามสะพานแดงไปประมาณ 3 นาทีจะเจอประตูหลักทางเข้าสวนปราสาทโทยามะ ทางเดินเรียบหิมะนุ่มหนาสะดวกใจจ้า!'
        },
        {
          time: '14:00 น.',
          title: 'หลบลมหนาวมุดสุ่มโมเดลกาชาปอง @ ห้าง MAROOT',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=MAROOT+Toyama',
          desc: 'ขึ้นรถรางกลับมาสถานีโทยามะ มุดห้างอุ่น MAROOT ปล่อยภรัณหมุนตู้กาชาปองโมเดลการ์ตูนลุ้นตัวโปรด แฟนช้อปปิ้งสกินแคร์สูตรเข้มข้นดรักสโตร์ช่วยผิวแห้งกร้านจากลมหนาว',
          payMethod: 'Cash (สำหรับหยอดเหรียญกาชาปอง) / Credit Card (ช้อปปิ้ง)',
          icon: '🧸',
          expandedTransit: 'ขึ้นรถรางหน้าสวนปราสาท กลับมาลงที่ Toyama Station ห้าง MAROOT จะตั้งอยู่ติดกับทางเดินออกทิศใต้พอดิบพอดี เดินก้าวสลับผ่านประตูด้านหน้าเข้าแอร์อุ่นจัดรอดหนาวทันทีจ้า'
        },
        {
          time: '17:30 น.',
          title: 'อุโมงค์ไฟ Snowpiad White Illumination',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+Station',
          desc: 'จัดราเมงโชยุน้ำซุปดำพริกไทยร้อนระอุรสเข้มข้นดั้งเดิม ช่วยเรียกเหงื่อสู้หนาว แล้วพากันก้าวเดินก้าวส่องแสงไฟขาวสว่างจ้าสุดโรแมนติกกลางอุโมงค์ไฟขาวหน้าสถานี Toyama Snowpiad White Illumination',
          payMethod: 'Cash (ซดร้อนจ่ายไว)',
          icon: '🍜',
          expandedTransit: 'ออกจากร้านราเม็งในสถานี เดินมาทางลานจัดงานด้านทิศใต้ของ Toyama Station บริเวณรอบเสาไฟประดับสีขาว สังเกตอุโมงค์ไฟจะทอดตัวเป็นทางยาว 100 เมตร ให้พากันเดินกอดอุ่นแชะภาพสวยโรแมนติกสุดๆ'
        }
      ]
    },
    {
      dayNum: 'Day 3',
      title: 'ลากเลื่อนลุยสวนสัตว์ Family Park - ชาบูหมูดำโทยามะ',
      date: 'จันทร์ 25 ม.ค. 2570',
      events: [
        {
          time: '09:30 น.',
          title: 'นั่งรถบัสประจำทางขึ้นเหนือไปสวนสัตว์ @ ชานชาลา 16',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+Station+Bus+Terminal',
          desc: 'จูงมือน้องภรัณลากจานเลื่อนพลาสติกมาที่ท่ารถบัสหน้าสถานี Toyama Bus Terminal ชานชาลา 16 โดดขึ้นบัสสาย Chihou Railway ยิงตรงสู่จุดหมาย',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥470 / เด็กครึ่งราคา ¥240)',
          icon: '🚌',
          expandedTransit: 'เดินออกจากตัวสถานี Toyama หมวดบัสเทอร์มินัลด้านหน้า จะมีชานชาลาแบ่งเป็นช่องๆ เดินหาเสาป้าย "ชานชาลา 16 (Bus Platform 16)" รถบัสสาย Chihou Railway มุ่งหน้า Toyama Family Park จะจอดเทียบท่า แตะบัตรรถของลูก Toica ออโต้จ้า!'
        },
        {
          time: '10:15 น.',
          title: 'ผจญภัยสโนว์แลนด์สิงสาราสัตว์ @ Toyama City Family Park',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+City+Family+Park',
          desc: 'เช่าจานเลื่อนหน้าสวนสัตว์ลากภรัณลุยลานหิมะหนาเตอะ นำสไลเดอร์เนินหิมะหวีดเสียงหัวเราะ ส่องนกสายพันธุ์ภูเขา "นกไรโช" ผลัดขนสีขาวน่าเอ็นดู ส่องเสือขาวหิมะและหมีควาย ก่อนมุดซบอุ่นซดข้าวราดแกงกะหรี่ไส้กรอกร้อนๆ ด้านในอาคาร',
          payMethod: 'Cash / แตะ Pasmo (ค่าขนมอาหารกลางวัน)',
          icon: '🐼',
          expandedTransit: 'ลงจากรถบัสที่ป้าย "Family Park-mae" จะเห็นทางลาดหิมะทอดตัวเข้าสู่หน้าสวนสัตว์ทันที เดินเท้า 1 นาทีถึงหน้าประตูเช่าเลื่อนพลาสติกสีแดง/น้ำเงินพากลูกลุยหิมะกันมันส์สุดขั้วจ้า'
        },
        {
          time: '15:00 น.',
          title: 'นั่งบัสขากลับ - แช่ออนเซนน้ำพุร้อนผ่อนคลายกล้ามเนื้อ',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Onyado+Nono+Toyama+Natural+Hot+Spring',
          desc: 'ขึ้นรถบัสขากลับมาสถานีโทยามะ แวะเดินเชื่อมเข้า Onyado Nono พาครอบครัวถอดเสื้อหนาว แช่น้ำแร่ร้อนออนเซนบ่อหินธรรมชาติ บำรุงผิวพรรณ คลายความเหนื่อยล้าจนกล้ามเนื้อพริ้วไหวเบาสบาย',
          payMethod: 'แตะบัตร Pasmo / Toica ขากลับ',
          icon: '🛀',
          expandedTransit: 'เดินข้ามฝั่งมารอป้ายรถบัสฝั่งตรงข้ามสวนสัตว์ ขึ้นรถบัสสายเดิมกลับมาลงสถานี Toyama แล้วต่อรถรางขาวกลับเข้าที่พักเรียวกัง แช่ออนเซนธรรมชาติฟินๆ คลายความเย็นและเส้นตึงกันทั้งสามคนพ่อแม่ลูกจ้า!'
        },
        {
          time: '18:00 น.',
          title: 'ดินเนอร์ชาบูหมูดำพรีเมียมเดือดปุดๆ @ ย่าน Sogawa',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Sogawa+Toyama',
          desc: 'เดินก้าวเท้าระยะสั้นๆ ท่ามกลางอุณหภูมิเย็นฉ่ำทะลุเข้าย่านร้านค้า Sogawa นั่งหน้าหม้อดินชาบูจุ่มลวกเนื้อหมูดำญี่ปุ่นสไลด์ติดมันหวานนุ่มละลายในปากฉ่ำซอสงาบดร้อนใจจอยมีความสุขมากสุดๆ',
          payMethod: 'Credit Card',
          icon: '🍲',
          expandedTransit: 'จากที่พัก เดินเลาะหิมะริมฟุตบาทเลี้ยวซ้ายเข้าย่านการค้าที่มีโดมคลุมในส่วน Sogawa เดินเพียง 3 นาทีจะเจอร้านจุ่มชาบูหมูดำพรีเมียมควันฉุยพร้อมเสิร์ฟจ้าเทอ!'
        }
      ]
    },
    {
      dayNum: 'Day 4',
      title: 'คัมแบ็กสู่นาโกย่า - เช็คอินโรงแรมทำเลทอง Mercure',
      date: 'อังคาร 26 ม.ค. 2570',
      events: [
        {
          time: '09:30 น.',
          title: 'อำลาเมืองหิมะโทยามะ มุ่งหน้าสู่สถานีรถไฟ',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Toyama+Station',
          desc: 'เช็คเอาท์อำลาเรียวกัง Onyado Nono นั่งรถราง Loop Line กลับมาตั้งหลักที่ชานชาลาสถานีรถไฟ Toyama',
          payMethod: 'แตะ Pasmo / Toica (¥210)',
          icon: '🚃',
          expandedTransit: 'ลากเป๋ามาแตะรถรางฝั่งตรงข้ามเรียวกัง ลงสุดป้าย Toyama Station เพื่อเตรียมรับตั๋วขากลับรถไฟด่วน JR'
        },
        {
          time: '10:00 น.',
          title: 'ขบวนรถด่วนชมวิวหิมะกลับนาโกย่า (JR Limited Express Hida)',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Nagoya+Station',
          desc: 'ขึ้นขบวนรถไฟด่วน JR Limited Express Hida กลับสู่นาโกย่า เลือกนั่งฝั่งซ้าย (ที่นั่งแถว A) เพื่อเพลิดเพลินวิวเกล็ดหิมะสลับสายน้ำใสไหลเอื่อยริมโขดผาหินระยิบระยับเลาะขากลับ',
          payMethod: 'Prepaid จองออนไลน์ล่วงหน้า (ผู้ใหญ่ ¥7,230)',
          icon: '🚄',
          expandedTransit: 'เสียบตั๋วผ่านทางเกท JR เดินขึ้นชานชาลาสำหรับขบวน Limited Express Hida นั่งประจำเบาะฝั่งซ้าย แถว A เพื่อจับตามองสายน้ำโอบหุบเขาสีขาว สวยสะดุดตาจ้า'
        },
        {
          time: '14:00 น.',
          title: 'เช็คอิน รร. หรูพิกัดทอง The Cypress Mercure Hotel Nagoya',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=The+Cypress+Mercure+Hotel+Nagoya',
          desc: 'ลากกระเป๋าเดินทางแสนสะดวกสบายจากทางออก Sakura-dori Exit สถานีนาโกย่า เพียง 4 นาทีถึงหน้าโรงแรมหรูสไตล์ยุโรปคลาสสิก เข้าห้อง Standard Twin ขนาดกว้างขวาง 25 ตร.ม. จัดเตียงคู่ชิดกันแบบ Hollywood Twin กว้างขวาง 8 ฟุตฟินๆ',
          payMethod: 'Prepaid จองล่วงหน้าแล้ว',
          icon: '🏨',
          expandedTransit: 'ออกจากสถานี JR Nagoya ทางฝั่ง Sakura-dori (ฝั่งหอคอยทองคำหมุนๆ) เดินข้ามทางม้าลายและเลี้ยวซ้ายเข้าถนนเส้นหลักหน้า Bic Camera เดินตรงไป 4 นาทีจะเจอตัวตึกหรูคลาสสิกของ Mercure โดดเด่นเลยเทอ'
        },
        {
          time: '15:30 น.',
          title: 'เดินเล่นชิลๆ ใต้ทางเดินใต้ดินอบอุ่น @ ห้างใต้ดิน Nagoya',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Nagoya+Station',
          desc: 'พาน้องภรัณเดินเดินจูงมือชมวิถีคนเมืองนาโกย่า แอร์อุ่นพัดสบายใต้ทางเดินใต้ดินสถานี แวะร้านเบเกอรี่หอมกรุ่น ถือแก้วโกโก้ร้อนจิบแสนอบอุ่นคลายไอเย็น',
          payMethod: 'Pasmo / Toica',
          icon: '🛍️',
          expandedTransit: 'มุดทางลงบันไดใต้ดินหน้าโรงแรม เดินตรงเข้าห้างเชื่อมใต้วารีขนาดใหญ่ใต้ตึกสถานีหลัก名古屋 เดินสำรวจได้ยาวๆ แอร์อุ่นสบายไม่มีลมพายุพัดให้ผิวหน้าชาจ้า'
        },
        {
          time: '18:00 น.',
          title: 'ทงคัตสึทองคำราดซอสเดือดสะใจใต้ดินสถานี',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Yabaton+Nagoya+Station',
          desc: 'ดิ่งเข้าร้านทงคัตสึทอดกรอบคัดเกรดพรีเมียมใต้ตึกทาวเวอร์สถานี Nagoya สั่งชุดข้าวหมูชุบเกล็ดขนมปังทอดกรอบนุ่มฉ่ำ ซุปข้าวเติมฟรีอิ่มคุ้มราคาประหยัดตังค์ฉลุย',
          payMethod: 'Credit Card',
          icon: '🥩',
          expandedTransit: 'เดินตรงเข้าย่านร้านอาหาร Eska หรือตึกเชื่อมใต้ดินสถานีรถไฟ เพื่อตามหาร้านหมูทอดทองคำ สั่งและทานได้รวดเร็วทันใจเทอ!'
        }
      ]
    },
    {
      dayNum: 'Day 5',
      title: 'บุกพิพิธภัณฑ์สัตว์น้ำ Nagoya - หมูทอดมิโซะกระทะร้อน Yabaton',
      date: 'พุธ 27 ม.ค. 2570',
      events: [
        {
          time: '08:30 น.',
          title: 'ลิ้มรสอาหารเช้าต้นตำรับแถมโทสต์ฟรี @ Komeda\'s Coffee',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Komeda+Coffee+Nagoya+Station',
          desc: 'จูงมือเข้าคาเฟ่ชื่อดังนาโกย่า สั่งกาแฟ/เครื่องดื่มร้อนอร่อยๆ แถมฟรีขนมปังปิ้งทาเนยป้ายถั่วแดงเนื้อเนียนละมุนลิ้น อิ่มเซฟงบสบายท้อง',
          payMethod: 'Pasmo / Toica',
          icon: '☕',
          expandedTransit: 'เดินออกจากทางออกโรงแรม เลี้ยวขวาเดินเข้าคาเฟ่ Komeda ใกล้ตึกสถานี สั่งเครื่องดื่มอุ่นๆ เช่น ชาร้อน/โกโก้น้องภรัณ จะได้แถมโทสต์อวบๆ ทาถั่วแดงเนยฟรีๆ คุ้มสุดๆ'
        },
        {
          time: '10:15 น.',
          title: 'ผจญภัยอวาเรียมใต้วารี @ Port of Nagoya Public Aquarium',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Port+of+Nagoya+Public+Aquarium',
          desc: 'เดินทางโดยรถไฟใต้ดินลงสถานีสุดสาย Nagoyako บุกตึกส่องบอสใหญ่ วาฬเพชฌฆาต (Orca) และวาฬเบลูก้าขาวกลมปุ๊ก ตื่นตาโชว์โลมาผาดโผนเหินเวหา และชมอุโมงค์พายุฝูงปลาซาร์ดีนนับล้านประกอบแสงสีตระการตา ปิดท้ายทักทายแก๊งเพนกวินจักรพรรดิน่ารัก',
          payMethod: 'รถใต้ดิน: แตะบัตร (¥270) / ค่าเข้า: รูดบัตรเครดิต (ผู้ใหญ่ ¥2,030 / เด็ก ¥1,010)',
          icon: '🐬',
          expandedTransit: 'จากสถานี Nagoya ขึ้นรถไฟใต้ดินสาย Higashiyama (สายสีเหลือง) ลงป้าย Sakae แล้วต่อรถไฟใต้ดินสาย Meiko Line (สายสีม่วง) นั่งยาวสุดสายลงป้าย Nagoyako เดินออกทางออก 3 เดินขึ้นบันไดเลื่อนมาจะมองเห็นปลาวาฬและทางเข้าอควาเรียมทันทีใน 1 นาทีเทอ!'
        },
        {
          time: '18:30 น.',
          title: 'ดินเนอร์กระทะร้อนซอสเต้าเจี้ยวแดงพ่นไฟ @ ร้าน Yabaton',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Yabaton+Nagoya+Station',
          desc: 'พุ่งตัวกลับมาสถานีนาโกย่า ดิ่งเจ้าร้านโลโก้หมูพ่นไฟอันโด่งดัง สั่ง Teppan Tonkatsu หมูทอดเสิร์ฟบนแผ่นเหล็กกระทะร้อนฉ่าพวยพวัน ราดซอสมิโซะเต้าเจี้ยวแดงสูตรเข้มข้นคลุกข้าวสวยร้อนๆ กินลืมเหนื่อย',
          payMethod: 'Credit Card',
          icon: '🐷',
          expandedTransit: 'ขากลับนั่งรถใต้ดินกลับมาสถานี Nagoya เดินตรงขึ้นฝั่งตึกห้าง Meitetsu หรือ JR Gate Tower ไปชั้นอาหารตามป้ายโลโก้รูปหมูแดงสั่ง Teppan Tonkatsu จานยักษ์เสิร์ฟเดือดๆ ซู่ซ่าๆ จ้า!'
        }
      ]
    },
    {
      dayNum: 'Day 6',
      title: 'ส่องกอริลลาหลอด Shabani - ข้าวหน้าปลาไหลเตาถ่านโบราณ',
      date: 'พฤหัสบดี 28 ม.ค. 2570',
      events: [
        {
          time: '09:30 น.',
          title: 'มุ่งหน้าสวนสัตว์หุบเขา Higashiyama Koen',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Nagoya+Station+Subway',
          desc: 'ขึ้นรถไฟใต้ดินสายสีเหลือง Higashiyama Line นั่งยาวม้วนเดียวไม่ต้องสลับสาย ลงป้ายสถานี Higashiyama Koen ทางออก 3 เดินเหยียบก็ถึงสวนสัตว์ทางเข้า',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥240 / เด็ก ¥120)',
          icon: '🚇',
          expandedTransit: 'มุดลงรถใต้ดินสถานี Nagoya ไปทางชานชาลาสายสีเหลือง (Higashiyama Line) ฝั่งไป Sakae/Fujigaoka นั่งยาวม้วนเดียวลงที่ป้าย Higashiyama Koen ออกประตูทางออก 3 เดินเหยียบก็โผล่ลานกว้างหน้าประตูสวนสัตว์เลย สะดวกเวอร์!'
        },
        {
          time: '10:00 น.',
          title: 'ตะลุยป่ารักสัตว์ป่า @ Higashiyama Zoo & Botanical Gardens',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Higashiyama+Zoo+and+Botanical+Gardens',
          desc: 'บุกกรงดาราดัง กอริลลานายแบบเก็กหล่อ Shabani ท่าทางสุดคูล พาน้องภรัณลานเด็กสัมผัสป้อนอาหารหนูแกสบี้แสนเชื่อง (มีจุดน้ำอุ่นล้างมือบริการน้องนิ้วไม่ชาเกร็ง) นั่งขบวนรถไฟลอยฟ้าสั้นแอร์อุ่นส่องมุมสูงสัตว์ยักษ์เซฟพลังลูกรัก',
          payMethod: 'แตะบัตร / Cash ค่าตั๋ว (ผู้ใหญ่ ¥500 / น้องภรัณเข้าฟรีพิเศษ!)',
          icon: '🦁',
          expandedTransit: 'หลังเดินผ่านเกท สังเกตป้ายแผนที่ขวามือ เดินลุยเข้าโซนดารา Shabani ตกเที่ยงให้ขึ้น "Skyview Train" รถไฟลอยฟ้าติดแอร์อุ่น นั่งเซฟแรงลูกรักส่องทิวทัศน์หุบเขาและสัตว์ป่าได้อย่างผ่อนคลาย'
        },
        {
          time: '14:30 น.',
          title: 'หลับพักฟื้นชาร์จพลังงานบนเตียงอุ่น รรร. Mercure',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=The+Cypress+Mercure+Hotel+Nagoya',
          desc: 'นั่งรถใต้ดินขากลับพากันเข้าห้องพัก นอนเหยียดตัวคลายความหนาว อบอุ่นร่างกายเต็มที่ ป้องกันลูกชายนอนตากลมจนเหนื่อยจับไข้หัวหนาวพังพินาศสู้ทริปต่อไม่ได้',
          payMethod: 'Free (เวลาคุณภาพครอบครัว)',
          icon: '🛌',
          expandedTransit: 'พาน้องภรัณเดินลงรถไฟขบวนกลับมาลงสถานี Nagoya ลากสับเท้ารีบเดินเข้าตึกโรงแรม Mercure อาบน้ำร้อน and นอนซุกใต้ผ้าห่มชาร์จแบตกันสัก 2 ชม. จ้า'
        },
        {
          time: '18:00 น.',
          title: 'ราชาปลาไหลย่างเตาถ่านควันอบอวล @ ร้าน Atsuta Horaiken',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Atsuta+Horaiken',
          desc: 'พาก้าวเดินชิลสู่อภิมหาร้านข้าวหน้าปลาไหลในตำนานร้อยปีของเมือง สั่ง Hitsumabushi ข้าวปลาไหลย่างกรอบนอกนุ่มใน คลุกวาซาบิเคี้ยวคู่ต้นหอมเทราดน้ำซุปดะชิอุ่น และ Umaki ไข่ม้วนไส้ปลาไหลแสนหวานกลมกล่อม',
          payMethod: 'Credit Card',
          icon: '🍱',
          expandedTransit: 'พากันเดินเท้าลุยอากาศหนาวสบายๆ หรือนั่งรถใต้ดินไปพิกัดสาขาใกล้สถานีนาโกย่า เพื่อเข้าแถวชิมเมนูระดับโลกข้าวหน้าปลาไหล คิวจะยาวนิดนึงแต่น้องภรัณเลิฟไข่ม้วนแน่นอนเทอ!'
        }
      ]
    },
    {
      dayNum: 'Day 7',
      title: 'เดินชิลตลาดโบราณ Osu - สอย On Cloud ใต้โรงแรมชิลๆ',
      date: 'ศุกร์ 29 ม.ค. 2570',
      events: [
        {
          time: '09:30 น.',
          title: 'ตะลุยสตรีทฟู้ดใต้โดมใสไม่มีลมหนาว @ ตลาดคนเดิน Osu Shopping Street',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Osu+Shopping+Street',
          desc: 'ไหว้พระวัดไม้เก่าแก่ Osu Kannon เสริมสิริมงคล แล้วเดินเพลินใต้หลังคาโดมใสไร้ลมตีหน้า สอยของเล่น วินเทจ แฟนแฮปปี้ช้อปเสื้อผ้า สอดส่องแวะกัดดังโงะเนยปิ้งควันกรุ่น ไก่ทอดกรอบเสียบไม้ควันฟูรสชาติเผ็ดร้อนสะใจ',
          payMethod: 'แตะ Pasmo รถไฟฟ้า (¥240) / เงินสดสตรีทฟู้ด',
          icon: '🏮',
          expandedTransit: 'ขึ้นรถไฟใต้ดินสายสีเหลืองลงสถานี Fushimi แล้วสลับสายรถไฟใต้ดินสีฟ้า (Tsurumai Line) นั่ง 1 สถานีลงที่ Osu Kannon Station ออกทางออก 2 จะโผล่หน้าวัดไม้โบราณ เดินทะลุขวาเข้าสู่ตรอกโดมคลุมหลังคาทันทีเทอ!'
        },
        {
          time: '14:30 น.',
          title: 'บุกยานอวกาศลอยฟ้าสอยโมเดล @ Oasis 21',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Oasis+21+Nagoya',
          desc: 'เดินทางมา Sakae บุกชั้นใต้ดินเข้าร้าน Jump Shop สอยของเล่นการ์ตูน Dragon Ball แท้ลิขสิทธิ์ฝากภรัณ ขึ้นลิฟต์แก้วดาดฟ้า Spaceship-Aqua ส่องสายน้ำสลับทีวีทาวเวอร์แสงไฟตระการตาครอบครัวสุดรักเก๋กู้ด',
          payMethod: 'แตะ Pasmo รถไฟฟ้า (¥220) / รูดบัตรค่าโมเดลฟินๆ',
          icon: '🛸',
          expandedTransit: 'นั่งรถไฟใต้ดิน Meijo Line (สายสีม่วง) จาก Kamimaezu กลับมาลงที่ Sakae Station ทางออกที่ 4 จะเชื่อมเข้าชั้นใต้ดินห้างโดมแก้ว Oasis 21 ทันที ขึ้นลิฟท์แก้วไปดาดฟ้าชมวิวสวยสะดุดตาจ้า'
        },
        {
          time: '17:00 น.',
          title: 'ตะลุยล่ารองเท้า On Cloud + ทำ Tax Free ใต้ตึกที่พัก @ Bic Camera',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Bic+Camera+JR+Gate+Tower+Nagoya',
          desc: 'ก้าวขาสับเข้า Bic Camera ชั้น 9-10 บนห้าง JR Gate Tower ติดกับตึกโรงแรมเราเป๊ะๆ ลากสอยสวม On Cloud ยื่นพาสปอร์ตรับเงินคืนภาษีทันที 10% พร้อมแถมคูปองส่วนลดพิเศษ 7% รูดแฮปปี้เซฟกระเป๋าพ่อหนักแน่นมาก',
          payMethod: 'Credit Card',
          icon: '👟',
          expandedTransit: 'จาก Oasis 21 นั่งรถไฟใต้ดินสายสีเหลืองกลับสถานี Nagoya เดินเชื่อมเข้าตึกห้างเชื่อม JR Gate Tower ทันที ขึ้นลิฟท์ไปชั้น 9 และ 10 เข้าช็อป Bic Camera แผนกรองเท้า โชว์พาสปอร์ตไทยทำ Tax-free สอยด่วนประหยัดบานเบอะจ้า!'
        },
        {
          time: '18:30 น.',
          title: 'ปาร์ตี้ส่งท้ายทริปสุดอบอุ่นโบกปีกไก่ @ ห้องพัก Mercure',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=The+Cypress+Mercure+Hotel+Nagoya',
          desc: 'หิ้วปีกไก่ทอดพริกไทยแซ่บเผ็ดลืมโลก Sekai no Yamachan ข้าวผัด เกี๊ยวซ่าแสนอร่อย และเบียร์กระป๋องอุ่นๆ ขึ้นไปจัดปิกนิกกอดวงครอบครัว อบอุ่นท่ามกลางวิวนครแสงไฟนาโกย่าแสนโรแมนติกซาบซึ้งใจสามคน',
          payMethod: 'Credit Card / Pasmo',
          icon: '🍗',
          expandedTransit: 'ลงมาชั้นใต้ดินสถานีสอยกล่องปีกไก่ทอดหอมกรุ่น เดินเลาะ 4 นาทีขึ้นห้องพักเปิดฮีตเตอร์อุ่นจัด เทเบียร์และจิบน้ำหวานฉลองทริปลุยฝ่าความหนาวเย็นกับลูกรักแสนแฮปปี้!'
        }
      ]
    },
    {
      dayNum: 'Day 8',
      title: 'ลานโบอิ้งบินอุ่นอินดอร์ - บินตรงร่อนจอดกรุงเทพฯ',
      date: 'เสาร์ 30 ม.ค. 2570',
      events: [
        {
          time: '09:30 น.',
          title: 'อำลาห้องพักสุดหรู บึ่งด่วนมิวสกายเข้าสนามบิน',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Meitetsu+Nagoya+Station',
          desc: 'เช็คเอาท์อำลา รร. Mercure ลากเป๋าระยะ 4 นาทีเข้าชานชาลา Meitetsu Nagoya นั่งรถด่วนพิเศษ μ-SKY ยิงยาวรวดเดียวถึงสนามบิน Chubu Centrair ใน 28 นาที',
          payMethod: 'Prepaid (ผู้ใหญ่ ¥1,250)',
          icon: '🚄',
          expandedTransit: 'เช็คเอาท์ ลากกระเป๋าจากโรงแรมตรงเข้าเกท Meitetsu Line เสียบตั๋วรถด่วนพิเศษ μ-SKY นั่งพักตูดอุ่นๆ 28 นาทีรถไฟจะจอดเทียบท่าลานสนามบินชั้นขาออกเลยจ้า'
        },
        {
          time: '10:15 น.',
          title: 'วิ่งสาดพลังลอดปีกโบอิ้ง @ Flight of Dreams',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Flight+of+Dreams+Chubu+Centrair',
          desc: 'โหลดกระเป๋าสัมภาระเรียบร้อยแล้ว พาลูกรักพุ่งตรงเข้าสนามเด็กเล่นอุ่นอินดอร์ขนาดยักษ์ Flight of Dreams ปล่อยน้องภรัณปีนป่ายตาข่ายวิบาก ผจญภัยใต้เครื่องบิน Boeing 787 จริงแสนยิ่งใหญ่อลังการ วิ่งละเลงพลังงานเฮือกสุดท้ายก่อนขึ้นเครื่อง พ่อแม่นั่งจิบโกโก้ร้อนดูรอยยิ้มลูกรักสุขใจสุดพลัง',
          payMethod: 'Credit Card / Pasmo คาเฟ่ของกินเล่นส่งท้าย',
          icon: '✈️',
          expandedTransit: 'หลังเช็คอินกระเป๋า โหลดของเสร็จ เดินข้ามทางเชื่อมอินดอร์ไปตึก "Flight of Dreams" ปล่อยน้องภรัณวิ่งปืนตาข่ายใต้ท้องปีกโบอิ้งยักษ์อบอุ่น สนุกสนาน ก่อนเตรียมบอร์ดดิ้งไฟลต์กลับกรุงเทพฯ จ้า!'
        },
        {
          time: '16:00 น.',
          title: 'ร่อนจอดสุวรรณภูมิโดยสวัสดิภาพแสนสมบูรณ์แบบ',
          mapLink: 'https://www.google.com/maps/search/?api=1&query=Suvarnabhumi+Airport',
          desc: 'โดดขึ้นเครื่องบินบินตรง บินเหนือน่านฟ้า ร่อนจอดท่าอากาศยานสุวรรณภูมิ ร่างกายสมบูรณ์ แฟนแฮปปี้ใจฟู น้องภรัณเปี่ยมความทรงจำลุยฝ่าเกล็ดหิมะแรก และคุมงบประมาณใช้จ่ายได้สมบูรณ์แบบไม่บานปลายสักบาทเดียวเทอ!',
          payMethod: 'Prepaid (บินอุ่นหัวใจกลับบ้าน)',
          icon: '🛬',
          expandedTransit: 'ร่อนแลนดิ้งทางสนามบินสุวรรณภูมิ รับสัมภาระ นั่งรถแท็กซี่กลับบ้าน อบอุ่นหัวใจพร้อมภาพความประทับใจลุยพายุหิมะโทยามะแบบคุมงบเฉียบขาด!'
        }
      ]
    }
  ];

  // Scroll smoothly to selected day section
  const scrollToDay = (idx) => {
    setActiveDay(idx);
    const element = document.getElementById(`day-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 pb-16">
      
      {/* Snowy Header Decor */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 py-10 px-6 border-b border-cyan-500/20 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300 via-blue-500 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
          <div className="text-center md:text-left">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5 inline-block animate-pulse">
              ❄️ ทริปครอบครัวสุวรรณภูมิสเปกเทพ 9 วัน 8 คืน
            </span>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              คัมภีร์ลุยหิมะฉบับพกพา: นาโกย่า - โทยามะ
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              จัดสรรเพื่อ <span className="text-cyan-300 font-bold">คุณหมอบัน แฟน และน้องภรัณ</span> • ขนส่งสาธารณะ 100% • งบประมาณ {totalBudgetLimit.toLocaleString()} บาท
            </p>
          </div>

          {/* Real-time Countdown */}
          <div className="bg-slate-950/70 backdrop-blur border border-slate-800 p-3 rounded-xl flex flex-col items-center justify-center min-w-[260px]">
            <span className="text-[10px] text-slate-400 mb-1 font-semibold">⏳ นับถอยหลังสู่วันลุยหิมะ (22 ม.ค. 2570)</span>
            <div className="flex gap-1.5 text-center">
              <div className="bg-slate-900 px-2 py-1 rounded border border-cyan-500/20">
                <span className="text-base font-black text-cyan-400">{timeLeft.days}</span>
                <p className="text-[8px] text-slate-500 uppercase">วัน</p>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded border border-cyan-500/20">
                <span className="text-base font-black text-cyan-400">{timeLeft.hours}</span>
                <p className="text-[8px] text-slate-500 uppercase">ชม.</p>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded border border-cyan-500/20">
                <span className="text-base font-black text-cyan-400">{timeLeft.minutes}</span>
                <p className="text-[8px] text-slate-500 uppercase">นาที</p>
              </div>
              <div className="bg-slate-900 px-2 py-1 rounded border border-cyan-500/20">
                <span className="text-base font-black text-cyan-400">{timeLeft.seconds}</span>
                <p className="text-[8px] text-slate-500 uppercase">วิ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        
        {/* Toast Message Display */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-cyan-500 text-slate-950 font-extrabold px-5 py-3.5 rounded-xl shadow-2xl border border-cyan-300 animate-bounce">
            {toastMessage}
          </div>
        )}

        {/* Navigation Tabs - Swipable Horizontal Menu on Mobile */}
        <div className="relative mb-6">
          <div className="flex overflow-x-auto scrollbar-none gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 select-none">
            {[
              { id: 'itinerary', label: '🗓️ แผนเที่ยวรายวัน', icon: '🚇' }, 
              { id: 'ai_assistant', label: '🤖 AI เลขาอัจฉริยะ (NEW!)', icon: '✨' },
              { id: 'dashboard', label: '📊 แดชบอร์ดเตือนภัย', icon: '🚨' },
              { id: 'bookings', label: '🔔 จองล่วงหน้า (Pre-Book)', icon: '🗓️' },
              { id: 'ic_packing', label: '🎒 บัตร IC & จัดกระเป๋า', icon: '📦' },
              { id: 'reviews', label: '📸 รีวิวเด็ด & รูปจริง', icon: '📸' },
              { id: 'food', label: '🍣 ตารางอาหารเด็ด', icon: '🥢' },
              { id: 'budget', label: '💰 เครื่องคำนวณงบ', icon: '💸' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          {/* Fading Gradients to show scroll */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-900 to-transparent pointer-events-none md:hidden"></div>
        </div>

        {/* Tab 1: Detailed Daily Schedule Tab */}
        {activeTab === 'itinerary' && (
          <div className="flex flex-col lg:flex-row gap-6 relative">
            
            {/* Desktop Side Navigation Directory (Sticky Index) */}
            <div className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-800 flex items-center gap-2">
                  <span>📅</span> สารบัญรายวัน
                </h3>
                <div className="space-y-1">
                  {dailyItinerary.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToDay(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        activeDay === idx
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                      }`}
                    >
                      <span>{day.dayNum} • {day.date.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="opacity-60 text-[10px]">👉</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Continuous Long Scroll Container for Schedule */}
            <div className="flex-1 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <span>📅</span> เส้นทางสู้พายุหิมะ 9 วัน (Continuous Scroll)
                </h2>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  เชื่อมโยงพิกัดจริงบน Google Maps และวิธีแตะบัตรรถไฟโดยละเอียดแบบเห็นภาพชัดเจน เทอสามารถกดเปิดอ่านคีย์ความคล่องตัวข้ามวันได้เลยจ้า!
                </p>
                
                {/* Horizontal Quick-links for mobile */}
                <div className="flex lg:hidden overflow-x-auto scrollbar-none gap-2 mt-4 pb-1 border-t border-slate-800 pt-3">
                  {dailyItinerary.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToDay(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 border ${
                        activeDay === idx
                          ? 'bg-cyan-500 text-slate-950 border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {day.dayNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stacked Days rendering continuously */}
              {dailyItinerary.map((day, idx) => (
                <div 
                  key={idx} 
                  id={`day-${idx}`} 
                  className={`bg-slate-950 p-4 md:p-6 rounded-2xl border transition-all duration-300 scroll-mt-24 space-y-6 ${
                    activeDay === idx ? 'border-cyan-500' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
                    <div>
                      <span className="text-xs text-cyan-400 font-extrabold uppercase tracking-widest">{day.dayNum}</span>
                      <h3 className="text-base md:text-lg font-black text-white mt-0.5">{day.title}</h3>
                    </div>
                    <span className="bg-slate-900 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-800">
                      {day.date}
                    </span>
                  </div>

                  {/* Event Timeline */}
                  <div className="relative border-l-2 border-slate-800 pl-4 md:pl-6 ml-2 md:ml-4 space-y-8">
                    {day.events.map((event, eventIdx) => (
                      <EventTimelineItem key={eventIdx} event={event} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: REAL Gemini AI Travel Assistant & Weather Plan Alternative (NEW!) */}
        {activeTab === 'ai_assistant' && (
          <div className="space-y-6">
            
            {/* Split Grid for Real-Time Advisor and Weather Alternative Planner */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Part A: Google Grounded Assistant Chat */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <span>🤖</span> Live AI เลขาอัจฉริยะ (Google Grounded)
                      </h2>
                      <p className="text-[10px] text-slate-400 mt-0.5">เชื่อมต่อคลังข้อมูลจริงบนกูเกิล ถามเรื่องพิกัด คูปอง หรือตารางรถไฟได้สดๆ เทอ!</p>
                    </div>
                    <span className="bg-cyan-500/10 text-cyan-400 text-[9px] font-bold px-2 py-1 rounded border border-cyan-500/20 tracking-wider">
                      GEMINI-3-FLASH
                    </span>
                  </div>

                  {/* Quick Preset Queries */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {[
                      'แนะนำร้านของเล่น Dragon Ball แถวนาโกย่าเพิ่มเติมให้ภรัณทีเทอ',
                      'ดรักสโตร์แถวสถานีโทยามะพิกัดไหนทำ Tax Free ได้ดีที่สุด',
                      'แนะนำข้าวเช้าแถวสถานีนาโกย่า แนะนำร้านอื่นนอกจาก Komeda หน่อย',
                      'ถ้าหิมะตกหนักจนรถไฟ JR Hida หยุดวิ่ง มีทางสำรองเข้าเมืองยังไงบ้าง'
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendChatMessage(preset)}
                        disabled={isAiLoading}
                        className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] px-2.5 py-1.5 rounded-lg transition-all text-left max-w-full truncate"
                      >
                        💡 {preset}
                      </button>
                    ))}
                  </div>

                  {/* Live Chat History */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-[320px] overflow-y-auto mt-4 space-y-4 font-sans text-xs">
                    {chatHistory.map((msg, mIdx) => (
                      <div key={mIdx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-xl p-3 space-y-2 ${
                          msg.role === 'user'
                            ? 'bg-cyan-500 text-slate-950 font-bold rounded-tr-none'
                            : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                          
                          {/* Grounded Sources */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-800/80 text-[10px]">
                              <span className="font-extrabold text-cyan-400 block mb-1">🔗 แหล่งข้อมูลอ้างอิงจริงบนกูเกิล:</span>
                              <div className="flex flex-col gap-1">
                                {msg.sources.slice(0, 3).map((src, sIdx) => (
                                  <a
                                    key={sIdx}
                                    href={src.uri}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-amber-400 hover:underline block truncate"
                                  >
                                    • {src.title || src.uri}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex justify-start">
                        <div className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl p-3 rounded-tl-none flex items-center gap-2">
                          <span className="animate-spin text-cyan-400">🌀</span>
                          <span className="text-[11px]">เลขากำลังวิ่งไปค้นหากูเกิลอย่างละเอียดให้อยู่นะเทอออ...</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Chat Input Field */}
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="พิมพ์ถามพิกัด ของกิน หรือเรื่องพายุหิมะโทยามะได้เลย..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    disabled={isAiLoading}
                    className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    onClick={() => handleSendChatMessage()}
                    disabled={isAiLoading}
                    className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black px-5 py-3 rounded-xl text-xs transition-colors"
                  >
                    ถามเลขา
                  </button>
                </div>
              </div>

              {/* Part B: Weather Alternate Plan Generator */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <span>❄️</span> AI Smart Alternate Plan (แผนสำรองหิมะถล่ม)
                    </h2>
                    <p className="text-[10px] text-slate-400 mt-0.5">ในกรณีที่วันดังกล่าวพายุหิมะถล่มจนปิดพื้นที่ ให้เลือกวันแล้วกดปุ่มให้ AI สร้างแผนในร่มทันที!</p>
                  </div>

                  {/* Day Picker */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">เลือกวันที่ต้องการวิเคราะห์แผนสำรอง:</label>
                    <select
                      value={selectedDayAlt}
                      onChange={(e) => setSelectedDayAlt(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      {dailyItinerary.map((day, idx) => (
                        <option key={idx} value={idx}>
                          {day.dayNum} • {day.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Trigger Button */}
                  <button
                    onClick={handleGenerateAlternatePlan}
                    disabled={isAltLoading}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isAltLoading ? '🌀 กำลังวิเคราะห์ข้อมูลจริง...' : '⚡ ประมวลแผนสำรองอินดอร์ให้ออโต้'}
                  </button>

                  {/* Result Screen */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 h-[230px] overflow-y-auto text-xs leading-relaxed text-slate-300">
                    {alternatePlanResult ? (
                      <div className="space-y-2 whitespace-pre-line font-sans">
                        {alternatePlanResult}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-center text-slate-600 text-[10px]">
                        ยังไม่ได้ประมวลผลแผนสำรอง <br /> เลือกระบุวันข้างต้นแล้วกดให้ AI คำนวณได้เลยเทอออ
                      </div>
                    )}
                  </div>
                </div>

                {/* Sources for Alternate Plan */}
                {altSources && altSources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[9px] text-slate-400">
                    <span className="font-extrabold text-cyan-400 block mb-1">🔗 แหล่งข้อมูลแผนสำรองที่ปลอดภัยจริง:</span>
                    <div className="flex flex-col gap-1">
                      {altSources.slice(0, 2).map((src, idx) => (
                        <a key={idx} href={src.uri} target="_blank" rel="noopener noreferrer" className="text-amber-400 truncate block hover:underline">
                          • {src.title || src.uri}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Dashboard & Alerts Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">งบประมาณรวมทั้งสิ้น</h3>
                <p className="text-3xl font-black text-white">{calculatedTotal.toLocaleString()} THB</p>
                <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
                  <span>เป้าหมายงบไม่เกิน: {totalBudgetLimit.toLocaleString()} THB</span>
                  <span className={`font-bold ${calculatedTotal <= totalBudgetLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculatedTotal <= totalBudgetLimit ? '✓ คุมงบสำเร็จ!' : '⚠ เกินงบช้อปแล้ว!'}
                  </span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">งานควบคุมจองล่วงหน้า</h3>
                <p className="text-3xl font-black text-cyan-400">
                  {Object.values(bookingStatus).filter(Boolean).length} / {Object.keys(bookingStatus).length}
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  สถานะจอง: <span className="text-cyan-300 font-bold">เทอกำลังทยอยติ๊กความคืบหน้า</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">ความพร้อมสัมภาระ</h3>
                <p className="text-3xl font-black text-violet-400">
                  {Object.values(checkedPackItems).filter(Boolean).length + Object.values(checkedBuyItems).filter(Boolean).length} ชิ้น
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  ติ๊กแพ็คของ/สอยเพิ่มแล้วในแท็บ 'จัดกระเป๋า'
                </div>
              </div>
            </div>

            {/* Secretary Warning Desk */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl pointer-events-none"></div>
              <div className="flex items-start gap-4">
                <span className="text-3xl">🚨</span>
                <div>
                  <h3 className="text-lg font-bold text-rose-300 mb-2">เลขาเตือนภัยสเปกทองหน้างาน (Secretary's Critical Audit)</h3>
                  <ul className="space-y-3 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">1. ⚡ ข้อสังเกตเรื่องจำนวนคืนโรงแรมในตารางเดิม:</span>
                      <span>
                        ตารางการเดินทางของเทอระบุว่าจองโรงแรม <strong>The Cypress Mercure Hotel Nagoya (5 คืน)</strong> ตั้งแต่วันที่ <strong>26 ม.ค. ถึง 30 ม.ค. 2570</strong> แต่ถ้านับวันจริงๆ (เช็คอิน 26 บ่าย - เช็คเอาท์ 30 เช้า) จะมีเพียง <strong>4 คืนเท่านั้นจ้าเทอ!</strong> แปลว่าเทอจองจริงแค่ 4 คืนก็รอดสบายใจเฉิบแล้ว ซึ่งจะช่วยเซฟค่าที่พักลงไปได้อีกประมาณ <strong>4,500 - 5,500 บาทเลยนะ!</strong> เอาไปสอย On Cloud หรือของเล่นให้น้องภรัณเพิ่มได้สบายบรื๋อ!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">2. ☃️ ความท้าทายพายุหิมะโทยามะ:</span>
                      <span>
                        ปลายเดือนมกราคมคือช่วงพีคที่สุดของฤดูหนาวในภูมิภาคโฮคุริคุ หิมะตกหนามาก 100% แนะนำอย่างยิ่งให้เตรียม <strong>รองเท้าบู้ทกันหนาวชนิดสเปกลุยลานหิมะและกันน้ำ (Waterproof)</strong> ทั้ง 3 คนพ่อแม่ลูก เพราะรองเท้าวิ่งผ้าใบธรรมดาจะเปียกชื้นทันทีเมื่อเกล็ดหิมะละลาย และจะนำพาความหนาวเย็นทะลวงผิวหนังจนหมดสนุกเทอ!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">3. 🎟️ ข้อจำกัดบัตรเด็กลูกชาย:</span>
                      <span>
                        บัตร Child IC Card (Toica/Manaca) ของน้องภรัณ ต้องเป็นบัตรแข็งทางกายภาพเท่านั้น ไม่สามารถผูกลงใน Apple Wallet บน iPhone ได้เหมือนผู้ใหญ่น้าเทอ ดังนั้น วันแรกที่แลนดิ้ง รบกวนยื่นพาสปอร์ตจริงทำบัตรที่ตู้เขียวสถานี Nagoya แล้วเก็บใส่กระเป๋าคาดอกน้องไว้ดีๆ ป้องกันทำหล่นหายจ้า!
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Pre-Booking Tracker Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🗓️</span> ไทม์ไลน์และขั้นตอนการควบคุมการจองล่วงหน้า (Pre-Bookings)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                เพื่อตำแหน่งที่นั่งชมวิวรถไฟที่ดีที่สุด ห้องนอน Hollywood Twin และตั๋วบินโปรโมชัน ห้ามลืมกำหนดกดจองเด็ดขาดนะเทอ!
              </p>
            </div>

            <div className="space-y-4">
              {/* Flight Booking */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs font-semibold">มิ.ย. - ก.ค. 2569</span>
                    <h3 className="font-bold text-white">1. ✈️ ตั๋วเครื่องบินไป-กลับ บินตรง (กทม. - นาโกย่า NGO)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    สายการบินบินตรงเท่านั้น (Thai Airways หรือ AirAsia X) เพื่อสุขภาพพลังงานของน้องภรัณและแฟน <br />
                    • ขาไป: ไฟลต์ข้ามคืน 22 ม.ค. 2570 (หลับยาวชาร์จพลัง) • ขากลับ: ไฟลต์บ่าย 30 ม.ค. 2570 (เดินทางชิลไม่เหนื่อยร่าง)
                  </p>
                </div>
                <button
                  onClick={() => setBookingStatus(prev => ({ ...prev, flight: !prev.flight }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    bookingStatus.flight ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {bookingStatus.flight ? '✓ จองเรียบร้อยแล้ว' : '⌛ ยังไม่ได้จอง'}
                </button>
              </div>

              {/* Onyado Nono Booking */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded text-xs font-semibold">สิงหาคม 2569</span>
                    <h3 className="font-bold text-white">2. 🏨 เรียวกังเสื่อทาทามิ Onyado Nono Toyama Natural Hot Spring (3 คืน)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    • ประเภทห้องนอน: <span className="text-cyan-300 font-semibold">Twin Room with Private Hot Spring Bath</span> (บ่อหินน้ำแร่ธรรมชาติส่วนตัวในห้องนอนอุ่นจัดฟินๆ) <br />
                    • เงื่อนไขสำคัญ: <span className="text-amber-400">ต้องจองแบบรวมอาหารเช้า (Breakfast Included)</span> เพื่อถล่มซีฟู้ดตักแซลมอนโฮมเมดไม่อั้นช่วงเช้าสาย
                  </p>
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg mt-3">
                    <p className="text-xs text-slate-300 font-mono select-all">
                      {hollywoodTwinTemplate}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">พิมพ์ส่งช่อง Special Request หลังจองเสร็จเพื่อให้เตียงคู่ดันชิดกันเกือบ 220 - 240 ซม.</span>
                      <button 
                        onClick={() => handleCopyText(hollywoodTwinTemplate)}
                        className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 px-2 py-0.5 rounded text-[10px] font-bold transition-all"
                      >
                        🗐 คัดลอกโน้ตรีเควสต์
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setBookingStatus(prev => ({ ...prev, nono: !prev.nono }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    bookingStatus.nono ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {bookingStatus.nono ? '✓ จองเรียบร้อยแล้ว' : '⌛ ยังไม่ได้จอง'}
                </button>
              </div>

              {/* Mercure Booking */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-xs font-semibold">สิงหาคม 2569</span>
                    <h3 className="font-bold text-white">3. 🏨 โรงแรมพิกัดทองสถานีนาโกย่า The Cypress Mercure Hotel Nagoya (จอง 4 คืนพอเทอ!)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    • ประเภทห้องนอน: <span className="text-cyan-300 font-semibold">Standard Twin Room</span> (ห้องสเปกใหญ่กว้างขวางปักลากกระเป๋าจากสถานีแค่ 4 นาทีเทอ!) <br />
                    • เงื่อนไขสำคัญ: <span className="text-emerald-400">จองแบบไม่รวมอาหารเช้า (Room Only)</span> เพื่อไปลุยสตรีทฟู้ดแซนด์วิชและข้าวปั้นใต้ดินประหยัดงบพกพา <br />
                    • การจองเตียงเด็ก: ระบุความต้องการในช่อง Special Request ขอจัดเตียงชิดกัน Hollywood Twin style & request a bed guard เช่นเดียวกัน
                  </p>
                </div>
                <button
                  onClick={() => setBookingStatus(prev => ({ ...prev, mercure: !prev.mercure }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    bookingStatus.mercure ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {bookingStatus.mercure ? '✓ จองเรียบร้อยแล้ว' : '⌛ ยังไม่ได้จอง'}
                </button>
              </div>

              {/* JR Hida Booking Going */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-xs font-semibold">22 - 23 ธันวาคม 2569</span>
                    <h3 className="font-bold text-white">4.1 🚄 ตั๋วรถไฟด่วน JR Limited Express Hida (ขาไป 23 ม.ค. 11:45 น.)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    จองผ่าน JR-West Online Train Reservation ล่วงหน้า 30 วันเป๊ะเพื่อการระบุตำแหน่งที่นั่ง <br />
                    • สเปกตำแหน่งที่นั่ง: <span className="text-amber-400 font-bold">ฝั่งขวา (ที่นั่งแถว D)</span> ชมวิวลำธารหุบเขาแม่น้ำสลับเกล็ดหิมะขาวสะกดสายตาอัศจรรย์
                  </p>
                </div>
                <button
                  onClick={() => setBookingStatus(prev => ({ ...prev, jr_hida_go: !prev.jr_hida_go }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    bookingStatus.jr_hida_go ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {bookingStatus.jr_hida_go ? '✓ จองเรียบร้อยแล้ว' : '⌛ ยังไม่ได้จอง'}
                </button>
              </div>

              {/* JR Hida Booking Returning */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-xs font-semibold">22 - 23 ธันวาคม 2569</span>
                    <h3 className="font-bold text-white">4.2 🚄 ตั๋วรถไฟด่วน JR Limited Express Hida (ขากลับ 26 ม.ค. 10:00 น.)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    จองผ่านระบบ JR-West Online หรือ JR-Central E-ticket <br />
                    • สเปกตำแหน่งที่นั่ง: <span className="text-amber-400 font-bold">ฝั่งซ้าย (ที่นั่งแถว A)</span> ส่องวิวลำธารและหุบเขาเกล็ดหิมะริมทางกลับไหลเรื่อยเฉื่อยชา
                  </p>
                </div>
                <button
                  onClick={() => setBookingStatus(prev => ({ ...prev, jr_hida_back: !prev.jr_hida_back }))}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    bookingStatus.jr_hida_back ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {bookingStatus.jr_hida_back ? '✓ จองเรียบร้อยแล้ว' : '⌛ ยังไม่ได้จอง'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: IC Cards & Packing Checklists Tab */}
        {activeTab === 'ic_packing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* IC Card Masterclass */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📱</span> บัตรโดยสารดิจิทัล & วิธีแตะเงิน (IC Card Masterclass)
                </h2>
                <p className="text-xs text-slate-400 mt-1">เดินทางขนส่งสาธารณะ 100% เน้นสะดวกและรวดเร็วสูงสุดเทอ</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold">พ่อหมอบัน (เทอ) & แม่แม่ (แฟน)</span>
                  <h3 className="font-bold text-white mt-1">สาย Apple Wallet บน iPhone</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    • บัตรแนะนำ: ผูกและเปิดใช้บัตร <strong>Pasmo หรือ Suica</strong> ใน Apple Wallet ดึงเงินจากบัตรเก่าได้ทันที <br />
                    • เงินตุนที่ต้องเติม: <span className="text-cyan-300 font-bold">เติมจากไทยคนละ 7,000 เยน</span> (รวม 2 คน = 14,000 เยน / ~3,220 บาท) <br />
                    • หน้าที่ใช้แตะ: ผ่านทางเกทรถไฟใต้ดิน, รถรางโทยามะ, รถบัส Chihou และรูดซื้อขนมเซเว่นได้ยันจบวันสุดท้ายจ้าชิลๆ
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded text-[10px] font-bold">น้องภรัณ (วัย 7 ปี)</span>
                  <h3 className="font-bold text-white mt-1">บัตรแข็งประเภทเด็ก (Child IC Card)</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    • ยี่ห้อบัตร: บัตรแข็งเด็ก <strong>Toica</strong> หรือ <strong>Manaca</strong> (คิดอัตราค่าโดยสารหักครึ่งราคาอัตโนมัติรวดเร็วมาก) <br />
                    • พิกัดพาสอย: ห้องตั๋วสีเขียว <span className="text-cyan-300 font-semibold">JR Ticket Office ณ สถานี JR Nagoya</span> ในวันแรก <br />
                    • หลักฐานยื่น: ยื่นพาสปอร์ตตัวจริงน้องภรัณเพื่อยืนยันอายุต่ำกว่า 12 ปี <br />
                    • เงินตุนที่ต้องเติม: <span className="text-cyan-300 font-bold">เติมตุนเงินสดไว้เพียง 3,500 เยน</span> (~805 บาท) พอดีเทอ เพราะลูกถูกคิดหักเงินแค่ครึ่งเดียวของพ่อแม่ (ถ้าตังค์หมด หยอดเหรียญเพิ่มที่เครื่องตามตู้สถานีใต้ดินได้เลย)
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Packing Lists */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>🎒</span> เช็คลิสต์กระเป๋าเดินทางสเปกเทพ
                </h2>
                <p className="text-xs text-slate-400 mt-1">ติ๊กเลือกสัมภาระที่แพ็คจากไทย หรือเตรียมแวะช้อปในญี่ปุ่นให้เรียบร้อยจ้า</p>
              </div>

              {/* Pack from Thailand */}
              <div>
                <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                  <span>📦</span> สัมภาระแพ็คใส่กระเป๋าจากไทย
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'heattech', label: 'เสื้อผ้า Heattech Ultra Warm (พ่อแม่ลูก คนละ 3 ชุด)' },
                    { key: 'coat', label: 'เสื้อหนาวโค้ตกันลม (Down Jacket) กันหิมะกันละอองน้ำ' },
                    { key: 'gloves', label: 'ถุงมือลุยหิมะกันน้ำของลูกชายภรัณ (ห้ามถุงมือไหมพรมอมน้ำเด็ดขาด!)' },
                    { key: 'sunglasses', label: 'แว่นตากันแดดพรีเมียม (หิมะขาวสะท้อนสายตาแสบระคายมาก)' },
                    { key: 'medicine', label: 'ยาสามัญเด็ก (ยาลดไข้ ยาแก้แพ้ ผงเกลือแร่ ยาทาผิวแตก)' },
                    { key: 'old_ic', label: 'บัตรแข็ง IC Card เก่าของพ่อแม่ (กรณีอยากดึงเข้า Apple Wallet)' },
                  ].map(item => (
                    <label key={item.key} className="flex items-start gap-3 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={!!checkedPackItems[item.key]}
                        onChange={() => togglePackItem(item.key)}
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                      />
                      <span className={`text-xs ${checkedPackItems[item.key] ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buy in Japan */}
              <div>
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-1.5">
                  <span>🛒</span> สิ่งที่ต้องสอยด่วนทันทีเมื่อแลนดิ้ง (เซเว่น / ดรักสโตร์)
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'kairo', label: 'แผ่นร้อนแปะตัว Kairo (ไคโระ) แปะนอกฮีทเทคอุ่นพุงฟิน' },
                    { key: 'toe_warm', label: 'แผ่นอุ่นแปะถุงเท้าตีนอุ่น (Toe Warmers) ป้องกันนิ้วเท้าชาเย็น' },
                    { key: 'handcream', label: 'แฮนด์ครีมสูตรเข้มข้น & ลิปมันบาล์ม (กันมือและปากแห้งแตกเป็นแผลขุย)' },
                    { key: 'duck_mold', label: 'แม่พิมพ์ปั๊มหิมะรูปเป็ดพลาสติก (หาซื้อร้าน 100 เยนให้น้องภรัณลุยสนุกสุดขีด)' },
                  ].map(item => (
                    <label key={item.key} className="flex items-start gap-3 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:bg-slate-900 transition-colors">
                      <input
                        type="checkbox"
                        checked={!!checkedBuyItems[item.key]}
                        onChange={() => toggleBuyItem(item.key)}
                        className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900"
                      />
                      <span className={`text-xs ${checkedBuyItems[item.key] ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 6: Reviews and Photo Gallery Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl md:rounded-3xl p-4 md:p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                <span>📸</span> รีวิววงในจากคนไทยจริง (Pantip & Facebook Groups)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                รวบรวมรีวิวจริงจากกระทู้ Pantip และกลุ่มคนชอบเที่ยวญี่ปุ่นตัวจริง ส่งตรงข้อมูลสเปกพรีเมียมให้ครอบครัวเทอเลยจ้า
              </p>
            </div>

            {/* Grid of review cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {placeReviews.map((review, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all duration-300 flex flex-col group">
                  {/* Photo Section with Zoom Effect */}
                  <div className="h-40 md:h-48 overflow-hidden relative">
                    <img 
                      src={review.image} 
                      alt={review.placeName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-cyan-400 text-[9px] md:text-[10px] font-bold px-2 py-1 rounded border border-cyan-500/20">
                      {review.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-lg">
                      <span>⭐</span> {review.rating}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 md:p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-white font-extrabold text-sm md:text-base mb-1">{review.placeName}</h3>
                      
                      {/* Review Source Badge */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] md:text-[10px] text-slate-400">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="text-slate-300 font-semibold">{review.source}</span>
                        <span className="text-slate-600">•</span>
                        <span>โดย: <span className="text-slate-300">{review.reviewer}</span></span>
                      </div>

                      {/* Actual Review text */}
                      <p className="text-slate-300 text-xs md:text-sm leading-relaxed italic">
                        "{review.reviewText}"
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Editor / Secretary Tip Box */}
                      <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-3 text-[10px] md:text-xs text-cyan-300 leading-relaxed">
                        <span className="font-bold">💡 คีย์โน้ตเด็ด: </span>
                        {review.tip}
                      </div>

                      {/* External Live Review Link Button */}
                      <a 
                        href={review.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 border border-slate-800 hover:border-cyan-500 text-cyan-400 text-xs font-bold py-3 px-4 rounded-xl transition-all duration-300 min-h-[44px]"
                      >
                        เปิดอ่านรีวิวต้นฉบับเต็มจ้าเทอ
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Food Menu Tab */}
        {activeTab === 'food' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🍣</span> สวรรค์นักกิน: สรุปตารางเมนูเด็ดพร้อมคำอ่านภาษาไทย
              </h2>
              <p className="text-xs text-slate-400 mt-1">สรุปเมนูอาหารแปลไทยพร้อมคำอ่านและราคาเรียบร้อย ยื่นโชว์ให้บริกรญี่ปุ่นดูเพื่อสั่งได้เลย!</p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left border-collapse bg-slate-950">
                <thead>
                  <tr className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs">
                    <th className="p-3 font-semibold">พิกัดร้าน / แหล่ง</th>
                    <th className="p-3 font-semibold">ชื่อเมนูอังกฤษ/ญี่ปุ่น</th>
                    <th className="p-3 font-semibold">คำอ่านภาษาไทย</th>
                    <th className="p-3 font-semibold">คำแปล / รายละเอียดเมนู</th>
                    <th className="p-3 font-semibold text-right">ราคาโดยประมาณ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-xs">
                  {foodMenus.map((menu, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 text-cyan-300 font-semibold align-top">{menu.location}</td>
                      <td className="p-3 text-white font-mono align-top">{menu.original}</td>
                      <td className="p-3 text-amber-400 font-bold align-top">{menu.phonetic}</td>
                      <td className="p-3 text-slate-300 align-top leading-relaxed">{menu.thai}</td>
                      <td className="p-3 text-emerald-400 font-bold text-right align-top">{menu.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 leading-relaxed">
                💡 <strong>เคล็ดลับฉบับเลขา:</strong> เวลาเข้าร้านอาหารที่ญี่ปุ่น ถ้าสื่อสารยาก ให้จิ้มตารางนี้โชว์พนักงานแล้วชูนิ้วส่งสัญญาณบอกจำนวนจานได้เลยเทอ! ปูโทยามะ (Beni Zuwai Gani) เป็นอะไรที่พลาดแล้วจะนอนร้องไห้เอาได้นะเทอออ
              </p>
            </div>
          </div>
        )}

        {/* Tab 8: Budget Controller Tab */}
        {activeTab === 'budget' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>💰</span> เครื่องคำนวณและควบคุมงบประมาณ (Interactive Budget Controller)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                อัตราแลกเปลี่ยนคำนวณเฉลี่ยด้วย 100 JPY ≈ 23 THB (สามารถคลิกปรับเปลี่ยนตัวเลขเพื่อทดลองวางแผนจริงได้เทอ!)
              </p>
            </div>

            {/* Budget Sliders / Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Flight Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>✈️ 1. ตั๋วเครื่องบิน (3 คน พ่อแม่ลูก):</span>
                    <span className="text-cyan-400">{customBudget.flight.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="100000"
                    step="5000"
                    value={customBudget.flight}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, flight: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Hotel Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🏨 2. โรงแรมที่พัก 8 คืน (Toyama 3 + Nagoya 4-5 คืน):</span>
                    <span className="text-cyan-400">{customBudget.hotel.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="30000"
                    max="60000"
                    step="2000"
                    value={customBudget.hotel}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, hotel: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500">จอง Mercure 4 คืนแทนที่จะเป็น 5 คืน งบโรงแรมจะเหลือราวๆ ~39,000 THB เทอ!</span>
                </div>

                {/* Transport Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🚇 3. ขนส่งสาธารณะทั้งหมด (JR Hida + บัส + รถไฟใต้ดิน):</span>
                    <span className="text-cyan-400">{customBudget.transport.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="25000"
                    step="1000"
                    value={customBudget.transport}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, transport: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Food Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🍱 4. ค่ากินลุยถล่มซีฟู้ดสี่แยก:</span>
                    <span className="text-cyan-400">{customBudget.food.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="40000"
                    step="1000"
                    value={customBudget.food}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, food: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Entrance Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🦁 5. ค่าเข้าอควาเรียม + สวนสัตว์:</span>
                    <span className="text-cyan-400">{customBudget.entrance.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="10000"
                    step="500"
                    value={customBudget.entrance}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, entrance: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Shopping Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>🛍️ 6. งบช้อปปิ้งกลางๆ (On Cloud & โมเดลลูก):</span>
                    <span className="text-cyan-400">{customBudget.shopping.toLocaleString()} THB</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="30000"
                    step="1000"
                    value={customBudget.shopping}
                    onChange={(e) => setCustomBudget(prev => ({ ...prev, shopping: Number(e.target.value) }))}
                    className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Total Budget Output Display */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">สรุปค่าใช้จ่ายทั้งหมดโดยประมาณ</span>
              <p className="text-4xl font-black text-white">{calculatedTotal.toLocaleString()} THB</p>
              
              {/* Progress Indicator */}
              <div className="w-full bg-slate-900 rounded-full h-3 max-w-md mx-auto border border-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${calculatedTotal <= totalBudgetLimit ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min((calculatedTotal / totalBudgetLimit) * 100, 100)}%` }}
                ></div>
              </div>

              <p className={`text-xs font-bold ${calculatedTotal <= totalBudgetLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculatedTotal <= totalBudgetLimit 
                  ? `✓ ยอดเงินเฉลี่ยต่อคนตกคนละ ${Math.round(calculatedTotal / 3).toLocaleString()} บาท ซึ่งอยู่ในกรอบวงเงินแสนแปดเทอ คุมงบได้ยอดเยี่ยม!`
                  : `⚠ งบรวมทะลุเป้าแสนแปดแล้วเทอ! ลองลดงบโรงแรมหรืองบช้อปปิ้งลงหน่อยน้า`
                }
              </p>
            </div>

            {/* NEW: Meticulous Itemized Breakdown Section */}
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-2">
                <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-1.5">
                  <span>📊</span> แจกแจงรายจ่ายปลีกย่อยของทริป (Meticulous Itemized Breakdown)
                </h3>
                <p className="text-[10px] text-slate-400">เลขาคำนวณและประเมินค่าใช้จ่ายย่อยแยกแต่ละบุคคลและแต่ละพิกัดไว้ให้ครบเลยจ้า</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Flights & Hotels */}
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-cyan-300 font-bold block">✈️ ตั๋วเครื่องบิน & 🏨 โรงแรมที่พัก</span>
                  <ul className="space-y-2 text-slate-300 leading-relaxed">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• บินตรงไป-กลับ (ผู้ใหญ่ 2 + เด็ก 1)</span>
                      <span className="font-semibold text-slate-100">~75,000 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• Onyado Nono Toyama (Twin, อาหารเช้า, 3 คืน)</span>
                      <span className="font-semibold text-slate-100">~27,000 THB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• The Cypress Mercure Nagoya (Standard Twin, 4 คืน)</span>
                      <span className="font-semibold text-slate-100">~18,000 THB</span>
                    </li>
                  </ul>
                </div>

                {/* Transport Breakdown */}
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-cyan-300 font-bold block">🚇 ขนส่งสาธารณะละเอียด (ราคาแลกเปลี่ยน 100 JPY ≈ 23 บาท)</span>
                  <ul className="space-y-2 text-slate-300 leading-relaxed">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• JR Ltd Express Hida (ไป-กลับ: ผู้ใหญ่ 2 + เด็ก 1)</span>
                      <span className="font-semibold text-slate-100">~8,310 THB <br/><span className="text-[9px] text-slate-500 font-normal">(ผู้ใหญ่คนละ ¥14,460 / เด็ก ¥7,230)</span></span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• รถไฟ Meitetsu μ-SKY (ไป-กลับ: ผู้ใหญ่ 2 + เด็ก 1)</span>
                      <span className="font-semibold text-slate-100">~1,440 THB <br/><span className="text-[9px] text-slate-500 font-normal">(ผู้ใหญ่คนละ ¥2,500 / เด็ก ¥1,250)</span></span>
                    </li>
                    <li className="flex justify-between">
                      <span>• เงินตุน IC Card (พ่อแม่คนละ ¥7,000 / ลูกคนละ ¥3,500)</span>
                      <span className="font-semibold text-slate-100">~4,025 THB <br/><span className="text-[9px] text-slate-500 font-normal">(แตะจ่าย รถไฟใต้ดิน รถราง รถบัส ตู้กดน้ำ)</span></span>
                    </li>
                  </ul>
                </div>

                {/* Food Breakdown */}
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-cyan-300 font-bold block">🍱 ค่ากินลุยถล่มซีฟู้ด (ราคาโดยประมาณ)</span>
                  <ul className="space-y-2 text-slate-300 leading-relaxed">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• มื้อปูหิมะแดง + เทมปุระกุ้งขาว (Toyama Wan Shokudo)</span>
                      <span className="font-semibold text-slate-100">~3,500 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• ข้าวหน้าปลาไหลโบราณ + ไข่ม้วนอูมากิ (Atsuta Horaiken)</span>
                      <span className="font-semibold text-slate-100">~3,500 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• หมูกระทะร้อนซอสมิโซะแดง (ร้าน Yabaton)</span>
                      <span className="font-semibold text-slate-100">~1,500 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• ดินเนอร์ชาบูหมูดำสไลด์บางละลายในปาก (Sogawa)</span>
                      <span className="font-semibold text-slate-100">~3,500 THB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• มื้อทั่วไป / ร้านสะดวกซื้อ / ขนม / โทสต์ Komeda (8 วัน)</span>
                      <span className="font-semibold text-slate-100">~12,000 THB</span>
                    </li>
                  </ul>
                </div>

                {/* Entrances & Shopping */}
                <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60">
                  <span className="text-cyan-300 font-bold block">🦁 ค่าเข้าชมสถานที่ & 🛍️ งบช้อปปิ้งสอยของ</span>
                  <ul className="space-y-2 text-slate-300 leading-relaxed">
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• Port of Nagoya Public Aquarium (ผู้ใหญ่ 2 + เด็ก 1)</span>
                      <span className="font-semibold text-slate-100">~1,165 THB <br/><span className="text-[9px] text-slate-500 font-normal">(ผู้ใหญ่คนละ ¥2,030 / เด็ก ¥1,010)</span></span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• สวนสัตว์ Higashiyama Zoo (ผู้ใหญ่คนละ ¥500 / น้องภรัณฟรี)</span>
                      <span className="font-semibold text-slate-100">~230 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• สวนสัตว์ Toyama Family Park (ผู้ใหญ่ ¥470 / เด็ก ¥240)</span>
                      <span className="font-semibold text-slate-100">~270 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• สวนปราสาทโทยามะ (ดาบซามูไร) & อื่นๆ</span>
                      <span className="font-semibold text-slate-100">~135 THB</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span>• รองเท้าวิ่งแบรนด์ฮิต On Cloud (หลังหักคืนภาษี)</span>
                      <span className="font-semibold text-slate-100">~5,500 THB</span>
                    </li>
                    <li className="flex justify-between">
                      <span>• ของเล่น Dragon Ball ลิขสิทธิ์แท้ (Jump Shop) + เครื่องสำอาง</span>
                      <span className="font-semibold text-slate-100">~4,500 THB</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* MOBILE ONLY: FLOATING NAVIGATOR FAB - Highly Optimized for cold, shaky hands */}
      {activeTab === 'itinerary' && (
        <div className="fixed bottom-6 right-6 z-40 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-14 h-14 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-full shadow-2xl border-2 border-cyan-300 flex items-center justify-center font-black text-xl transition-transform active:scale-95"
          >
            📅
          </button>
          
          {mobileMenuOpen && (
            <div className="absolute bottom-16 right-0 bg-slate-950 border border-slate-800 p-3 rounded-2xl shadow-2xl flex flex-col gap-1.5 min-w-[140px] animate-fade-in">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-2 mb-1">ข้ามไปวัน:</span>
              {dailyItinerary.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    scrollToDay(idx);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex justify-between items-center ${
                    activeDay === idx
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span>{day.dayNum}</span>
                  <span className="text-[10px] text-slate-600">👉</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}