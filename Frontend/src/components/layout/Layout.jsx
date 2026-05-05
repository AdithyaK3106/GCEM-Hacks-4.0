import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './layout.css';

const Layout = () => {
  return (
    <div className="flex bg-primary min-h-screen text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
