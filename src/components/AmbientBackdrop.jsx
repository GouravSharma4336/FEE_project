import React from 'react';

export default function AmbientBackdrop() {
  return (
    <div className="ambient-backdrop" aria-hidden="true">
      <div className="ambient-shape ambient-purple-circle" />
      <div className="ambient-shape ambient-cyan-circle" />
      <div className="ambient-shape ambient-lavender-circle" />
    </div>
  );
}
