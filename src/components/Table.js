import * as React from "react";
import "../styles/Table.scss";
import numeral from "numeral";

export const Table = ({countries}) => {
  return (
    <div className="table">
      {countries.map(({country, cases}) => (
        <>
          <tr>
            <td>{country}</td>
            <td><strong>{numeral(cases).format(",")}</strong></td>
          </tr>
        </>))}
    </div>
  )
}