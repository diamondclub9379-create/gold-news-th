import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: "เกี่ยวกับ Gold News TH เว็บสรุปตลาดทองคำและเงินสำหรับนักลงทุนไทย",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-yellow-400 mb-8">
        เกี่ยวกับ Gold News TH
      </h1>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">เราคือใคร?</h2>
          <p>
            Gold News TH เป็นเว็บไซต์รวบรวมและสรุปข่าวตลาดทองคำ เงิน
            และโลหะมีค่าจากแหล่งข่าวชั้นนำทั่วโลก เช่น Reuters, Kitco, CNBC, Yahoo Finance
            โดยแปลเป็นภาษาไทยด้วยเทคโนโลยี AI เพื่อให้นักลงทุนไทยเข้าถึงข้อมูลได้รวดเร็ว
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">วัตถุประสงค์</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>รวบรวมข่าวสารตลาดทองคำและเงินจากทั่วโลกไว้ในที่เดียว</li>
            <li>แปลข่าวต่างประเทศเป็นภาษาไทยให้อ่านเข้าใจง่าย</li>
            <li>นำเสนอข้อมูลราคาทองคำ เงิน และสินทรัพย์ที่เกี่ยวข้องแบบเรียลไทม์</li>
            <li>ให้ความรู้เรื่องการเทรดทองคำสำหรับผู้เริ่มต้น</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">เทคโนโลยี AI ที่ใช้</h2>
          <p>
            เนื้อหาข่าวบนเว็บไซต์นี้ถูกแปลจากภาษาอังกฤษเป็นภาษาไทยโดยใช้เทคโนโลยี AI (Artificial Intelligence)
            แม้ว่าเราจะพยายามรักษาความถูกต้องของเนื้อหา แต่การแปลโดย AI
            อาจมีข้อผิดพลาดหรือความคลาดเคลื่อนได้ ผู้อ่านควรอ้างอิงข่าวต้นฉบับเพื่อความถูกต้องสูงสุด
          </p>
        </section>

        <section className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-yellow-400 mb-2">ข้อจำกัดความรับผิดชอบ</h2>
          <p className="text-gray-400">
            เนื้อหาทั้งหมดบนเว็บไซต์นี้มีวัตถุประสงค์เพื่อการให้ข้อมูลและการศึกษาเท่านั้น
            <strong className="text-gray-300"> ไม่ถือเป็นคำแนะนำในการลงทุน</strong>
            การลงทุนในทองคำ เงิน หรือสินทรัพย์ใดๆ มีความเสี่ยง
            ผู้อ่านควรศึกษาข้อมูลอย่างรอบคอบและปรึกษาผู้เชี่ยวชาญด้านการเงินก่อนตัดสินใจลงทุน
            ผลการดำเนินงานในอดีตไม่ได้รับประกันผลในอนาคต
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">ลิงก์แนะนำ (Affiliate)</h2>
          <p className="text-gray-400">
            เว็บไซต์นี้มีลิงก์แนะนำ (Affiliate Links) ไปยัง Broker เช่น Exness และ XM
            เมื่อท่านสมัครผ่านลิงก์เหล่านี้ เว็บไซต์อาจได้รับค่าคอมมิชชั่น
            โดยไม่มีค่าใช้จ่ายเพิ่มเติมสำหรับท่าน
            การแนะนำ Broker เหล่านี้ไม่ถือเป็นคำแนะนำในการลงทุน
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">ติดต่อเรา</h2>
          <p className="text-gray-400">
            หากมีคำถามหรือข้อเสนอแนะ สามารถติดต่อเราได้ที่{" "}
            <a href="mailto:contact@goldnewsth.com" className="text-yellow-400 underline">
              contact@goldnewsth.com
            </a>{" "}
            หรือผ่านทาง{" "}
            <Link href="/contact" className="text-yellow-400 underline">
              หน้าติดต่อเรา
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
