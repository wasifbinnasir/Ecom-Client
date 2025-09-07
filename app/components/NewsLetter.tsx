import { useState } from 'react';
import { MdMailOutline } from "react-icons/md";

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="bg-black text-white p-8 rounded-2xl max-w-7xl mx-auto -mt-16 my-9">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="lg:flex-1">
          <h2 className="text-3xl lg:text-[40px] font-bold leading-tight">
            STAY UP TO DATE ABOUT<br />
            OUR LATEST OFFERS
          </h2>
        </div>
        
        <div className="lg:flex-1 lg:max-w-md">
          <div className="space-y-4">
            <div className="relative w-full px-4 py-3 rounded-full bg-white text-black flex items-center gap-x-2">
              <MdMailOutline/>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className=" placeholder-gray-500 focus:outline-none"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-white text-black font-medium  py-4 md:py-3 px-6 rounded-full hover:bg-gray-100 transition-colors text-xs md:text-base "
            >
              Subscribe to Newsletter
            </button>
          </div>
          
          {isSubscribed && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
              Successfully subscribed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}