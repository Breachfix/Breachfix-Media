'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Film,
  Tv,
  Video,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const NavButton = ({ href, label, icon: Icon, active }) => (
  <Link
    href={href}
    className={`flex items-center px-3 py-2 rounded-md transition ${
      active ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-800'
    }`}
  >
    <Icon className="h-5 w-5 mr-2" />
    {label}
  </Link>
);

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState({
    content: pathname.startsWith('/admin/content'),
    upload: pathname.startsWith('/admin/upload'),
  });

  const toggleMenu = (key) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Admin</h1>

        <nav className="space-y-2">
          <NavButton
            href="/admin"
            label="Dashboard"
            icon={LayoutGrid}
            active={pathname === '/admin'}
          />

          {/* Content Dropdown */}
          <button
            onClick={() => toggleMenu('content')}
            className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
              pathname.startsWith('/admin/content')
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {expandedMenus.content ? (
              <ChevronDown className="h-5 w-5 mr-2" />
            ) : (
              <ChevronRight className="h-5 w-5 mr-2" />
            )}
            Content
          </button>

          {expandedMenus.content && (
            <div className="ml-6 space-y-1 text-sm">
              <NavButton href="/admin/content/movies" label="Movies" icon={Film} active={pathname === '/admin/content/movies'} />
              <NavButton href="/admin/content/tv-shows" label="TV Shows" icon={Tv} active={pathname === '/admin/content/tv-shows'} />
              <NavButton href="/admin/content/episodes" label="Episodes" icon={Video} active={pathname === '/admin/content/episodes'} />
              <NavButton href="/admin/content/actors" label="Actors" icon={Video} active={pathname === '/admin/content/actors'} />
              <NavButton href="/admin/content/companies" label="Companies" icon={Video} active={pathname === '/admin/content/companies'} />
            </div>
          )}

          {/* Upload Dropdown */}
          <button
            onClick={() => toggleMenu('upload')}
            className={`flex items-center px-3 py-2 w-full text-left rounded-md ${
              pathname.startsWith('/admin/upload')
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            {expandedMenus.upload ? (
              <ChevronDown className="h-5 w-5 mr-2" />
            ) : (
              <ChevronRight className="h-5 w-5 mr-2" />
            )}
            Upload
          </button>

          {expandedMenus.upload && (
            <div className="ml-6 space-y-1 text-sm">
              <NavButton href="/admin/upload/movies" label="Movies" icon={Film} active={pathname === '/admin/upload/movies'} />
              <NavButton href="/admin/upload/tvshows" label="TV Shows" icon={Tv} active={pathname === '/admin/upload/tv-shows'} />
              <NavButton href="/admin/upload/episodes" label="Episodes" icon={Video} active={pathname === '/admin/upload/episodes'} />
              <NavButton href="/admin/upload/actors" label="Actors" icon={Video} active={pathname === '/admin/upload/actors'} />
              <NavButton href="/admin/upload/companies" label="Companies" icon={Video} active={pathname === '/admin/upload/companies'} />
            </div>
          )}

          {/* Static Links */}
          <NavButton href="/admin/insights" label="Insights" icon={LayoutGrid} active={pathname === '/admin/insights'} />
          <NavButton href="/admin/payments" label="Payments" icon={LayoutGrid} active={pathname === '/admin/payments'} />
          <NavButton href="/admin/submissions" label="Submissions" icon={LayoutGrid} active={pathname === '/admin/submissions'} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
}