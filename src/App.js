import * as React from "react";
import './styles/App.scss';
import {CardContent, FormControl} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useEffect, useState} from "react";
import {InfoBox} from "./components/InfoBox";
import {Map} from "./components/Map";
import Card from "@material-ui/core/Card";
import {Table} from "./components/Table";
import {printPrettyStat, sortData} from "./components/util";
import {LineGraph} from "./components/LineGraph";

export const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => response.json()).then(data => {
      setCountryInfo(data)
    })
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url).then(response => response.json()).then(data => {
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    })
  }

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));

        const sortedData = sortData(data);
        setTableData(sortedData)
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, [])

  return (
    <div className="app">

      <div className="app__left">
        <div className="app__header">
          <h1 className="app__heading">COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" defaultValue={country} onChange={onCountryChange}>
              <MenuItem value={country}>{country}</MenuItem>
              {countries.map(country => <MenuItem value={country.value}>{country.name}</MenuItem>)}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox color={"red"} active={"cases"} onClick={(e) => setCasesType("cases")} title={"Coronavirus cases"}
                   cases={printPrettyStat(countryInfo.todayCases)}
                   total={printPrettyStat(countryInfo.cases)}/>
          <InfoBox color={"green"} active={"recovered"} onClick={(e) => setCasesType("recovered")} title={"Recovered"}
                   cases={printPrettyStat(countryInfo.todayRecovered)}
                   total={printPrettyStat(countryInfo.recovered)}/>
          <InfoBox color={"black"} active={"deaths"} onClick={(e) => setCasesType("deaths")} title={"Deaths"}
                   cases={printPrettyStat(countryInfo.todayDeaths)} total={printPrettyStat(countryInfo.deaths)}/>
        </div>

        <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
        <Card style={{marginTop: 15}}>
          <CardContent>
            <h3 style={{marginBottom: 15}}>Worldwide {casesType === "cases" ? null : casesType} cases: </h3>
            <LineGraph casesType={casesType}/>
          </CardContent></Card>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
        </CardContent>
      </Card>
    </div>
  );
}