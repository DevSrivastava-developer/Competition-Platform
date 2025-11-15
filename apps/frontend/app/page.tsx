export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 via-purple-700 to-pink-500">
      <div className="bg-white/90 rounded-xl shadow-xl px-12 py-10 flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 mb-4">
          Competition Platform
        </h1>
        <p className="text-lg text-gray-700 text-center mb-6">
          Join and organize competitive events<br />
          Collaboration, challenge, and growth for all!
        </p>
        <div className="flex gap-4 w-full mt-2">
          <a
            href="/login"
            className="flex-1 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/signup"
            className="flex-1 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition"
          >
            Sign Up
          </a>
        </div>
        <div className="mt-6 w-full">
          <p className="text-xs text-gray-500 text-center">
            Want to know more? Check the{' '}
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-500 hover:text-blue-600"
            >
              documentation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
