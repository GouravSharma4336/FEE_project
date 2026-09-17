import React from 'react';
// Core React library import

import { Outlet } from 'react-router-dom';
// Outlet: React Router placeholder that renders the active child page route

import Navbar from './Navbar';
// Site header with logo, navigation links, theme toggle, and login status

import Footer from './Footer';
// Site footer with links and copyright

import AmbientBackdrop from './AmbientBackdrop';
// Decorative ambient background glow circles

import { ToastProvider } from './Toast';
// Context provider for toast notification popup messages

// Layout: Common layout frame that wraps every page in the application
export default function Layout() {
  return (
    <ToastProvider>
      <AmbientBackdrop />
      <Navbar />
      {/* Active page route (Home, QuizConfig, Arena, etc.) renders inside Outlet */}
      <Outlet />
      <Footer />
    </ToastProvider>
  );
}
