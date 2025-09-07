'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Container from '../components/Container'
import DashboardNavbar from '../components/DashboardBar'

const links = [
  { href: '/dashboard/dashboard', label: 'Dashboard' },
  { href: '/dashboard/products', label: 'All Products' },
  { href: '/dashboard/orders', label: 'Orders Management' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <Container>
    <div className="min-h-screen bg-[#E7E7E3] py-8 px-4">
      <div className=" mx-auto flex gap-6">
        {/* Left Drawer */}
        <aside className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit sticky top-8">
          <h2 className="text-lg font-semibold text-black mb-4">Admin DashBoard</h2>
          <nav className="space-y-2">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
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
        <main className="flex-1">
          <DashboardNavbar />
          {children}
        </main>
      </div>
    </div>
  </Container>
)
}
