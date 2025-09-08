'use client';

import React, { useState } from 'react';
import { IoCartOutline, IoPersonCircle, IoLogOutOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import Link from 'next/link';
import Container from './Container';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { logout } from '../features/auth/authSlice';
import { usePathname } from 'next/navigation';

const nav = [
  { name: "Shop", link: "/products" },
  { name: "On Sale", link: "/products" },
  { name: "New Arrivals", link: "/products" },
  { name: "Brands", link: "/products" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const roles = useSelector((state: RootState) => state.auth.roles);
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
  };

  // Hide navbar in dashboard routes
  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    <Container className="w-full bg-white px-6 md:px-24 flex justify-between items-center py-4 relative">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button 
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <IoClose /> : <RxHamburgerMenu />}
        </button>

       <Link href="/">
        <h1 className="text-[28px] md:text-[32px] font-extrabold text-black">
          SHOP.CO
        </h1></Link>
      </div>

      {/* Center Nav */}
      <ul className="hidden md:flex items-center gap-x-6">
        {nav.map((link, i) => (
          <li 
            key={i} 
            className="text-black font-normal text-base hover:underline cursor-pointer"
          >
            <Link href={link.link}>{link.name}</Link>
          </li>
        ))}
      </ul>

      {/* Search */}
      <div className="hidden md:flex bg-[#F0F0F0] px-3 py-2 rounded-4xl w-[250px] lg:w-[557px] items-center gap-x-1">
        <IoSearchOutline className="text-black"/>
        <input 
          type="text" 
          placeholder="Search for products..." 
          className="outline-none bg-transparent w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-x-3">
        {token ? (
          <>
            {(roles.includes('admin') || roles.includes('super_admin')) && (
              <Link href="/dashboard/dashboard">
                <MdSpaceDashboard 
                  className="text-2xl text-black cursor-pointer"
                  title="Dashboard"
                />
              </Link>
            )}

            <IoLogOutOutline 
              onClick={handleLogout} 
              className="text-2xl text-black cursor-pointer"
              title="Logout"
            />
          </>
        ) : (
          <Link href="/login">
            <IoPersonCircle className="text-2xl text-black cursor-pointer"/>
          </Link>
        )}

        <Link href="/cart">
          <IoCartOutline className="text-2xl text-black cursor-pointer"/>
        </Link>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md p-6 flex flex-col gap-4 md:hidden z-50">
          {nav.map((link, i) => (
            <Link 
              key={i}
              href={link.link}
              className="text-black text-base hover:underline"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="bg-[#F0F0F0] px-3 py-2 rounded-4xl flex items-center gap-x-1">
            <IoSearchOutline className="text-black"/>
            <input 
              type="text" 
              placeholder="Search for products..." 
              className="outline-none bg-transparent w-full"
            />
          </div>
        </div>
      )}
    </Container>
  );
}
