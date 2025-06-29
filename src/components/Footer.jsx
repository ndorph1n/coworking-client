export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} CoworkingApp
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">
            Политика конфиденциальности
          </a>
          <a href="#" className="hover:underline">
            Telegram
          </a>
        </div>
      </div>
    </footer>
  );
}
