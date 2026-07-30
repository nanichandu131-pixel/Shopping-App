import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import CategorySidebar from './CategorySidebar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-ink dark:bg-[#0e1117] dark:text-zinc-100">
      {/* Parallax Background */}
      <div className="parallax-bg" aria-hidden="true" />
      
      <Navbar onMenuToggle={() => setSidebarOpen(true)} />
      <CategorySidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="relative z-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
