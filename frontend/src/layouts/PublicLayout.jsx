import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Public Layout
 * Serves as the structural wrapper for public-facing pages (Landing, Login, Register).
 */
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col">
      <main className="flex-1 w-full">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default PublicLayout;

