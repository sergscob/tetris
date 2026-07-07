import React from 'react';

const Spectrum = ({ name, alive, score, spectrum }) => (
  <div className="spectrum">
    <div>
      {name}
      {!alive && ' (out)'}
    </div>
    <div className="spectrum-bars">
      {spectrum.map((height, x) => (
        <div key={x} className="spectrum-bar" style={{ height: `${height * 4}px` }} />
      ))}
    </div>
    <div>{score}</div>
  </div>
);

export default Spectrum;
