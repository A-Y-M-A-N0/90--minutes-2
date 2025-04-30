
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-premier-purple text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="font-bold text-xl">
              <span>Premier League</span>
              <span className="text-premier-green ml-1">Pulse</span>
            </div>
            <p className="text-sm mt-2">Your source for Premier League updates</p>
          </div>
          <div className="text-sm text-gray-300">
            © {new Date().getFullYear()} Premier League Pulse. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
