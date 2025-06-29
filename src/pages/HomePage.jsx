import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Блок баннера */}
      <div className="relative w-full h-dvh">
        <img
          src="/1972.jpg"
          alt="Coworking Space"
          className="w-full h-full object-cover"
        />
        {/* затемнение поверх картинки */}
        <div className="animate-fade-in absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Работайте продуктивно — <br />
            бронируйте место в коворкинге онлайн
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mb-8">
            Простой и удобный сервис для бронирования рабочих мест. Доступ к
            интерактивной карте, гибкое бронирование, прозрачная система управления.
          </p>
          <Link
            to="/booking"
            className="animate-fade-in bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:shadow-lg transition"
          >
            Забронировать
          </Link>
        </div>
      </div>

      {/* О сервисе */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Как это работает?
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
          Зарегистрируйтесь, выберите рабочее место на интерактивной карте, укажите
          дату и время, и подтвердите бронь. Всё просто и без лишних шагов.
        </p>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-gray-50 px-6">
        <h2 className="text-3xl font-semibold mb-12 text-center">
          Почему именно мы?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">Гибкое бронирование</h3>
            <p>
              Можно указать допуск к сдвигу во времени — это поможет найти слот
              быстрее.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">Интерактивная карта</h3>
            <p>Выбирайте место прямо на плане помещения — всё наглядно и удобно.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow text-center">
            <h3 className="text-xl font-bold mb-2">Прозрачная система</h3>
            <p>
              Просматривайте свои брони и отменяйте их при необходимости в пару
              кликов.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
