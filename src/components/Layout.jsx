import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AmbientBackdrop from './AmbientBackdrop';
import { ToastProvider } from './Toast';

export default function Layout() {
  return (
    <ToastProvider>
      <AmbientBackdrop />
      <Navbar />
      <Outlet />
      <Footer />
    </ToastProvider>
  );
}
