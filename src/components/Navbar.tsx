
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  return (
    <nav className="bg-premier-purple text-white py-4 px-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="font-bold text-xl">
            <span>Premier League</span>
            <span className="text-premier-green ml-1">Pulse</span>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <Button asChild variant="ghost" className="text-white hover:text-premier-green">
            <Link to="/">Standings</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:text-premier-green">
            <Link to="/players">Players</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:text-premier-green">
            <Link to="/matches">Matches</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
