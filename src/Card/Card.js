import React from "react";
import CardItem from "./CardItem";
import "./Card.css";

import Grow from "@material-ui/core/Grow";

const Card = ({ name, data }) => {
  console.log(name, data);
  const bgColour = [];
  if (name === "Adzuna") bgColour.push("#00cd00", "green");
  if (name === "CVLibrary") bgColour.push("#0000ff", "blue");
  if (name === "Reed") bgColour.push("#cf04a9", "pink");

  return (
    <Grow in style={{ transformOrigin: "0 0 0" }} {...{ timeout: 1000 }}>
      <div className="card">
        <h1 className="title-style" style={{ color: bgColour[0] }}>
          {name}
        </h1>
        {!data.length ? (
          <h2 style={{ color: "#8842d5" }}>Unable to find results</h2>
        ) : (
          <CardItem data={data} colour={bgColour[1]} />
        )}
      </div>
    </Grow>
  );
};

export default Card;
