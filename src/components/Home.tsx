import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './common/Button';

// No need for global declarations since we're removing the Learn More button
const Home = () => {
  const navigate = useNavigate();
  
  // Removed handleLearnMore function since it's no longer needed
  
  return (
    <div className="flex justify-center">
      <Button
        onClick={() => navigate('/upload')}
        className="bg-[#00ffd5] hover:bg-[#00e6c0] text-black px-8 py-3"
      >
        Start Uploading
      </Button>
      {/* Learn More button removed */}
    </div>
  );
};

export default Home; 