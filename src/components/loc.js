import React, { Component, useState,useEffect, useRef, ReactDOM } from 'react';
import { ReactOsmGeocoding } from '@paraboly/react-osm-geocoding';
import {MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLeaflet } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';

// Ant
import { Button, Tooltip, Input, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as L from "leaflet";
import 'antd/dist/antd.css'
const { Search } = Input;

const Loc = (props) => {

    
    const [map, setMap] = React.useState();
    const defaultCenter = [51.505, -0.09];
    const defaultZoom= 10;
    let suggestions = [];
    const searchInput = document.getElementById('search');
    const resultList = document.getElementById('result-list');
    const mapContainer = document.getElementById('map-container');
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
        
        if(resultList!== null) {
            resultList.innerHTML = "<h2>List of results</h2>";            
        }

        for (const marker of currentMarkers) {
            map.removeLayer(marker);
        }
        // map.flyTo(new L.LatLng(20.13847, 1.40625), 2);
        for (const result of parsedResult) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'list-group-item-action');
            li.innerHTML = result.display_name;
            li.setAttribute("data", JSON.stringify({
                    displayName: result.display_name,
                    lat: result.lat,
                    lon: result.lon
                }, undefined, 2));

            li.addEventListener('click', (event) => {
                for(const child of resultList.children) {
                    child.classList.remove('active');
                }
                event.target.classList.add('active');
                const clickedData = JSON.parse(event.target.getAttribute("data"));
                const position = new L.LatLng(clickedData.lat, clickedData.lon);
                map.setView(position, 17);
            })
            // currentMarkers.push(new L.marker(position).addTo(map));
            const position = new L.LatLng(result.lat, result.lon);
            resultList.appendChild(li);
        }
    }
  
    return (
        <div id='loc' style={{marginTop:"100px"}}>
            <h1>Look up a place</h1>
            <div>
                <Search placeholder="Search" onSearch={onSearch} style={{ width: 400 }} />  
            </div>
            <div className="map-result">
                <div id="result-list">
                    <h2>List of results</h2>
                </div>
                <div id="result-map" style={{height:"50vh"}}>
                <MapContainer whenCreated={setMap} center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Loc;