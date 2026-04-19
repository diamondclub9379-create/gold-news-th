import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อทีมงาน Gold News TH สำหรับคำถาม ข้อเสนอแนะ หรือร้องเรียน",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-yellow-400 mb-8">ติดต่อเรา</h1>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <p>
          หากท่านมีคำถาม ข้อเสนอแนะ หรือต้องการแจ้งปัญหาเกี่ยวกับเนื้อหาบนเว็บไซต์
          สามารถติดต่อเราได้ผ่านช่องทางด้านล่าง
        </p>

        <div className="grid gap-4">
          <div className="border border-gray-800 rounded-lg p-4">
            <h2 className="font-semibold text-gray-100 mb-1">อีเมลทั่วไป</h2>
            <a
              href="mailto:contact@goldnewsth.com"
              className="text-yellow-400 underline font-mono text-xs"
            >
              contact@goldnewsth.com
            </a>
            <p className="text-gray-500 text-xs mt-1">สำหรับคำถามทั่วไป ข้อเสนอแนะ ความร่วมมือ</p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h2 className="font-semibold text-gray-100 mb-1">ขอใช้สิทธิ์ข้อมูลส่วนบุคคล (PDPA)</h2>
            <a
              href="mailto:privacy@goldnewsth.com"
              className="text-yellow-400 underline font-mono text-xs"
            >
              privacy@goldnewsth.com
            </a>
            <p className="text-gray-500 text-xs mt-1">
              สำหรับคำขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
              เราจะดำเนินการภายใน 30 วันหลังได้รับคำขอ
            </p>
          </div>

          <div className="border border-gray-800 rounded-lg p-4">
            <h2 className="font-semibold text-gray-100 mb-1">แจ้งปัญหาลิขสิทธิ์</h2>
            <a
              href="mailto:contact@goldnewsth.com"
              className="text-yellow-400 underline font-mono text-xs"
            >
              contact@goldnewsth.com
            </a>
            <p className="text-gray-500 text-xs mt-1">
              หากท่านเป็นเจ้าของเนื้อหาและต้องการให้นำเนื้อหาออก กรุณาติดต่อเราพร้อมระบุ URL ของเนื้อหา
            </p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mt-8">
          <h2 className="font-semibold text-gray-100 mb-2">ข้อมูลเว็บไซต์</h2>
          <div className="space-y-1 font-mono text-xs text-gray-500">
            <p>เว็บไซต์: goldnewsth.com</p>
            <p>ภาษา: ไทย / อังกฤษ</p>
            <p>ประเภท: เว็บข่าวการเงิน (ทองคำ / เงิน)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
