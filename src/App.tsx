import './App.css';

function App() {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-black to-pink-700 flex flex-col items-center justify-center relative">
      
      {/* Flowing gradient title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-400 animate-gradient-x drop-shadow-lg">
        Synthetic
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-purple-700 hover:scale-105 transition transform">
          New
        </button>
        <button className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:bg-pink-700 hover:scale-105 transition transform">
          Open
        </button>
      </div>

      {/* Version text */}
      <span className="absolute bottom-4 right-4 text-gray-400 text-sm md:text-base">
        v1.0.0
      </span>
    </div>
  );
}

export default App;
