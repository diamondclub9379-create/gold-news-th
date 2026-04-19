import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ข้อกำหนดการใช้งาน",
  description: "ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์ Gold News TH",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-yellow-400 mb-8">
        ข้อกำหนดการใช้งาน (Terms of Service)
      </h1>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">1. การยอมรับข้อกำหนด</h2>
          <p>
            การเข้าใช้งานเว็บไซต์ goldnewsth.com (&quot;เว็บไซต์&quot;) ถือว่าท่านยอมรับข้อกำหนดและเงื่อนไข
            การใช้งานทั้งหมดที่ระบุไว้ในหน้านี้ หากท่านไม่เห็นด้วยกับข้อกำหนดใดๆ
            กรุณาหยุดใช้งานเว็บไซต์ทันที
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">2. ลักษณะของเนื้อหา</h2>
          <p>เนื้อหาบนเว็บไซต์นี้มีลักษณะดังนี้:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>ข่าวสารแปลจากแหล่งข่าวต่างประเทศโดยใช้เทคโนโลยี AI</li>
            <li>ข้อมูลราคาทองคำ เงิน และสินทรัพย์อื่นๆ จากแหล่งข้อมูลภายนอก</li>
            <li>บทความให้ความรู้เรื่องการเทรดและการลงทุน</li>
          </ul>
        </section>

        <section className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-400 mb-2">3. ข้อจำกัดความรับผิดชอบด้านการลงทุน</h2>
          <p className="text-gray-400">
            <strong className="text-gray-300">เนื้อหาทั้งหมดบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการให้ข้อมูลและการศึกษาเท่านั้น
            ไม่ถือเป็นคำแนะนำในการลงทุนไม่ว่ากรณีใดๆ</strong>
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>การลงทุนในทองคำ เงิน Forex และ CFD มีความเสี่ยงสูง ท่านอาจสูญเสียเงินลงทุนทั้งหมด</li>
            <li>ผลการดำเนินงานในอดีตไม่ได้รับประกันผลในอนาคต</li>
            <li>ท่านควรปรึกษาผู้เชี่ยวชาญด้านการเงินก่อนตัดสินใจลงทุน</li>
            <li>เว็บไซต์ไม่รับผิดชอบต่อความเสียหายจากการตัดสินใจลงทุนของท่าน</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">4. ความถูกต้องของเนื้อหา</h2>
          <p>
            เนื้อหาข่าวบนเว็บไซต์แปลโดย AI ซึ่งอาจมีข้อผิดพลาดหรือความคลาดเคลื่อนได้
            เราไม่รับประกันความถูกต้อง ความครบถ้วน หรือความเป็นปัจจุบันของข้อมูลใดๆ
            ท่านควรตรวจสอบข้อมูลกับแหล่งข่าวต้นฉบับก่อนนำไปใช้
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">5. ลิงก์แนะนำ (Affiliate Links)</h2>
          <p>
            เว็บไซต์มีลิงก์แนะนำ (Affiliate Links) ไปยังผู้ให้บริการเทรดออนไลน์
            เมื่อท่านสมัครผ่านลิงก์เหล่านี้ เว็บไซต์อาจได้รับค่าคอมมิชชั่น
            โดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับท่าน
            ลิงก์เหล่านี้จะมีการระบุอย่างชัดเจนว่าเป็น &quot;Affiliate Link&quot;
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">6. ลิขสิทธิ์</h2>
          <p>
            ข่าวต้นฉบับเป็นลิขสิทธิ์ของแหล่งข่าวนั้นๆ เว็บไซต์นี้ให้บริการแปลและสรุปข่าว
            พร้อมลิงก์อ้างอิงกลับไปยังแหล่งข่าวต้นฉบับ
            หากเจ้าของลิขสิทธิ์ต้องการให้นำเนื้อหาออก กรุณาติดต่อเราที่{" "}
            <a href="mailto:contact@goldnewsth.com" className="text-yellow-400 underline">
              contact@goldnewsth.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">7. ข้อมูลราคาและข้อมูลตลาด</h2>
          <p>
            ข้อมูลราคาทองคำ เงิน และสินทรัพย์อื่นๆ ที่แสดงบนเว็บไซต์เป็นข้อมูลอ้างอิงเท่านั้น
            อาจมีความล่าช้าหรือคลาดเคลื่อนจากราคาตลาดจริง
            ไม่ควรใช้เป็นข้อมูลหลักในการตัดสินใจซื้อขาย
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">8. การเปลี่ยนแปลงข้อกำหนด</h2>
          <p>
            เราขอสงวนสิทธิ์ในการเปลี่ยนแปลงข้อกำหนดการใช้งานได้ตลอดเวลาโดยไม่ต้องแจ้งล่วงหน้า
            การใช้งานเว็บไซต์ต่อหลังจากมีการเปลี่ยนแปลง ถือว่าท่านยอมรับข้อกำหนดใหม่
          </p>
        </section>

        <p className="text-gray-500 text-xs pt-4 border-t border-gray-800">
          ปรับปรุงล่าสุด: เมษายน 2026
        </p>
      </div>
    </div>
  );
}
