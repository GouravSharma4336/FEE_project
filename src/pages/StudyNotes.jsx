import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaClock } from 'react-icons/fa';

export default function StudyNotes() {
  const notes = [
    // Subject: HTML
    {
      id: 'html-1', cat: 'frontend web html', title: 'HTML5 Semantic Structuring',
      meta: 'HTML5 & Semantics', duration: '60 mins',
      embed: 'https://www.youtube-nocookie.com/embed/kUMe1FH4CHE',
      desc: 'Master page landmarks, sections, headers, footers, and accessible ARIA attributes.',
      checklists: ['Semantic vs Non-Semantic Elements', 'Document Hierarchy & Landmarks', 'Accessibility & SEO Standards'],
      subject: 'html'
    },
    {
      id: 'html-2', cat: 'frontend web html', title: 'HTML5 Forms & Input Validation',
      meta: 'HTML5 Forms & ARIA', duration: '45 mins',
      embed: 'https://www.youtube-nocookie.com/embed/fNcJuPIZ2WE',
      desc: 'Master input types, form constraints, required validation, and screen reader labels.',
      checklists: ['Form Validation & Input Types', 'ARIA Labels, Roles & States', 'Accessible Form Controls'],
      subject: 'html'
    },

    // Subject: CSS
    {
      id: 'css-1', cat: 'frontend web css', title: 'Modern Layouts & Flexbox',
      meta: 'CSS3 & Flexbox', duration: '90 mins',
      embed: 'https://www.youtube-nocookie.com/embed/1Rs2ND1ryYc',
      desc: 'Deep dive into Flexbox axes, alignment, responsive units, and media queries.',
      checklists: ['Flexbox Direction, Wrap & Alignment', 'Box Model, Padding & Margins', 'Mobile-First Media Queries'],
      subject: 'css'
    },
    {
      id: 'css-2', cat: 'frontend web css', title: 'CSS Grid & Responsive Design',
      meta: 'CSS3 Grid & Layouts', duration: '60 mins',
      embed: 'https://www.youtube-nocookie.com/embed/jV8B24rSN5o',
      desc: 'Master 2D layouts with CSS Grid, grid-template areas, minmax, and responsive breakpoints.',
      checklists: ['Grid Columns, Rows & Gap', 'fr Units & minmax() Sizing', 'Responsive Breakpoints & Layouts'],
      subject: 'css'
    },

    // Subject: JavaScript
    {
      id: 'js-1', cat: 'frontend web javascript', title: 'Modern JavaScript (ES6+) Core',
      meta: 'Modern JavaScript', duration: '100 mins',
      embed: 'https://www.youtube-nocookie.com/embed/hdI2bqOjy3c',
      desc: 'Closures, scope chains, arrow functions, destructuring, and array methods.',
      checklists: ['Arrow Functions & Destructuring', 'Scope Chains, Closures & Lexical Env', 'Array Map, Filter, Reduce & Find'],
      subject: 'javascript'
    },
    {
      id: 'js-2', cat: 'frontend web javascript', title: 'Async JS, Promises & Event Loop',
      meta: 'Async JavaScript', duration: '75 mins',
      embed: 'https://www.youtube-nocookie.com/embed/PoRJizFvM7s',
      desc: 'Promises, async/await, Fetch API, callback queues, microtasks, and event loop.',
      checklists: ['Promises & Error Handling', 'async/await & Fetch API', 'Call Stack & Event Loop Architecture'],
      subject: 'javascript'
    },

    // Subject: React
    {
      id: 'react-1', cat: 'framework react', title: 'Component Architecture & State',
      meta: 'React & Components', duration: '120 mins',
      embed: 'https://www.youtube-nocookie.com/embed/w7ejDZ8SWv8',
      desc: 'Understand JSX, props, useState hook, component lifecycle, and virtual DOM.',
      checklists: ['State vs Props Architecture', 'Component Lifecycle & Re-rendering', 'Conditional Rendering & Lists'],
      subject: 'react'
    },
    {
      id: 'react-2', cat: 'framework react', title: 'React Hooks In-Depth (useEffect & useRef)',
      meta: 'React Hooks & State', duration: '80 mins',
      embed: 'https://www.youtube-nocookie.com/embed/TNhaISOUy6Q',
      desc: 'Deep dive into useEffect dependencies, side effects, cleanups, and useRef DOM access.',
      checklists: ['useEffect Dependency Array & Cleanups', 'useRef for Mutable Values & DOM', 'Custom Hooks Logic Reusability'],
      subject: 'react'
    },

    // Subject: OOPs
    {
      id: 'oops-1', cat: 'core oops', title: 'Object-Oriented Programming Core',
      meta: 'OOPs & 4 Pillars', duration: '45 mins',
      embed: 'https://www.youtube-nocookie.com/embed/pTB0EiLXUC8',
      desc: 'The 4 pillars of OOP: encapsulation, abstraction, inheritance, and polymorphism.',
      checklists: ['Encapsulation & Data Hiding', 'Inheritance & Code Reusability', 'Polymorphism & Abstraction'],
      subject: 'oops'
    },
    {
      id: 'oops-2', cat: 'core oops', title: 'SOLID Principles & Software Design',
      meta: 'OOPs & Architecture', duration: '50 mins',
      embed: 'https://www.youtube-nocookie.com/embed/kF7rQmSRlq0',
      desc: 'Master the 5 SOLID design principles for clean, extensible object-oriented code.',
      checklists: ['Single Responsibility & Open-Closed', 'Liskov Substitution Principle', 'Interface Segregation & Dependency Inversion'],
      subject: 'oops'
    },

    // Subject: Quantitative Aptitude & Logic
    {
      id: 'aptitude-1', cat: 'aptitude math', title: 'Quantitative Aptitude & Shortcuts',
      meta: 'Quantitative Aptitude', duration: '60 mins',
      embed: 'https://www.youtube-nocookie.com/embed/7d8A_5cTq1o',
      desc: 'Formulas and shortcuts for speed-time-distance, profit & loss, percentages, and ratios.',
      checklists: ['Speed, Distance & Time Shortcuts', 'Profit, Loss & Percentage Tricks', 'Ratio, Proportion & Work Problems'],
      subject: 'logic_reasoning'
    },
    {
      id: 'aptitude-2', cat: 'aptitude logic', title: 'Logical Reasoning & Series Tricks',
      meta: 'Logical Reasoning', duration: '55 mins',
      embed: 'https://www.youtube-nocookie.com/embed/oGmsZ64cW4A',
      desc: 'Formulas and deduction strategies for number series, coding-decoding, and syllogisms.',
      checklists: ['Number Series & Pattern Recognition', 'Coding-Decoding & Direction Sense', 'Deductive Reasoning & Syllogisms'],
      subject: 'logic_reasoning'
    }
  ];

  return (
    <main className="container">
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <FaBookOpen /> Concept Prep &amp; Video Hub
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Placement Preparation Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review core lectures, checklists, and foundational notes before testing your skills.</p>
      </div>

      {/* Video Grid */}
      <div className="curriculum-grid">
        {notes.map(item => (
          <article key={item.id} className="video-card">
            <div className="video-frame-wrap">
              <iframe src={item.embed} title={item.title} allowFullScreen loading="lazy" />
            </div>
            <div className="video-content">
              <div className="video-meta">
                <span>{item.meta}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <FaClock /> {item.duration}
                </span>
              </div>
              <h3>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{item.desc}</p>
              <ul className="checklist">
                {item.checklists.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
              <Link to={`/quiz?subject=${item.subject}`} className="video-cta">
                Test {item.meta} Knowledge →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
