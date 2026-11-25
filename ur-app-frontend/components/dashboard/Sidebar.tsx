'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

interface SidebarProps {
  role: string;
  onClose?: () => void;
}

export default function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();

  const studentLinks = [
    { href: '/dashboard/student', label: 'Overview' },
    { href: '/dashboard/student/profile', label: 'Profile' },
    { href: '/dashboard/student/results', label: 'Results' },
    { href: '/dashboard/student/applications', label: 'Applications' }, 
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'Overview' },
    { href: '/dashboard/admin/students', label: 'Students' },
    { href: '/dashboard/admin/universities', label: 'Universities' },
    { href: '/dashboard/admin/colleges', label: 'Colleges' },
    { href: '/dashboard/admin/programs', label: 'Programs' },
    { href: '/dashboard/admin/transactions', label: 'Transactions' },
    { href: '/dashboard/admin/subjects', label: 'Subjects' },   
    { href: '/dashboard/admin/applications', label: 'Applications' },
    { href: '/dashboard/admin/how-it-works', label: 'How It Works' },
    { href: '/dashboard/admin/blogs', label: 'Blogs' },
  ];

  const links = role === 'STUDENT' ? studentLinks : adminLinks;

  const logout = async () => {
    try { await api.post('/auth/logout'); } finally {
    window.location.href = '/login';
    }
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 font-bold text-xl text-blue-600 border-b">Application Gate</div>
      <nav className="flex-1 mt-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleLinkClick}
            className={`block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
              pathname === link.href ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => {
            void logout();
            if (onClose) onClose();
          }}
          className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 mt-10"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}
