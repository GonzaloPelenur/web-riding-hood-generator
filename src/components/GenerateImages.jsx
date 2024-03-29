import React from "react";

const GenerateImages = ({ textColor, hexColor, generateAllSceneImages }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold pt-6">Click to generate all images</h1>
      <form onSubmit={(event) => generateAllSceneImages(event)}>
        <button
          type="submit"
          style={{
            color: textColor,
            backgroundColor: hexColor,
          }}
          className="button-regenerate"
        >
          Generate
        </button>
      </form>
    </div>
  );
};

export default GenerateImages;
