import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import QuizConfig from './pages/QuizConfig';
import Arena from './pages/Arena';
import StudyNotes from './pages/StudyNotes';
import History from './pages/History';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<QuizConfig />} />
          <Route path="arena" element={<Arena />} />
          <Route path="prepare" element={<StudyNotes />} />
          <Route path="history" element={<History />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
