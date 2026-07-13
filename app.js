function App() {
  // Application State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDay, setActiveDay] = useState(0);
  const [checkedPackItems, setCheckedPackItems] = useState({});
  const [checkedBuyItems, setCheckedBuyItems] = useState({});
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
    hotel: 45000, // original budget
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

  // Chatbot Simulator State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: 'หวัดดีเทอ! เราเป็นเลขาคู่คิด AI ส่วนตัวของเทอตลอดทริปนี้ มีอะไรสงสัยเรื่องการจอง รถบัส หรือพิกัดร้านอาหารในโทยามะ/นาโกย่า ถามเราได้ตลอด 24 ชม. เลยน้าาา ❄️☃️',
      time: '12:00'
    }
  ]);

  // Hollywood twin request template
  const hollywoodTwinTemplate = "Please arrange Hollywood Twin style (push two twin beds together) and request a bed guard for my child.";

  const handleCopyText = (text) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    // Custom modal alternative instead of browser alert for better experience
  };

  const handleSendMessage = (textToSend) => {
    const msgText = textToSend || chatInput;
    if (!msgText.trim()) return;

    const newHistory = [...chatHistory, { sender: 'user', text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setChatHistory(newHistory);
    setChatInput('');

    // Simulated Bot Responses based on keywords
    setTimeout(() => {
      let replyText = "อุ๊ย คำถามนี้เฉียบมากเทอ! แต่เลขาขอแนะนำให้เช็คตารางรถไฟ/บัสดีๆ นะ หรือลองถามเรื่อง 'ปูโทยามะ', 'ขึ้นรถบัสป้าย 16' หรือ 'เตียงชิด' ดูสิเทอ เรามีสคริปต์เด็ดเตรียมไว้ให้แล้ว!";
      
      const lowerText = msgText.toLowerCase();
      if (lowerText.includes('ปู') || lowerText.includes('maroot') || lowerText.includes('กิน')) {
        replyText = "กรี๊ดดด! พุ่งตัวด่วนเลยเทอ ห้าง MAROOT ชั้น 1 ร้าน 'Toyama Wan Shokudo' ปักหมุดเลย! สั่ง 'เบนิ ซูไว กานิ' (ปูหิมะแดงนึ่งหวานๆ ทั้งตัว ¥4,500) และ 'ชิโรเอะบิ เทมปุระ' (กุ้งขาวทอดกรอบของโปรดน้องภรัณ ¥880) ด่วนๆ สดหวานลืมโลกแน่นอนเทอ!";
      } else if (lowerText.includes('รถบัส') || lowerText.includes('ป้าย 16') || lowerText.includes('family park') || lowerText.includes('สวนสัตว์')) {
        replyText = "วิธีขึ้นบัสสาย Chihou Railway ไปสวนสัตว์ง่ายโครตเทอ! เดินไปที่ชานชาลาหมายเลข 16 หน้าสถานีโทยามะ ตอนขึ้นรถให้แตะบัตร Pasmo/Suica (หรือบัตร Toica ของน้องภรัณ) ที่แท่นตรงประตู 1 ทีเพื่อบันทึกต้นทาง พอจะลงป้าย Family Park-mae ก็เดินมาแตะอีกทีตรงเครื่องข้างคนขับเพื่อหักตังค์ครึ่งราคาของลูกและราคาเต็มของเทอกับแฟนจ้า สะดวกเวอร์!";
      } else if (lowerText.includes('เตียง') || lowerText.includes('hollywood') || lowerText.includes('twin') || lowerText.includes('รีเควสต์')) {
        replyText = "จัดไปเทอ! นี่คือก๊อปปี้โน้ตรีเควสต์เตียงชิดจ้า:\n\n'Please arrange Hollywood Twin style (push two twin beds together) and request a bed guard for my child.'\n\nพนักงานจะดันเตียงคู่มาชิดกันทำให้ได้หน้ากว้างนอนอุ่นๆ เกือบ 220 - 240 ซม. น้องภรัณนอนมุดตรงกลางได้สบายใจเฉิบไม่ตกเตียงชัวร์เทอ!";
      }

      setChatHistory(prev => [...prev, {
        sender: 'bot',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 800);
  };

  // Toggle item in packing list
  const togglePackItem = (item) => {
    setCheckedPackItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const toggleBuyItem = (item) => {
    setCheckedBuyItems(prev => ({ ...prev, [item]: !prev[item] }));
  };

  // Calculations
  const calculatedTotal = Object.values(customBudget).reduce((a, b) => a + b, 0);
  const totalBudgetLimit = 180000;

  // Food Menu Data
  const foodMenus = [
    {
      location: 'Onyado Nono Toyama (อาหารเช้า)',
      original: 'Ikura, Shiroebi, Crab, Tuna Bowl',
      phonetic: 'อิกุระ, ชิโรเอะบิ, คานิ, ทูน่า ด้ง',
      thai: 'ข้าวหน้าไข่ปชาแซลมอนล้นๆ กุ้งขาวดิบอัญมณี เนื้อปูแกะ และทูน่าบดละเอียด ตักโปะพูนชามได้ไม่อั้น',
      price: 'ฟรี! (รวมอยู่ในราคาที่พักแล้ว)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Beni Zuwai Gani',
      phonetic: 'เบนิ ซูไว กานิ',
      thai: 'ปูหิมะแดงญี่ปุ่นนึ่งสดๆ ทั้งตัว รสชาติหวานฉ่ำ เนื้อแน่นเต็มคำ',
      price: 'ประมาณ 4,500 JPY (~1,035 บาท)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Shiroebi Tempura',
      phonetic: 'ชิโรเอะบิ เทมปุระ',
      thai: 'กุ้งขาวอัญมณีชุบแป้งทอดกรอบคัดพรีเมียม กรุบกรอบเคี้ยวมัน ของโปรดน้องภรัณ',
      price: 'ประมาณ 880 JPY (~202 บาท)'
    },
    {
      location: 'Toyama Wan Shokudo (ห้าง MAROOT ชั้น 1)',
      original: 'Toyama Bay Seafood Don',
      phonetic: 'โทยามะ เบย์ ซีฟู้ด ดอน',
      thai: 'ข้าวหน้าอาหารทะเลรวมมิตรดิบส่งตรงจากอ่าวโทยามะ สดหวานเด้งสู้ฟัน',
      price: 'ประมาณ 2,200 JPY (~506 บาท)'
    },
    {
      location: 'Yabaton (สถานีรถไฟนาโกย่า)',
      original: 'Teppan Tonkatsu',
      phonetic: 'เทปปัน ทงคัตสึ',
      thai: 'หมูชุบแป้งทอดกรอบสีทอง เสิร์ฟบนกระทะร้อนเดือดซู่ ราดด้วยซอสมิโซะแดงเข้มข้นสูตรลับเฉพาะ',
      price: 'ประมาณ 1,900 JPY (~437 บาท)'
    },
    {
      location: 'Atsuta Horaiken (นาโกย่า)',
      original: 'Hitsumabushi',
      phonetic: 'ฮิตสึมาบูชิ',
      thai: 'ข้าวหน้าปลาไหลย่างเตาถ่านโบราณหั่นชิ้นเล็กอบซอส ซิกเนเจอร์นาโกย่า เสิร์ฟพร้อมเครื่องเคียงและน้ำซุปดะชิร้อนๆ',
      price: 'ประมาณ 4,600 JPY (~1,058 บาท)'
    },
    {
      location: 'Atsuta Horaiken (นาโกย่า)',
      original: 'Umaki',
      phonetic: 'อูมากิ',
      thai: 'ไข่ม้วนสไตล์ญี่ปุ่นเนื้อหนานุ่มอบอุ่น สอดไส้ด้วยชิ้นเนื้อปลาไหลย่างรสหวานนุ่มละมุนลิ้น',
      price: 'ประมาณ 1,100 JPY (~253 บาท)'
    },
    {
      location: 'Sekai no Yamachan (นาโกย่า)',
      original: 'Tebasaki',
      phonetic: 'เทบะซากิ',
      thai: 'ปีกไก่ทอดสไตล์นาโกย่าคั่วเกลือและพริกไทยดำสูตรเผ็ดร้อนเบรกแตก กินแกล้มเบียร์อุ่นๆ ฟินเวอร์',
      price: 'ราคาตามเซ็ตกล่องพรีเมียม'
    }
  ];

  // Daily Itinerary Data
  const dailyItinerary = [
    {
      dayNum: 'Day 0',
      title: 'เหินฟ้าข้ามราตรีสู่นาโกย่า',
      date: 'ศุกร์ 22 ม.ค. 2570',
      events: [
        {
          time: '22:00 น.',
          title: 'สตาร์ททริปความสุข',
          desc: 'เดินทางถึง ท่าอากาศยานสุวรรณภูมิ โหลดกระเป๋าสัมภาระ ผ่าน ตม. เตรียมเหินฟ้าไฟลต์บินตรงข้ามคืน (Thai Airways หรือ AirAsia X) หลับชาร์จพลังอุ่นๆ บนเครื่องบินโบยบินข้ามขอบฟ้า',
          payMethod: 'Prepaid (ชำระล่วงหน้าแล้ว)',
          icon: '✈️'
        }
      ]
    },
    {
      dayNum: 'Day 1',
      title: 'แลนดิ้งสู่นาโกย่า - บุกเหนือสู่โทยามะ',
      date: 'เสาร์ 23 ม.ค. 2570',
      events: [
        {
          time: '08:00 น.',
          title: 'แลนดิ้งสนามบินชูบุเซ็นแทรร์ (Chubu Centrair)',
          desc: 'ผ่านพิธีการตรวจคนเข้าเมือง รับสัมภาระเรียบร้อยแล้ว จูงมือน้องภรัณเดินเท้าตามทางเชื่อมอินดอร์ไป Access Plaza เพื่อเตรียมขึ้นรถไฟ (เดินราบเรียบ 5-7 นาที)',
          payMethod: 'Free',
          icon: '🛬'
        },
        {
          time: '09:30 น.',
          title: 'ขบวนรถด่วนทอง μ-SKY (มิวสกาย)',
          desc: 'กระโดดขึ้นขบวนรถไฟด่วนพิเศษสีทอง μ-SKY วิ่งดิ่งตรงเข้าสถานี Meitetsu Nagoya Station รวดเร็วทันใจใน 28 นาที',
          payMethod: 'Prepaid จองล่วงหน้า (ผู้ใหญ่ ¥1,250 (~288 บาท) / ลูกใช้สิทธิ์เด็ก)',
          icon: '🚄'
        },
        {
          time: '10:30 น.',
          title: 'ล็อคบัตรเด็ก Toica และช้อป Ekiben พรีเมียม',
          desc: 'เดินเชื่อมตึกไปที่ JR Ticket Office ณ สถานี JR Nagoya ยื่นพาสปอร์ตจริงน้องภรัณทำบัตร Child IC Card Toica (หักครึ่งราคาอัตโนมัติ) เติมเงินสดเยนตุน ¥3,500 ชิลง่าย แล้วเลือกซื้อข้าวกล่องรถไฟอุ่นๆ พกขึ้นรถด่วน',
          payMethod: 'Cash (เติมบัตรลูก ¥3,500) & แตะ Pasmo ซื้อเบนโตะ',
          icon: '🎟️'
        },
        {
          time: '11:45 น.',
          title: 'รถไฟด่วน JR Limited Express Hida (นาโกย่า -> โทยามะ)',
          desc: 'ขบวนรถออกเดินทางชานชาลาที่ 11 วิ่งเลาะภูเขาลำธารเกาะหิมะขาวสวยงามสะกดสายตา แนะนำเลือกที่นั่งฝั่งขวา (ที่นั่งแถว D) เพื่อวิวหุบเขาที่สวยที่สุด และให้น้องภรัณนอนหลับสบายในแอร์อุ่นๆ ยาว 3 ชม. 50 นาที',
          payMethod: 'Prepaid จองออนไลน์ล่วงหน้า (ผู้ใหญ่ ¥7,230 (~1,663 บาท))',
          icon: '🚄'
        },
        {
          time: '15:45 น.',
          title: 'วาร์ปเข้าเช็คอิน Onyado Nono Toyama',
          desc: 'แลนดิ้งสถานี Toyama เดินออกทางออกทิศใต้ แตะบัตรขึ้นรถราง Loop Line (สายสีขาว) ลงป้าย Kokusai-kaigijo-mae ลากเป๋าเข้าพักเรียวกังแสนหรูหรา ถอดรองเท้าแช่ออนเซนบ่อหินธรรมชาติส่วนตัวในห้องนอนอุ่นฉ่าฟินพ่นควัน',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥210 / เด็ก ¥110)',
          icon: '🏨'
        },
        {
          time: '18:00 น.',
          title: 'ดินเนอร์อภิมหาปูหิมะแดงตัวจริง @ ห้าง MAROOT ชั้น 1',
          desc: 'นั่งรถรางกลับมาสถานีโทยามะ มุดเข้าตึกเชื่อมอินดอร์ พุ่งตัวไปที่ร้านเชฟดัง Toyama Wan Shokudo สั่งปูหิมะแดงสดหวานนึ่งทั้งตัว กุ้งขาวชิโรเอะบิเทมปุระกรอบๆ ของโปรดน้องภรัณ และข้าวหน้าปลาดิบรวมเนื้อฉ่ำหวานเด้งดึ๋ง',
          payMethod: 'Credit Card (รูดปาร์ตี้พรีเมียม)',
          icon: '🦀'
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
          title: 'มื้อเช้าถล่มซีฟู้ดสวรรค์ชั้นตักเอง',
          desc: 'ตื่นนอนก้าวเท้าไปถล่มไลน์บุฟเฟ่ต์ตักไข่ปลาแซลมอน (Ikura) ล้นชาม กุ้งขาวดิบหวานๆ เนื้อปูสดปั้น และทูน่าสับ โปะกี่รอบก็ได้จนอุ่นพุงพาร่างพร้อมลุย',
          payMethod: 'Prepaid (รวมในสิทธิ์จองที่พักแล้ว)',
          icon: '🍣'
        },
        {
          time: '10:00 น.',
          title: 'ศึกสงครามปาหิมะ @ สวนปราสาทโทยามะ',
          desc: 'เดินลุยหิมะเพียง 3 นาทีจากโรงแรมเข้าสวนปราสาท ถ่ายภาพเกล็ดหิมะเกาะสะพานหินฉากหลังปราสาทขาวสวย ปล่อยน้องภรัณพ่นพลังปั๊มรูปเป็ดหิมะ สไลเดอร์เลื่อนหิมะ ปาลูกบอลหิมะสู้กันสุดมัน แล้วมุดเข้าตึกปราสาทชมดาบซามูไรอุ่นๆ',
          payMethod: 'Free (ค่าตั๋วเข้าปราสาทด้านในราคาประหยัด)',
          icon: '🏯'
        },
        {
          time: '14:00 น.',
          title: 'หลบลมหนาวมุดสุ่มโมเดลกาชาปอง',
          desc: 'ขึ้นรถรางกลับมาสถานีโทยามะ มุดห้างอุ่น MAROOT ปล่อยภรัณหมุนตู้กาชาปองโมเดลการ์ตูนลุ้นตัวโปรด แฟนช้อปปิ้งสกินแคร์สูตรเข้มข้นดรักสโตร์ช่วยผิวแห้งกร้านจากลมหนาว',
          payMethod: 'Cash (สำหรับหยอดเหรียญกาชาปอง) / Credit Card (ช้อปปิ้ง)',
          icon: '🧸'
        },
        {
          time: '17:30 น.',
          title: 'ราเมงซุปดำพริกไทยดำเดือดๆ & อุโมงค์ไฟ Snowpiad',
          desc: 'จัดราเมงโชยุน้ำซุปดำพริกไทยร้อนระอุรสเข้มข้นดั้งเดิม ช่วยเรียกเหงื่อสู้หนาว แล้วพากันก้าวเดินก้าวส่องแสงไฟขาวสว่างจ้าสุดโรแมนติกกลางอุโมงค์ไฟขาวหน้าสถานี Toyama Snowpiad White Illumination',
          payMethod: 'Cash (ซดร้อนจ่ายไว)',
          icon: '🍜'
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
          title: 'นั่งรถบัสประจำทางขึ้นเหนือไปสวนสัตว์',
          desc: 'จูงมือน้องภรัณลากจานเลื่อนพลาสติกมาที่ท่ารถบัสหน้าสถานี Toyama Bus Terminal ชานชาลา 16 โดดขึ้นบัสสาย Chihou Railway ยิงตรงสู่จุดหมาย',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥470 (~108 บาท) / เด็กครึ่งราคา ¥240)',
          icon: '🚌'
        },
        {
          time: '10:15 น.',
          title: 'ผจญภัยสโนว์แลนด์สิงสาราสัตว์ @ Toyama Family Park',
          desc: 'เช่าจานเลื่อนหน้าสวนสัตว์ลากภรัณลุยลานหิมะหนาเตอะ นำสไลเดอร์เนินหิมะหวีดเสียงหัวเราะ ส่องนกสายพันธุ์ภูเขา "นกไรโช" ผลัดขนสีขาวน่าเอ็นดู ส่องเสือขาวหิมะและหมีควาย ก่อนมุดซบอุ่นซดข้าวราดแกงกะหรี่ไส้กรอกร้อนๆ ด้านในอาคาร',
          payMethod: 'Cash / แตะ Pasmo (ค่าขนมอาหารกลางวัน)',
          icon: '🐼'
        },
        {
          time: '15:00 น.',
          title: 'นั่งบัสขากลับ - แช่ออนเซนน้ำพุร้อนผ่อนคลายกล้ามเนื้อ',
          desc: 'ขึ้นรถบัสขากลับมาสถานีโทยามะ แวะเดินเชื่อมเข้า Onyado Nono พาครอบครัวถอดเสื้อหนาว แช่น้ำแร่ร้อนออนเซนบ่อหินธรรมชาติ บำรุงผิวพรรณ คลายความเหนื่อยล้าจนกล้ามเนื้อพริ้วไหวเบาสบาย',
          payMethod: 'แตะบัตร Pasmo / Toica ขากลับ',
          icon: '🛀'
        },
        {
          time: '18:00 น.',
          title: 'ดินเนอร์ปาร์ตี้ชาบูหมูดำพรีเมียมเดือดปุดๆ @ ย่าน Sogawa',
          desc: 'เดินก้าวเท้าระยะสั้นๆ ท่ามกลางอุณหภูมิเย็นฉ่ำทะลุเข้าย่านร้านค้า Sogawa นั่งหน้าหม้อดินชาบูจุ่มลวกเนื้อหมูดำญี่ปุ่นสไลด์ติดมันหวานนุ่มละลายในปากฉ่ำซอสงาบดร้อนใจจอยมีความสุขมากสุดๆ',
          payMethod: 'Credit Card',
          icon: '🍲'
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
          title: 'อำลาเมืองหิมะโทยามะ',
          desc: 'เช็คเอาท์เก็บกระเป๋าเรียบร้อย นั่งรถราง Loop Line กลับมาตั้งหลักที่ชานชาลาสถานีรถไฟ Toyama',
          payMethod: 'แตะ Pasmo / Toica (¥210)',
          icon: '🚃'
        },
        {
          time: '10:00 น.',
          title: 'ขบวนรถด่วนชมวิวหิมะกลับนาโกย่า',
          desc: 'ขึ้นขบวนรถไฟด่วน JR Limited Express Hida กลับสู่นาโกย่า เลือกนั่งฝั่งซ้าย (ที่นั่งแถว A) เพื่อเพลิดเพลินวิวเกล็ดหิมะสลับสายน้ำใสไหลเอื่อยริมโขดผาหินระยิบระยับเลาะขากลับ',
          payMethod: 'Prepaid จองออนไลน์ล่วงหน้า (ผู้ใหญ่ ¥7,230 (~1,663 บาท))',
          icon: '🚄'
        },
        {
          time: '14:00 น.',
          title: 'เช็คอิน รร. หรูพิกัดทอง The Cypress Mercure Hotel Nagoya',
          desc: 'ลากกระเป๋าเดินทางแสนสะดวกสบายจากทางออก Sakura-dori Exit สถานีนาโกย่า เพียง 4 นาทีถึงหน้าโรงแรมหรูสไตล์ยุโรปคลาสสิก เข้าห้อง Standard Twin ขนาดกว้างขวาง 25 ตร.ม. จัดเตียงชนกันแบบ Hollywood Twin กว้างขวาง 8 ฟุตฟินๆ',
          payMethod: 'Prepaid จองล่วงหน้าแล้ว',
          icon: '🏨'
        },
        {
          time: '15:30 น.',
          title: 'เดินเล่นชิลๆ ใต้ทางเดินใต้ดินอบอุ่น',
          desc: 'พาน้องภรัณเดินเดินจูงมือชมวิถีคนเมืองนาโกย่า แอร์อุ่นพัดสบายใต้ทางเดินใต้ดินสถานี แวะร้านเบเกอรี่หอมกรุ่น ถือแก้วโกโก้ร้อนจิบแสนอบอุ่นคลายไอเย็น',
          payMethod: 'Pasmo / Toica',
          icon: '🛍️'
        },
        {
          time: '18:00 น.',
          title: 'ทงคัตสึทองคำราดซอสเดือดสะใจใต้ดินสถานี',
          desc: 'ดิ่งเข้าร้านทงคัตสึทอดกรอบคัดเกรดพรีเมียมใต้ตึกทาวเวอร์สถานี Nagoya สั่งชุดข้าวหมูชุบเกล็ดขนมปังทอดกรอบนุ่มฉ่ำ ซุปข้าวเติมฟรีอิ่มคุ้มราคาประหยัดตังค์ฉลุย',
          payMethod: 'Credit Card',
          icon: '🥩'
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
          desc: 'จูงมือเข้าคาเฟ่ชื่อดังนาโกย่า สั่งกาแฟ/เครื่องดื่มร้อนอร่อยๆ แถมฟรีขนมปังปิ้งทาเนยป้ายถั่วแดงเนื้อเนียนละมุนลิ้น อิ่มเซฟงบสบายท้อง',
          payMethod: 'Pasmo / Toica',
          icon: '☕'
        },
        {
          time: '10:15 น.',
          title: 'ผจญภัยอวาเรียมใต้วารี @ Port of Nagoya Public Aquarium',
          desc: 'เดินทางโดยรถไฟใต้ดินลงสถานีสุดสาย Nagoyako บุกตึกส่องบอสใหญ่ วาฬเพชฌฆาต (Orca) และวาฬเบลูก้าขาวกลมปุ๊ก ตื่นตาโชว์โลมาผาดโผนเหินเวหา และชมอุโมงค์พายุฝูงปลาซาร์ดีนนับล้านประกอบแสงสีตระการตา ปิดท้ายทักทายแก๊งเพนกวินจักรพรรดิน่ารัก',
          payMethod: 'รถใต้ดิน: แตะบัตร (¥270) / ค่าเข้า: รูดบัตรเครดิต (ผู้ใหญ่ ¥2,030 / เด็ก ¥1,010)',
          icon: '🐬'
        },
        {
          time: '18:30 น.',
          title: 'ดินเนอร์กระทะร้อนซอสเต้าเจี้ยวแดงพ่นไฟ @ ร้าน Yabaton',
          desc: 'พุ่งตัวกลับมาสถานีนาโกย่า ดิ่งเจ้าร้านโลโก้หมูพ่นไฟอันโด่งดัง สั่ง Teppan Tonkatsu หมูทอดเสิร์ฟบนแผ่นเหล็กกระทะร้อนฉ่าพวยพวัน ราดซอสมิโซะเต้าเจี้ยวแดงสูตรเข้มข้นคลุกข้าวสวยร้อนๆ กินลืมเหนื่อย',
          payMethod: 'Credit Card',
          icon: '🐷'
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
          title: 'มุ่งหน้าสวนสัตว์หุบเขา Higashiyama',
          desc: 'ขึ้นรถไฟใต้ดินสายสีเหลือง Higashiyama Line นั่งยาวม้วนเดียวไม่ต้องสลับสาย ลงป้ายสถานี Higashiyama Koen ทางออก 3 เดินเหยียบก็ถึงสวนสัตว์ทางเข้า',
          payMethod: 'แตะบัตร Pasmo / Toica (ผู้ใหญ่ ¥240 / เด็ก ¥120)',
          icon: '🚇'
        },
        {
          time: '10:00 น.',
          title: 'ตะลุยป่ารักสัตว์ป่า @ Higashiyama Zoo & Botanical Gardens',
          desc: 'บุกกรงดาราดัง กอริลลานายแบบเก็กหล่อ Shabani ท่าทางสุดคูล พาน้องภรัณลานเด็กสัมผัสป้อนอาหารหนูแกสบี้แสนเชื่อง (มีจุดน้ำอุ่นล้างมือบริการน้องนิ้วไม่ชาเกร็ง) นั่งขบวนรถไฟลอยฟ้าสั้นแอร์อุ่นส่องมุมสูงสัตว์ยักษ์เซฟพลังลูกรัก',
          payMethod: 'แตะบัตร / Cash ค่าตั๋ว (ผู้ใหญ่ ¥500 / น้องภรัณเข้าฟรีพิเศษ!)',
          icon: '🦁'
        },
        {
          time: '14:30 น.',
          title: 'หลับพักฟื้นชาร์จพลังงานบนเตียงอุ่น รรร. Mercure',
          desc: 'นั่งรถใต้ดินขากลับพากันเข้าห้องพัก นอนเหยียดตัวคลายความหนาว อบอุ่นร่างกายเต็มที่ ป้องกันลูกชายนอนตากลมจนเหนื่อยจับไข้หัวหนาวพังพินาศสู้ทริปต่อไม่ได้',
          payMethod: 'Free (เวลาคุณภาพครอบครัว)',
          icon: '🛌'
        },
        {
          time: '18:00 น.',
          title: 'ราชาปลาไหลย่างเตาถ่านควันอบอวล @ ร้าน Atsuta Horaiken',
          desc: 'พาก้าวเดินชิลสู่อภิมหาร้านข้าวหน้าปลาไหลในตำนานร้อยปีของเมือง สั่ง Hitsumabushi ข้าวปลาไหลย่างกรอบนอกนุ่มใน คลุกวาซาบิเคี้ยวคู่ต้นหอมเทราดน้ำซุปดะชิอุ่น และ Umaki ไข่ม้วนไส้ปลาไหลแสนหวานกลมกล่อม',
          payMethod: 'Credit Card',
          icon: '🍱'
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
          title: 'ตะลุยสตรีทฟู้ดใต้โดมใสไม่มีลมหนาว @ ตลาดคนเดิน Osu',
          desc: 'ไหว้พระวัดไม้เก่าแก่ Osu Kannon เสริมสิริมงคล แล้วเดินเพลินใต้หลังคาโดมใสไร้ลมตีหน้า สอยของเล่น วินเทจ แฟนแฮปปี้ช้อปเสื้อผ้า สอดส่องแวะกัดดังโงะเนยปิ้งควันกรุ่น ไก่ทอดกรอบเสียบไม้ควันฟูรสชาติเผ็ดร้อนสะใจ',
          payMethod: 'แตะ Pasmo รถไฟฟ้า (¥240) / เงินสดสตรีทฟู้ด',
          icon: '🏮'
        },
        {
          time: '14:30 น.',
          title: 'บุกยานอวกาศลอยฟ้าสอยโมเดล @ Oasis 21',
          desc: 'เดินทางมา Sakae บุกชั้นใต้ดินเข้าร้าน Jump Shop สอยของเล่นการ์ตูน Dragon Ball แท้ลิขสิทธิ์ฝากภรัณ ขึ้นลิฟต์แก้วดาดฟ้า Spaceship-Aqua ส่องสายน้ำสลับทีวีทาวเวอร์แสงไฟตระการตาครอบครัวสุดรักเก๋กู้ด',
          payMethod: 'แตะ Pasmo รถไฟฟ้า (¥220) / รูดบัตรค่าโมเดลฟินๆ',
          icon: '🛸'
        },
        {
          time: '17:00 น.',
          title: 'ตะลุยล่ารองเท้า On Cloud + ทำ Tax Free ใต้ตึกที่พัก',
          desc: 'ก้าวขาสับเข้า Bic Camera ชั้น 9-10 บนห้าง JR Gate Tower ติดกับตึกโรงแรมเราเป๊ะๆ ลากสอยสวม On Cloud ยื่นพาสปอร์ตรับเงินคืนภาษีทันที 10% พร้อมแถมคูปองส่วนลดพิเศษ 7% รูดแฮปปี้เซฟกระเป๋าพ่อหนักแน่นมาก',
          payMethod: 'Credit Card',
          icon: '👟'
        },
        {
          time: '18:30 น.',
          title: 'ปาร์ตี้ส่งท้ายทริปสุดอบอุ่นโบกปีกไก่ @ ห้องพัก Mercure',
          desc: 'หิ้วปีกไก่ทอดพริกไทยแซ่บเผ็ดลืมโลก Sekai no Yamachan ข้าวผัด เกี๊ยวซ่าแสนอร่อย และเบียร์กระป๋องอุ่นๆ ขึ้นไปจัดปิกนิกกอดวงครอบครัว อบอุ่นท่ามกลางวิวนครแสงไฟนาโกย่าแสนโรแมนติกซาบซึ้งใจสามคน',
          payMethod: 'Credit Card / Pasmo',
          icon: '🍗'
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
          desc: 'เช็คเอาท์อำลา รร. Mercure ลากเป๋าระยะ 4 นาทีเข้าชานชาลา Meitetsu Nagoya นั่งรถด่วนพิเศษ μ-SKY ยิงยาวรวดเดียวถึงสนามบิน Chubu Centrair ใน 28 นาที',
          payMethod: 'Prepaid (ผู้ใหญ่ ¥1,250 (~288 บาท))',
          icon: '🚄'
        },
        {
          time: '10:15 น.',
          title: 'วิ่งสาดพลังลอดปีกโบอิ้ง @ Flight of Dreams',
          desc: 'โหลดกระเป๋าสัมภาระเรียบร้อยแล้ว พาลูกรักพุ่งตรงเข้าสนามเด็กเล่นอุ่นอินดอร์ขนาดยักษ์ Flight of Dreams ปล่อยน้องภรัณปีนป่ายตาข่ายวิบาก ผจญภัยใต้เครื่องบิน Boeing 787 จริงแสนยิ่งใหญ่อลังการ วิ่งละเลงพลังงานเฮือกสุดท้ายก่อนขึ้นเครื่อง พ่อแม่นั่งจิบโกโก้ร้อนดูรอยยิ้มลูกรักสุขใจสุดพลัง',
          payMethod: 'Credit Card / Pasmo คาเฟ่ของกินเล่นส่งท้าย',
          icon: '✈️'
        },
        {
          time: '16:00 น.',
          title: 'ร่อนจอดสุวรรณภูมิโดยสวัสดิภาพแสนสมบูรณ์แบบ',
          desc: 'โดดขึ้นเครื่องบินบินตรง บินเหนือน่านฟ้า ร่อนจอดท่าอากาศยานสุวรรณภูมิ ร่างกายสมบูรณ์ แฟนแฮปปี้ใจฟู น้องภรัณเปี่ยมความทรงจำลุยฝ่าเกล็ดหิมะแรก และคุมงบประมาณใช้จ่ายได้สมบูรณ์แบบไม่บานปลายสักบาทเดียวเทอ!',
          payMethod: 'Prepaid (บินอุ่นหัวใจกลับบ้าน)',
          icon: '🛬'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-900 pb-16">
      {/* Snowy Header Decor */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 py-12 px-6 border-b border-cyan-500/20 shadow-xl">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-300 via-blue-500 to-transparent pointer-events-none"></div>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
          <div className="text-center md:text-left">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
              ❄️ ทริปครอบครัวสุดพรีเมียม 9 วัน 8 คืน
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              คัมภีร์ลุยหิมะฉบับพกพา: นาโกย่า - โทยามะ
            </h1>
            <p className="text-slate-400 text-sm md:text-base">
              ออกแบบพิเศษเพื่อ <span className="text-cyan-300 font-semibold">คุณหมอบัน แฟน และน้องภรัณ</span> • ขนส่งสาธารณะ {"$100\\%$"} • คุมงบสุดเป๊ะ
            </p>
          </div>

          {/* Real-time Countdown and Stats */}
          <div className="bg-slate-950/60 backdrop-blur border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[280px]">
            <span className="text-xs text-slate-400 mb-1 font-medium">⏳ นับถอยหลังสู่วันเดินทาง (22 ม.ค. 2570)</span>
            <div className="flex gap-2 text-center">
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <span className="text-xl font-bold text-cyan-400">{timeLeft.days}</span>
                <p className="text-[10px] text-slate-500 uppercase">วัน</p>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <span className="text-xl font-bold text-cyan-400">{timeLeft.hours}</span>
                <p className="text-[10px] text-slate-500 uppercase">ชม.</p>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <span className="text-xl font-bold text-cyan-400">{timeLeft.minutes}</span>
                <p className="text-[10px] text-slate-500 uppercase">นาที</p>
              </div>
              <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-cyan-500/20">
                <span className="text-xl font-bold text-cyan-400">{timeLeft.seconds}</span>
                <p className="text-[10px] text-slate-500 uppercase">วิ</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 bg-slate-950 p-2 rounded-2xl border border-slate-800">
          {[
            { id: 'dashboard', label: '📊 แดชบอร์ด & เลขาเตือนภัย', icon: '🚨' },
            { id: 'bookings', label: '🔔 จองล่วงหน้า (Pre-Book)', icon: '🗓️' },
            { id: 'ic_packing', label: '🎒 บัตร IC & จัดกระเป๋า', icon: '📦' },
            { id: 'itinerary', label: '🗓️ แผนเที่ยวรายวัน', icon: '🚇' },
            { id: 'food', label: '🍣 ตารางอาหารเด็ด', icon: '🥢' },
            { id: 'budget', label: '💰 เครื่องคำนวณงบ', icon: '💸' },
            { id: 'chat', label: '💬 AI Simulator แชท', icon: '📱' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-bold'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard & Alerts Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">งบประมาณรวมทั้งสิ้น</h3>
                <p className="text-3xl font-black text-white">{"$"}{calculatedTotal.toLocaleString()}{"$"}</p>
                <div className="mt-2 text-xs flex items-center justify-between text-slate-400">
                  <span>เป้าหมายงบไม่เกิน: {"$"}{totalBudgetLimit.toLocaleString()}{"$"} THB</span>
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
                        ตารางการเดินทางของเทอระบุว่าจองโรงแรม <strong>The Cypress Mercure Hotel Nagoya (5 คืน)</strong> ตั้งแต่วันที่ <strong>26 ม.ค. ถึง 30 ม.ค. 2570</strong> แต่ถ้านับวันจริงๆ (เช็คอิน 26 บ่าย - เช็คเอาท์ 30 เช้า) จะมีเพียง <strong>4 คืนเท่านั้นจ้าเทอ!</strong> แปลว่าเทอจองจริงแค่ 4 คืนก็รอดสบายใจเฉิบแล้ว ซึ่งจะช่วยเซฟค่าที่พักลงไปได้อีกประมาณ <strong>{"$4,500 - 5,500$"} บาทเลยนะ!</strong> เอาไปสอย On Cloud หรือของเล่นให้น้องภรัณเพิ่มได้สบายบรื๋อ!
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">2. ☃️ ความท้าทายพายุหิมะโทยามะ:</span>
                      <span>
                        ปลายเดือนมกราคมคือช่วงพีคที่สุดของฤดูหนาวในภูมิภาคโฮคุริคุ หิมะตกหนามาก {"$100\\%$"} แนะนำอย่างยิ่งให้เตรียม <strong>รองเท้าบู้ทกันหนาวชนิดสเปกลุยลานหิมะและกันน้ำ (Waterproof)</strong> ทั้ง 3 คนพ่อแม่ลูก เพราะรองเท้าวิ่งผ้าใบธรรมดาจะเปียกชื้นทันทีเมื่อเกล็ดหิมะละลาย และจะนำพาความหนาวเย็นทะลวงผิวหนังจนหมดสนุกเทอ!
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

        {/* Pre-Booking Tracker Tab */}
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
                      <span className="text-[10px] text-slate-500">พิมพ์ส่งช่อง Special Request หลังจองเสร็จเพื่อให้เตียงคู่ดันชิดกันเกือบ {"$220 - 240 \\text{ cm}$"}</span>
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

        {/* IC Cards & Packing Checklists Tab */}
        {activeTab === 'ic_packing' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* IC Card Masterclass */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 h-fit">
              <div className="border-b border-slate-800 pb-3">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📱</span> บัตรโดยสารดิจิทัล & วิธีแตะเงิน (IC Card Masterclass)
                </h2>
                <p className="text-xs text-slate-400 mt-1">เดินทางขนส่งสาธารณะ {"$100\\%$"} เน้นสะดวกและรวดเร็วสูงสุดเทอ</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <span className="bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[10px] font-bold">พ่อหมอบัน (เทอ) & แม่แม่ (แฟน)</span>
                  <h3 className="font-bold text-white mt-1">สาย Apple Wallet บน iPhone</h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    • บัตรแนะนำ: ผูกและเปิดใช้บัตร <strong>Pasmo หรือ Suica</strong> ใน Apple Wallet ดึงเงินจากบัตรเก่าได้ทันที <br />
                    • เงินตุนที่ต้องเติม: <span className="text-cyan-300 font-bold">เติมจากไทยคนละ {"$7,000$"} เยน</span> (รวม 2 คน = {"$14,000$"} เยน / ~{"$3,220$"} บาท) <br />
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
                    • เงินตุนที่ต้องเติม: <span className="text-cyan-300 font-bold">เติมตุนเงินสดไว้เพียง {"$3,500$"} เยน</span> (~{"$805$"} บาท) พอดีเทอ เพราะลูกถูกคิดหักเงินแค่ครึ่งเดียวของพ่อแม่ (ถ้าตังค์หมด หยอดเหรียญเพิ่มที่เครื่องตามตู้สถานีใต้ดินได้เลย)
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

        {/* Detailed Daily Schedule Tab */}
        {activeTab === 'itinerary' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>📅</span> แผนการเดินทางรายวันอย่างละเอียด
              </h2>
              <p className="text-sm text-slate-400 mt-1">เลือกวันที่ที่ต้องการดูรายละเอียดเพื่อความสะดวกยามพกพาเดินสับหน้างานจ้า</p>
            </div>

            {/* Day Selector */}
            <div className="flex flex-wrap gap-2">
              {dailyItinerary.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeDay === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="text-[10px] uppercase opacity-75">{day.dayNum}</div>
                  <div>{day.date.split(' ').slice(0, 2).join(' ')}</div>
                </button>
              ))}
            </div>

            {/* Active Day Content */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
                <div>
                  <span className="text-xs text-cyan-400 font-bold uppercase tracking-widest">{dailyItinerary[activeDay].dayNum}</span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">{dailyItinerary[activeDay].title}</h3>
                </div>
                <span className="bg-slate-900 text-slate-300 text-xs font-semibold px-3 py-1 rounded-full border border-slate-800">
                  {dailyItinerary[activeDay].date}
                </span>
              </div>

              {/* Event Timeline */}
              <div className="relative border-l-2 border-slate-800 pl-6 ml-4 space-y-8">
                {dailyItinerary[activeDay].events.map((event, eventIdx) => (
                  <div key={eventIdx} className="relative group">
                    {/* Time Dot Icon */}
                    <span className="absolute -left-10 top-0.5 bg-slate-900 border border-cyan-500/50 rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md group-hover:border-cyan-400 transition-colors">
                      {event.icon}
                    </span>
                    
                    {/* Time and Title */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-bold text-sm tracking-wide bg-cyan-505/10 px-2 py-0.5 rounded border border-cyan-500/20">{event.time}</span>
                        <h4 className="font-extrabold text-white text-base">{event.title}</h4>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
                      {event.desc}
                    </p>

                    {/* Pay Method Info */}
                    <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
                      <span className="text-emerald-400 font-semibold">💳 วิธีชำระเงิน/ค่าใช้จ่าย:</span>
                      <span>{event.payMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Food Menu Tab (Translation and Pronunciation Tables) */}
        {activeTab === 'food' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🍣</span> สวรรค์นักกิน: สรุปตารางเมนูเด็ดพร้อมคำอ่านภาษาไทย
              </h2>
              <p className="text-xs text-slate-400 mt-1">ตามรีเควสต์ของคุณหมอบัน สรุปเมนูอาหารแปลไทยพร้อมคำอ่านและราคาเรียบร้อย ยื่นโชว์ให้บริกรญี่ปุ่นดูเพื่อสั่งได้เลย!</p>
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

        {/* Budget Controller Tab */}
        {activeTab === 'budget' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>💰</span> เครื่องคำนวณและควบคุมงบประมาณ (Interactive Budget Controller)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                อัตราแลกเปลี่ยนคำนวณเฉลี่ยด้วย {"$100 \\text{ JPY} \\approx 23 \\text{ THB}$"} (สามารถคลิกปรับเปลี่ยนตัวเลขเพื่อทดลองวางแผนจริงได้เทอ!)
              </p>
            </div>

            {/* Budget Sliders / Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Flight Input */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                    <span>✈️ 1. ตั๋วเครื่องบิน (3 คน พ่อแม่ลูก):</span>
                    <span className="text-cyan-400">{"$"}{customBudget.flight.toLocaleString()}{"$"} บาท</span>
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
                    <span className="text-cyan-400">{"$"}{customBudget.hotel.toLocaleString()}{"$"} บาท</span>
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
                    <span className="text-cyan-400">{"$"}{customBudget.transport.toLocaleString()}{"$"} บาท</span>
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
                    <span className="text-cyan-400">{"$"}{customBudget.food.toLocaleString()}{"$"} บาท</span>
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
                    <span className="text-cyan-400">{"$"}{customBudget.entrance.toLocaleString()}{"$"} บาท</span>
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
                    <span className="text-cyan-400">{"$"}{customBudget.shopping.toLocaleString()}{"$"} บาท</span>
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
              <p className="text-4xl font-black text-white">{"$"}{calculatedTotal.toLocaleString()}{"$"} THB</p>
              
              {/* Progress Indicator */}
              <div className="w-full bg-slate-900 rounded-full h-3 max-w-md mx-auto border border-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${calculatedTotal <= totalBudgetLimit ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.min((calculatedTotal / totalBudgetLimit) * 100, 100)}%` }}
                ></div>
              </div>

              <p className={`text-xs font-bold ${calculatedTotal <= totalBudgetLimit ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculatedTotal <= totalBudgetLimit 
                  ? `✓ ยอดเงินเฉลี่ยต่อคนตกคนละ $${Math.round(calculatedTotal / 3).toLocaleString()}$ บาท ซึ่งอยู่ในกรอบวงเงินแสนแปดเทอ คุมงบได้ยอดเยี่ยม!`
                  : `⚠ งบรวมทะลุเป้าแสนแปดแล้วเทอ! ลองลดงบโรงแรมหรืองบช้อปปิ้งลงหน่อยน้า`
                }
              </p>
            </div>
          </div>
        )}

        {/* AI Simulator Chat Box Tab */}
        {activeTab === 'chat' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="border-b border-slate-800 pb-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>📱</span> คีย์โน้ตเลขาคู่คิดคุยถาม Gemini AI Simulator หน้างาน
                </h2>
                <p className="text-xs text-slate-400 mt-1">คลิกปุ่มค้นหาด่วนข้างล่างเพื่อเรียกข้อมูลหรือถามเลขาด้วยภาษาธรรมชาติได้ทันทีเทอ!</p>
              </div>
              <span className="bg-cyan-500/10 text-cyan-400 text-[10px] font-bold px-2 py-1 rounded border border-cyan-500/20 uppercase tracking-widest">
                Active 24/7
              </span>
            </div>

            {/* Search Suggestions */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'ปูโทยามะห้าง MAROOT กินร้านไหนดีนะเทอ 🦀', text: 'ปูโทยามะห้าง MAROOT กินร้านไหนดีนะเทอ' },
                { label: 'ขึ้นรถบัสป้าย 16 ไปสวนสัตว์ Family Park แปะจ่ายบัตรยังไง 🚌', text: 'ขึ้นรถบัสป้าย 16 ไปสวนสัตว์ Family Park แปะจ่ายบัตรยังไง' },
                { label: 'วิธีก๊อปปี้โน้ตทักรีเควสต์เตียงชิด Hollywood Twin 🛏️', text: 'วิธีก๊อปปี้โน้ตทักรีเควสต์เตียงชิด Hollywood Twin' }
              ].map((sugg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(sugg.text)}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs px-3 py-2 rounded-xl transition-all"
                >
                  {sugg.label}
                </button>
              ))}
            </div>

            {/* Chat History View */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 h-[320px] overflow-y-auto space-y-4 font-sans text-xs">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3.5 space-y-1 ${
                    chat.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-line leading-relaxed">{chat.text}</p>
                    <span className={`block text-[9px] text-right ${chat.sender === 'user' ? 'text-slate-950/70' : 'text-slate-500'}`}>
                      {chat.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Inputs */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="พิมพ์ถามเรื่องพายุหิมะ รถไฟ หรือคำขอพิเศษเตียงเด็ก..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-950 border border-slate-800 text-xs rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
              >
                ถามเลย
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
