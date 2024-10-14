import { useState, useEffect } from 'react';
import React from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-purple-950 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4 h-16">
        {/* Logo */}
        <a href="#" className="text-3xl font-bold text-white "> {/* Increased the text size */}
          Linkle
        </a>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden ml-auto z-50">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white text-4xl focus:outline-none" // Increased the icon size
          >
            {isOpen ? '✖' : '☰'} {/* Toggle between open and close icon */}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-purple-950 transition-transform transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:hidden flex flex-col items-center justify-center`}
        >
          {/* Centered Logo */}

          <ul className="flex flex-col items-center space-y-4">
            <li>
              <a href="#" className="text-white hover:text-purple-800">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-500">
                Features
              </a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-blue-500">
                Contact
              </a>
            </li>
            <li>
              <a href="#cta" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full text-center">
                Get Started
              </a>
            </li>
          </ul>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg items-center">
          <li>
            <a href="#" className="text-white hover:text-purple-800">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-500">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-blue-500">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
