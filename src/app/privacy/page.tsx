import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัวของ Gold News TH",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-yellow-400 mb-8">
        นโยบายความเป็นส่วนตัว (Privacy Policy)
      </h1>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">1. ข้อมูลทั่วไป</h2>
          <p>
            Gold News TH (&quot;เว็บไซต์&quot;) ที่ดำเนินงานภายใต้โดเมน goldnewsth.com
            ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน
            นโยบายนี้อธิบายถึงวิธีการเก็บรวบรวม ใช้ และปกป้องข้อมูลของท่าน
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">2. ข้อมูลที่เราเก็บรวบรวม</h2>
          <p>เราอาจเก็บรวบรวมข้อมูลต่อไปนี้โดยอัตโนมัติเมื่อท่านเข้าชมเว็บไซต์:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>ที่อยู่ IP และข้อมูลตำแหน่งโดยประมาณ</li>
            <li>ประเภทเบราว์เซอร์และอุปกรณ์</li>
            <li>หน้าเว็บที่เข้าชมและระยะเวลาที่ใช้</li>
            <li>แหล่งที่มาของการเข้าชม (Referral URL)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">3. การใช้ Google Analytics</h2>
          <p>
            เว็บไซต์นี้ใช้ Google Analytics 4 เพื่อวิเคราะห์การใช้งานเว็บไซต์
            Google Analytics ใช้คุกกี้เพื่อเก็บรวบรวมข้อมูลแบบไม่ระบุตัวตน
            ข้อมูลเหล่านี้ช่วยให้เราเข้าใจพฤติกรรมการใช้งานและปรับปรุงเว็บไซต์
            ท่านสามารถอ่านรายละเอียดเพิ่มเติมได้ที่{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              นโยบายความเป็นส่วนตัวของ Google
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">4. การใช้ Google AdSense</h2>
          <p>
            เว็บไซต์นี้อาจแสดงโฆษณาจาก Google AdSense ซึ่งใช้คุกกี้เพื่อแสดงโฆษณาที่เกี่ยวข้อง
            Google อาจใช้ข้อมูลการเข้าชมเว็บไซต์ของท่านเพื่อแสดงโฆษณาที่ตรงกับความสนใจ
            ท่านสามารถจัดการการตั้งค่าโฆษณาได้ที่{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-400 underline"
            >
              การตั้งค่าโฆษณาของ Google
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">5. คุกกี้ (Cookies)</h2>
          <p>
            เว็บไซต์นี้ใช้คุกกี้เพื่อวัตถุประสงค์ในการวิเคราะห์และแสดงโฆษณา
            ท่านสามารถปิดการใช้งานคุกกี้ได้ผ่านการตั้งค่าเบราว์เซอร์ของท่าน
            อย่างไรก็ตาม การปิดคุกกี้อาจส่งผลกระทบต่อการใช้งานบางส่วนของเว็บไซต์
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">6. การปกป้องข้อมูล</h2>
          <p>
            เราไม่ขาย แลกเปลี่ยน หรือถ่ายโอนข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก
            ยกเว้นผู้ให้บริการที่เชื่อถือได้ซึ่งช่วยดำเนินงานเว็บไซต์ของเรา
            ภายใต้เงื่อนไขว่าพวกเขาต้องรักษาความลับของข้อมูลดังกล่าว
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">7. สิทธิ์ของผู้ใช้</h2>
          <p>ท่านมีสิทธิ์ในการ:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>ขอเข้าถึงข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</li>
            <li>ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
            <li>ขอลบข้อมูลส่วนบุคคลของท่าน</li>
            <li>ปฏิเสธการเก็บรวบรวมข้อมูลผ่านคุกกี้</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">8. ข้อจำกัดความรับผิดชอบ</h2>
          <p>
            เนื้อหาข่าวบนเว็บไซต์นี้แปลโดย AI จากแหล่งข่าวต่างประเทศ
            มีวัตถุประสงค์เพื่อการให้ข้อมูลและการศึกษาเท่านั้น
            ไม่ถือเป็นคำแนะนำในการลงทุน ผู้อ่านควรใช้วิจารณญาณในการตัดสินใจลงทุนด้วยตนเอง
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">9. การเก็บรักษาข้อมูล</h2>
          <p>
            เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านเท่าที่จำเป็นสำหรับวัตถุประสงค์ที่ระบุไว้
            ข้อมูล Analytics จะถูกเก็บรักษาเป็นระยะเวลา 14 เดือนตามค่าเริ่มต้นของ Google Analytics
            หลังจากนั้นข้อมูลจะถูกลบโดยอัตโนมัติ
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">10. การปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</h2>
          <p>
            เว็บไซต์นี้ปฏิบัติตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            ท่านสามารถใช้สิทธิ์ตาม PDPA ได้โดยส่งคำขอไปที่{" "}
            <a href="mailto:privacy@goldnewsth.com" className="text-yellow-400 underline">
              privacy@goldnewsth.com
            </a>{" "}
            เราจะดำเนินการตามคำขอภายใน 30 วันนับจากวันที่ได้รับคำขอ
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">11. การแจ้งเตือนเมื่อข้อมูลรั่วไหล</h2>
          <p>
            ในกรณีที่เกิดเหตุการณ์ข้อมูลรั่วไหลที่อาจกระทบต่อสิทธิ์ของท่าน
            เราจะแจ้งให้ท่านทราบและแจ้งต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล
            ภายใน 72 ชั่วโมงนับจากที่ทราบเหตุ
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">12. การเปลี่ยนแปลงนโยบาย</h2>
          <p>
            เราอาจปรับปรุงนโยบายความเป็นส่วนตัวนี้เป็นครั้งคราว
            การเปลี่ยนแปลงใดๆ จะถูกเผยแพร่บนหน้านี้
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">13. ติดต่อเรา</h2>
          <p>
            หากท่านมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเราได้ที่:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-gray-400">
            <li>อีเมลทั่วไป:{" "}
              <a href="mailto:contact@goldnewsth.com" className="text-yellow-400 underline">
                contact@goldnewsth.com
              </a>
            </li>
            <li>ขอใช้สิทธิ์ข้อมูลส่วนบุคคล:{" "}
              <a href="mailto:privacy@goldnewsth.com" className="text-yellow-400 underline">
                privacy@goldnewsth.com
              </a>
            </li>
          </ul>
        </section>

        <p className="text-gray-500 text-xs pt-4 border-t border-gray-800">
          ปรับปรุงล่าสุด: เมษายน 2026
        </p>
      </div>
    </div>
  );
}
