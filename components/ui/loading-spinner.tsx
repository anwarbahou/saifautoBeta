const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-16 h-16">
        {/* Ring 1: Outer, standard speed, gap on the left */}
        <div
          className="absolute inset-0 rounded-full border-2 border-primary border-l-transparent animate-spin"
          style={{ animation: 'spin 1s linear infinite' }}
        ></div>
        {/* Ring 2: Middle, faster, reversed, gap on the top, slightly transparent */}
        <div
          className="absolute inset-1 rounded-full border-2 border-primary border-t-transparent animate-spin opacity-75"
          style={{ animation: 'spin 0.8s linear infinite reverse' }}
        ></div>
        {/* Ring 3: Inner, slower, gap on the right, more transparent */}
        <div
          className="absolute inset-2 rounded-full border-2 border-primary border-r-transparent animate-spin opacity-50"
          style={{ animation: 'spin 1.2s linear infinite' }}
        ></div>
      </div>
    </div>
  );
};
export default LoadingSpinner; 