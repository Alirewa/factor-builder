import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <h1 className="text-6xl font-black text-gray-200 mb-4">۴۰۴</h1>
        <p className="text-gray-500 mb-6">صفحه‌ای که دنبالش هستید پیدا نشد</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
