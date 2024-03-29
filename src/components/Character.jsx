import React from "react";

const Character = ({ characterDescription, images }) => {
  return (
    <div>
      <p>{characterDescription}</p>
      <img src={`data:image/png;base64,${images[0]}`} alt="character" />
    </div>
  );
};

export default Character;
