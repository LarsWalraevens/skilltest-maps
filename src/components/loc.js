import React, { Component, useState,useEffect, useRef, ReactDOM } from 'react';
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Ant
import { Input, AutoComplete, List } from 'antd';
import * as L from "leaflet";
import 'antd/dist/antd.css'
const { Search } = Input;

delete L.Icon.Default.prototype._getIconUrl;

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Loc = (props) => {    
    const [map, setMap] = React.useState();
    const defaultCenter = [50.6402809, 4.6667145];
    const defaultZoom= 10;
    let suggestions = [];
    const resultList = document.getElementById('result-list');
    const list = document.getElementById('list');
    const currentMarkers = [];   

    const onSearch = (searchText) => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + searchText)
            .then(result => result.json())
            .then(parsedResult => {
                suggestions= parsedResult;
                SetResultList(parsedResult);
            }); 
    };
    
    function SetResultList(parsedResult) {        
        let arrayList = [];

        if(resultList!== null) {
            resultList.innerHTML = "<h2>List of results</h2>";            
        }

        for (const marker of currentMarkers) {
            map.removeLayer(marker);
        }
        
        map.flyTo(new L.LatLng(20.13847, 1.40625), 2);
        for (const result of parsedResult) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'list-group-item-action');
            li.innerHTML = result.display_name;
            li.setAttribute("data", JSON.stringify({
                    displayName: result.display_name,
                    lat: result.lat,
                    lon: result.lon
                }, undefined, 2));

            arrayList.push(result.display_name);

            li.addEventListener('click', (event) => {
                for(const child of resultList.children) {
                    child.classList.remove('active');
                }
                event.target.classList.add('active');
                const clickedData = JSON.parse(event.target.getAttribute("data"));
                const position = new L.LatLng(clickedData.lat, clickedData.lon);
                map.setView(position, 17);
            })
            // list.setAttribute("dataSource", [arrayList]);
            // console.log(arrayList);
            const position = new L.LatLng(result.lat, result.lon);
            currentMarkers.push(new L.marker(position).addTo(map));
            resultList.appendChild(li);
        }
    }
  
    return (
        <div id='loc' style={{marginTop:"100px"}}>
            <h1>Look up a place</h1>
            <div>
                <Search placeholder="Street, adress, city, ..." onSearch={onSearch} style={{ width: 400 }} />  
            </div>
            <div className="map-result">
                <div id="result-list">
                    <h2>List of results</h2>
                    {/* <List id="list" size="small" bordered renderItem={item => <List.Item>{item}</List.Item>} /> */}
                    {/* <List
      size="small"
      bordered
      dataSource={["something"]}
      renderItem={item => <List.Item>{item}</List.Item>}
    /> */}
                </div>
                <div id="result-map" style={{height:"80vh"}}>
                <MapContainer whenCreated={setMap} center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
                    <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />

                </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Loc;