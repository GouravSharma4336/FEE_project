import React from 'react';
// Core React import

// AmbientBackdrop: Renders soft, colorful glowing background circles for visual aesthetics
export default function AmbientBackdrop() {
  return (
    // aria-hidden="true" tells screen readers to ignore these purely decorative background elements
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-shape ambient-purple-circle" />
      <div className="ambient-shape ambient-cyan-circle" />
      <div className="ambient-shape ambient-lavender-circle" />
    </div>
  );
}
