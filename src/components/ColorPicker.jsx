import React from 'react';

const ColorPicker = ({ onColorChange }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <input
        type="color"
        onChange={(event) => onColorChange(event.target.value)}
        style={{ width: '100px', height: '100px', border: 'none', cursor: 'pointer' }}
      />
    </div>
  );
};

export default ColorPicker;
