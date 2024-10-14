import chatImage from '../assets/young-boy-and-girl-doing-online-chatting-3d-character-illustration-png.webp';
// Ensure the path is correct

function HeroSection() {
  return (
    <section
      className="flex flex-col md:flex-row justify-between items-start text-left p-5 md:p-20 min-h-screen"
      style={{ backgroundImage: 'linear-gradient(to top, #2a0d45 0%, #3f0f4b 100%)' }}
    >
      {/* Left Text Section */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start mt-10 md:mt-0"> {/* Added mt-10 for mobile spacing */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-100 mb-2"> 
          Connect with Random People Instantly
        </h1>
        <p className="text-lg md:text-2xl text-gray-400 mb-4"> 
          Experience the excitement of meeting new people. Start chatting now and make new connections across the globe!
        </p>
        <a
          href="/chat"
          className="bg-gray-900 text-gray-100 py-4 px-8 rounded-lg text-lg font-semibold hover:bg-gray-800 cursor-pointer"
        >
          Start Chatting
        </a>
      </div>

      {/* Right Image Section */}
      <div className="md:w-1/2 w-full flex justify-center items-center mt-10 md:mt-0">
        <img
          src={chatImage}
          alt="Young boy and girl chatting"
          className="rounded-lg w-full max-w-xs md:max-w-md" // Make image responsive
        />
      </div>
    </section>
  );
}

export default HeroSection;
