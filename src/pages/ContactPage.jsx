export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Контакты</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Офис</h2>
        <p className="text-lg">г. Москва, ул. Примерная, д. 15, офис 207</p>
        <p className="text-lg">Пн–Пт: с 09:00 до 18:00</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Телефон</h2>
        <p className="text-lg">+7 (495) 123-45-67</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Email</h2>
        <p className="text-lg">support@coworking-app.ru</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Мы в социальных сетях</h2>
        <ul className="text-blue-600 space-y-1">
          <li>
            <a
              href="https://t.me/coworkingapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          </li>
          <li>
            <a
              href="https://vk.com/coworkingapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              ВКонтакте
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
