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
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const NavButton = ({ href, label, icon: Icon, active, onClick}) => (
  <Link
    href={href}
    onClick={onClick}
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 space-y-4 transition-transform transform
          md:static md:translate-x-0 md:flex-shrink-0 md:h-screen
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button on mobile */}
        <div className="flex justify-between items-center md:hidden mb-4">
          <h1 className="text-2xl font-bold">Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-white text-xl">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Title on desktop */}
        <h1 className="hidden md:block text-2xl font-bold mb-6">Admin</h1>

        <nav className="space-y-2">
          <NavButton
            href="/admin"
            label="Dashboard"
            icon={LayoutGrid}
            active={pathname === '/admin'}
            onClick={() => setSidebarOpen(false)}
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
              <NavButton href="/admin/content/movies" label="Movies" icon={Film} active={pathname === '/admin/content/movies'} onClick={() => setSidebarOpen(false)} />
              <NavButton href="/admin/content/tv-shows" label="TV Shows" icon={Tv} active={pathname === '/admin/content/tv-shows'} onClick={() => setSidebarOpen(false)}  />
              <NavButton href="/admin/content/episodes" label="Episodes" icon={Video} active={pathname === '/admin/content/episodes'} onClick={() => setSidebarOpen(false)} />
              <NavButton href="/admin/content/actors" label="Actors" icon={Video} active={pathname === '/admin/content/actors'} onClick={() => setSidebarOpen(false)}  />
              <NavButton href="/admin/content/companies" label="Companies" icon={Video} active={pathname === '/admin/content/companies'} onClick={() => setSidebarOpen(false)}  />
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
              <NavButton href="/admin/upload/movies" label="Movies" icon={Film} active={pathname === '/admin/upload/movies'} onClick={() => setSidebarOpen(false)}  />
              <NavButton href="/admin/upload/tvshows" label="TV Shows" icon={Tv} active={pathname === '/admin/upload/tv-shows'} onClick={() => setSidebarOpen(false)} />
              <NavButton href="/admin/upload/episodes" label="Episodes" icon={Video} active={pathname === '/admin/upload/episodes'} onClick={() => setSidebarOpen(false)} />
              <NavButton href="/admin/upload/actors" label="Actors" icon={Video} active={pathname === '/admin/upload/actors'} onClick={() => setSidebarOpen(false)}  />
              <NavButton href="/admin/upload/companies" label="Companies" icon={Video} active={pathname === '/admin/upload/companies'} onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          {/* Static Links */}
          <NavButton href="/admin/insights" label="Insights" icon={LayoutGrid} active={pathname === '/admin/insights'}  onClick={() => setSidebarOpen(false)} />
          <NavButton href="/admin/payments" label="Payments" icon={LayoutGrid} active={pathname === '/admin/payments'}  onClick={() => setSidebarOpen(false)}/>
          <NavButton href="/admin/submissions" label="Submissions" icon={LayoutGrid} active={pathname === '/admin/submissions'}  onClick={() => setSidebarOpen(false)}/>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Toggle Button */}
        <div className="md:hidden bg-gray-900 text-white p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-white text-xl">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}