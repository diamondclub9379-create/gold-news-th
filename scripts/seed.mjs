const API_URL = process.env.API_URL || "http://localhost:3001/api/articles";
const API_SECRET = process.env.API_SECRET || "change-this-to-a-random-secret";

const articles = [
  {
    titleEn: "Gold Prices Surge to Record High Amid Global Uncertainty",
    titleTh: "ราคาทองคำพุ่งสูงสุดเป็นประวัติการณ์ ท่ามกลางความไม่แน่นอนของโลก",
    summaryEn: "Gold prices reached a new all-time high of $3,100 per ounce.",
    summaryTh: "ราคาทองคำพุ่งแตะระดับสูงสุดใหม่ตลอดกาลที่ 3,100 ดอลลาร์ต่อออนซ์ เนื่องจากนักลงทุนแห่เข้าหาสินทรัพย์ปลอดภัย",
    bodyTh: "ราคาทองคำทะยานขึ้นสู่ระดับสูงสุดเป็นประวัติการณ์ในวันจันทร์ โดยแตะ 3,100 ดอลลาร์ต่อออนซ์ เนื่องจากนักลงทุนทั่วโลกแห่ซื้อสินทรัพย์ปลอดภัย\nการเพิ่มขึ้นของราคาทองคำมาจากหลายปัจจัย รวมถึงความตึงเครียดทางภูมิรัฐศาสตร์ที่เพิ่มขึ้น การอ่อนค่าของดอลลาร์สหรัฐ และความกังวลเกี่ยวกับภาวะเงินเฟ้อ\nนักวิเคราะห์คาดว่าแนวโน้มขาขึ้นจะยังคงดำเนินต่อไป โดยบางรายคาดการณ์ว่าราคาอาจแตะ 3,500 ดอลลาร์ภายในสิ้นปีนี้",
    sourceUrl: "https://reuters.com/gold-record-high-april-2026",
    sourceName: "Reuters",
    category: "gold",
    imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800",
    publishedAt: "2026-04-01T08:00:00Z",
  },
  {
    titleEn: "Silver Demand Hits 5-Year High as Industrial Use Grows",
    titleTh: "ความต้องการเงินแตะสูงสุดรอบ 5 ปี เนื่องจากการใช้งานภาคอุตสาหกรรมเพิ่มขึ้น",
    summaryEn: "Silver demand surges driven by solar panel manufacturing.",
    summaryTh: "ความต้องการเงินพุ่งสูงขึ้นจากการผลิตแผงโซลาร์เซลล์และอุตสาหกรรมอิเล็กทรอนิกส์",
    bodyTh: "ความต้องการเงินทั่วโลกแตะระดับสูงสุดในรอบ 5 ปี โดยได้แรงหนุนหลักจากภาคอุตสาหกรรม\nการผลิตแผงโซลาร์เซลล์ซึ่งใช้เงินเป็นส่วนประกอบสำคัญ เติบโตขึ้นกว่า 30% ในปีนี้\nนักวิเคราะห์มองว่าแนวโน้มนี้จะยังคงดำเนินต่อไปอีกหลายปี",
    sourceUrl: "https://kitco.com/silver-demand-high-2026",
    sourceName: "Kitco",
    category: "silver",
    publishedAt: "2026-04-01T06:00:00Z",
  },
  {
    titleEn: "Central Banks Continue Gold Buying Spree in Q1 2026",
    titleTh: "ธนาคารกลางทั่วโลกยังคงเร่งซื้อทองคำต่อเนื่องในไตรมาส 1 ปี 2026",
    summaryEn: "Central banks added 290 tonnes of gold to reserves in Q1.",
    summaryTh: "ธนาคารกลางเพิ่มทองคำเข้าคลังสำรอง 290 ตันในไตรมาสแรก",
    bodyTh: "ธนาคารกลางทั่วโลกยังคงเดินหน้าซื้อทองคำอย่างต่อเนื่อง\nจีนและอินเดียเป็นผู้ซื้อรายใหญ่ที่สุด โดยเพิ่มทองคำเข้าคลังสำรองรวมกว่า 150 ตัน\nแนวโน้มการซื้อทองคำของธนาคารกลางเป็นปัจจัยสำคัญที่หนุนราคาทองคำในระยะยาว",
    sourceUrl: "https://bloomberg.com/central-banks-gold-q1-2026",
    sourceName: "Bloomberg",
    category: "gold",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: "2026-03-31T14:00:00Z",
  },
  {
    titleEn: "Silver Price Forecast: Analysts See $40 Target by Year-End",
    titleTh: "คาดการณ์ราคาเงิน: นักวิเคราะห์มองเป้าหมาย 40 ดอลลาร์ ภายในสิ้นปี",
    summaryEn: "Multiple analysts raise silver price targets as demand outpaces supply.",
    summaryTh: "นักวิเคราะห์หลายสำนักปรับเป้าราคาเงินขึ้น เนื่องจากอุปสงค์แซงหน้าอุปทาน",
    bodyTh: "นักวิเคราะห์จากหลายสถาบันการเงินชั้นนำปรับเป้าหมายราคาเงินขึ้นอย่างพร้อมเพรียง\nปัจจัยหลักมาจากอุปสงค์ภาคอุตสาหกรรมที่แข็งแกร่ง โดยเฉพาะจากอุตสาหกรรมพลังงานแสงอาทิตย์\nนอกจากนี้ การลดลงของกำลังการผลิตจากเหมืองเงินรายใหญ่ทำให้อุปทานตึงตัว",
    sourceUrl: "https://kitco.com/silver-forecast-40-target",
    sourceName: "Kitco",
    category: "silver",
    imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=800",
    publishedAt: "2026-03-31T10:00:00Z",
  },
];

async function seed() {
  for (const article of articles) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": API_SECRET,
      },
      body: JSON.stringify(article),
    });
    const data = await res.json();
    console.log(
      res.status,
      data.success ? "OK" : data.error,
      article.titleEn.substring(0, 50)
    );
  }
}

seed();
