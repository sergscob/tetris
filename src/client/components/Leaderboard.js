import React from 'react';

const Leaderboard = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="leaderboard">
      <h3>Best scores</h3>
      <ol>
        {entries.map((entry) => (
          <li key={`${entry.name}-${entry.date}`}>{`${entry.name} — ${entry.score}`}</li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
