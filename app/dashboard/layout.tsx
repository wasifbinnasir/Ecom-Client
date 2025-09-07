'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Container from '../components/Container';
import DashboardNavbar from '../components/DashboardBar';
import { useGetCurrentUserQuery } from '../services/userApi';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (!isLoading) {
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const role = Array.isArray(currentUser.roles)
        ? currentUser.roles[0]
        : currentUser.roles;

      if (role !== 'admin' && role !== 'super_admin') {
        router.push('/');
        return;
      }

      if (pathname === '/dashboard/usermanagement' && role !== 'super_admin') {
        router.push('/dashboard/dashboard');
      }
    }
  }, [pathname, currentUser, isLoading, router]);

  if (isLoading) return <div className="p-6">Loading...</div>;

  const role = Array.isArray(currentUser?.roles)
    ? currentUser.roles[0]
    : currentUser?.roles;

  const links = [
    { href: '/dashboard/dashboard', label: 'Dashboard' },
    { href: '/dashboard/products', label: 'All Products' },
    { href: '/dashboard/orders', label: 'Orders Management' },
    ...(role === 'super_admin'
      ? [{ href: '/dashboard/usermanagement', label: 'Users Management' }]
      : []),
  ];

  return (
    <Container>
      <div className="min-h-screen bg-[#E7E7E3] py-6 px-1 md:px-4 relative">
        {/* Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 text-2xl text-black focus:outline-none flex items-center gap-2"
        >
          {sidebarOpen ? <IoClose /> : <RxHamburgerMenu />}
          <span className="text-base font-medium">{sidebarOpen ? "Close Menu" : "Menu"}</span>
        </button>

        <div className="mx-auto flex gap-6">
          {/* Sidebar */}
          <aside
            className={`fixed md:static top-0 left-0 h-full md:h-fit w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 transform 
              transition-transform duration-300 ease-in-out z-50
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
          >
            <h2 className="text-lg font-semibold text-black mb-4">Admin Dashboard</h2>
            <nav className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)} // close on mobile
                  className={`block px-3 py-2 rounded-md font-medium transition 
                    ${pathname === link.href
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Right Content */}
          <main className="flex-1 md:ml-0 ml-0">
            <DashboardNavbar />
            {children}
          </main>
        </div>
      </div>
    </Container>
  );
}
