import React from "react";
import ColorPicker from "./ColorPicker";
import { Input, Button } from "@nextui-org/react";

const InitialInput = ({
  handleSubmit,
  mapColor,
  handleColorPickerChange,
  inputValue,
  handleChange,
  colorPicker,
}) => {
  return (
    <div>
      <h1 className="text-2xl font-bold pt-6">
        Enter a pantone color and click submit to generate a story
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <div style={{ marginRight: "8px" }}>
          {" "}
          {/* Adjust spacing as needed */}
          <Input
            key="outside-left"
            type="text"
            labelPlacement="outside-left"
            placeholder="moonstruck"
            description="Enter a Pantone color"
            value={inputValue}
            onChange={handleChange}
          />
        </div>

        {/* Add a submit button to the form */}
        <Button type="submit">Submit</Button>
      </form>
      <div>
        <form onSubmit={mapColor}>
          <ColorPicker onColorChange={handleColorPickerChange} />
          <p>Selected Color: {colorPicker.toUpperCase()}</p>{" "}
          <Button type="submit">Map Color</Button>
        </form>
      </div>
    </div>
  );
};

export default InitialInput;
