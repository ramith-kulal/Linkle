import React from 'react';
import chatImage from '../assets/young-boy-and-girl-doing-online-chatting-3d-character-illustration-png.webp';
// Ensure the path is correct

function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col md:flex-row justify-between items-start text-left p-20"
      style={{ backgroundImage: 'linear-gradient(to top, #2a0d45 0%, #3f0f4b 100%)' }}
    >
      <div className="mt-20 md:w-1/2">
        <h1 className="text-6xl font-bold text-gray-100 mb-4"> {/* Increased size */}
          Connect with Random People Instantly
        </h1>
        <p className="text-2xl text-gray-400 mb-6"> {/* Increased size */}
          Experience the excitement of meeting new people. Start chatting now and make new connections across the globe!
        </p>
        <a
          href="/chat"
          className="bg-gray-900 text-gray-100 py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 cursor-pointer" // Increased padding
        >
          Start Chatting
        </a>
      </div>

      {/* Use the <img> tag to display the image */}
      <div className="flex justify-end items-center md:w-1/2 mt-10 md:mt-0">
        <img
          src={chatImage}
          alt="Young boy and girl chatting"
          className="rounded-lg"
          width={400} // Increased width
          height={400} // Increased height
        />
      </div>
    </section>
  );
}

export default HeroSection;
