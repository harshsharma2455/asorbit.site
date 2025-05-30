
import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';

const App: React.FC = () => {
  return (
    <div 
      className="relative min-h-screen" 
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline // Important for mobile compatibility, prevents fullscreen on iOS Safari
        className="absolute inset-0 w-full h-full object-cover" // Makes video cover the div, cropping if necessary
        poster="assets/background.png" // Fallback image if video fails to load/play
      >
        {/* 
          IMPORTANT: Replace 'assets/background_video.mp4' with the actual path to your video file.
          And ensure 'assets/background.png' (or your chosen fallback image) is available at this path.
          For example, if you create an 'assets' folder in the same directory as your index.html 
          and place 'my_video.mp4' and 'background.png' inside it, the paths would be 
          'assets/my_video.mp4' and 'assets/background.png'.
          Supported video formats typically include MP4, WebM, and Ogg.
        */}
        <source src="assets/background_video.mp4" type="video/mp4" />
        Your browser does not support the video tag. {/* Fallback text */}
      </video>
      
      {/* Dark overlay for better text readability - sits on top of the video/poster */}
      {/* <div className="absolute inset-0 bg-black/70 backdrop-brightness-[0.01]"></div> */}
      
      {/* Content container - sits on top of the overlay */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
          <Hero />
        </main>
        <footer className="py-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Asorbit. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default App;
