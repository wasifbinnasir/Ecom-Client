'use client';

import React, { useState } from 'react';
import { FiBell, FiChevronDown, FiLogOut, FiShoppingCart } from 'react-icons/fi';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useRouter } from 'next/navigation';

export default function DashboardNavbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout()); 
    router.push('/login'); 
  };

  return (
    <nav className="w-full bg-slate-100 shadow-md px-6 py-3 flex items-center justify-between">
      
      <div className="text-2xl font-extrabold text-black">
        SHOP.CO
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Notification Icon */}
        <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full transition-colors">
          <FiBell size={22} />
        </button>

        {/* Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Account
            <FiChevronDown />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-10">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                <FiShoppingCart />
                Go to Store
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors text-left"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
