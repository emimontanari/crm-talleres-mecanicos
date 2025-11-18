export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-gray-900">
          TallerPro
        </h1>
        <p className="mb-8 text-xl text-gray-600">
          Sistema de Gestión para Talleres Mecánicos
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/sign-in"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
          <a
            href="/sign-up"
            className="rounded-lg border-2 border-blue-600 px-6 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Registrarse
          </a>
        </div>
      </div>
    </div>
  );
}
