const WaveAnimation = () => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex space-x-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse"
            style={{
              height: `${20 + Math.sin(i) * 15}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default WaveAnimation;