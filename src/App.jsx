import React from 'react';
// Core React library import

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// React Router components for client-side SPA routing and redirects without reloading the page

import Layout from './components/Layout';
// Shared layout wrapper (includes Navbar, Footer, and Background) for all pages

import Home from './pages/Home';
// Home page: Landing screen showing track cards and introduction

import QuizConfig from './pages/QuizConfig';
// Quiz setup page: Where users choose subject, difficulty, question count, and timer

import Arena from './pages/Arena';
// Arena page: The live interactive quiz test environment

import StudyNotes from './pages/StudyNotes';
// Study notes page: Placement video tutorials and preparation checklists

import History from './pages/History';
// History page: Displays past quiz attempt scores and accuracy for the logged-in user

import Leaderboard from './pages/Leaderboard';
// Leaderboard page: Campus top-10 scores and student rankings

import Login from './pages/Login';
// Login page: Student authentication (guest login, account sign-in, account creation)

export default function App() {
  // Configures the application's page routes inside BrowserRouter
  return (
    <BrowserRouter>
      <Routes>
        {/* Main layout route that wraps all inner child routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<QuizConfig />} />
          <Route path="arena" element={<Arena />} />
          <Route path="prepare" element={<StudyNotes />} />
          <Route path="history" element={<History />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="login" element={<Login />} />
          {/* Fallback route: redirects any unknown URL path back to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
