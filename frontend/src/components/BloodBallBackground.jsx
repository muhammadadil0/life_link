import React from 'react';

export default function BloodBallBackground() {
  const balls = [
    { top: '8%', left: '6%', size: '90px', delay: '0s' },
    { top: '65%', left: '12%', size: '70px', delay: '2s' },
    { top: '25%', left: '80%', size: '110px', delay: '1.5s' },
    { top: '78%', left: '72%', size: '80px', delay: '3s' },
    { top: '52%', left: '48%', size: '120px', delay: '4s' },
    { top: '40%', left: '30%', size: '100px', delay: '2.5s' },
  ];

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {balls.map((b, i) => (
        <div
          key={i}
          className="blood-ball"
          style={{
            top: b.top,
            left: b.left,
            width: b.size,
            height: b.size,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
