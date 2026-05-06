import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './layout.css';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 w-full flex flex-col min-w-0 bg-transparent">
        <Topbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
