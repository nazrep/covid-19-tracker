import * as React from "react";
import {Typography} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "../styles/InfoBox.scss";

export const InfoBox = ({title, cases, total, active, color, ...props}) => {

  const getColor = (color) => {
    return color === "red" ? {color: "red"} : color === "green" ? {color: "green"} : {color: "black"};
  }

  const getClassName = (active) =>{
    return `infoBox ${active === "cases" ? "infoBox--cases" : active === "recovered" ? "infoBox--recovered" : "infoBox--deaths"}`;
  }

  return (
    <Card onClick={props.onClick}
          className={getClassName(active)}>
      <CardContent>
        <Typography style={getColor(color)}
                    className="infoBox__title">{title}</Typography>
        <h2 style={getColor(color)}
            className="infoBox__cases"><strong>{cases ? cases : "+0.0"}</strong></h2>
        <Typography style={getColor(color)}
                    className="infoBox__total">Total: <strong>{total}</strong></Typography>
      </CardContent>
    </Card>
  )
}