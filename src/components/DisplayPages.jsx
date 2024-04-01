import React from "react";

const DisplayPages = ({ name, pages }) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        borderRadius: "20px",
        alignContent: "center",
      }}
    >
      <h1 className="text-2xl font-bold pt-6">
        Here's the script for Little {name} Riding Hood
      </h1>
      {pages.map((page, index) => (
        <p key={index}>
          [{index + 1}]: {page}
        </p>
      ))}
    </div>
  );
};

export default DisplayPages;
