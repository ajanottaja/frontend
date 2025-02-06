import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-900">
      {/* Logo */}
      <div className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
        Ajanottaja
      </div>
      
      {/* Simple loading indicator */}
      <div className="w-24 h-1 bg-stone-800 rounded-full overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-400 animate-pulse" />
      </div>
    </div>
  );
};

export default Loading;
