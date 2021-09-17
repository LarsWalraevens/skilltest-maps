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
    const defaultZoom= 13;
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
            resultList.innerHTML = "";            
        }

        for (const marker of currentMarkers) {
            map.removeLayer(marker);
        }
        // map.flyTo(new L.LatLng(20.13847, 1.40625), 2);
        for (const result of parsedResult) {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'list-group-item-action');
            // li.innerHTML = result.display_name;
            // li.setAttribute("data", JSON.stringify({
            //         displayName: result.display_name,
            //         lat: result.lat,
            //         lon: result.lon
            //     }, undefined, 2));

            li.innerHTML = JSON.stringify({
                displayName: result.display_name,
                lat: result.lat,
                lon: result.lon
            }, undefined, 2);
            li.addEventListener('click', (event) => {
                for(const child of resultList.children) {
                    child.classList.remove('active');
                }
                event.target.classList.add('active');
                const clickedData = JSON.parse(event.target.innerHTML);
                console.log((event.target));
                const position = new L.LatLng(clickedData.lat, clickedData.lon);
                console.log(map)
                map.flyTo(position, 10);
            })
            const position = new L.LatLng(result.lat, result.lon);
            // currentMarkers.push(new L.marker(position).addTo(map));
            resultList.appendChild(li);
        }
    }
  
    function handleSetView(newlat, newlon) {
        map.setView([newlat, newlon], defaultZoom);
    }

        return (
            <div id='loc'>
                <div>
                    <Search placeholder="Search" onSearch={onSearch} style={{ width: 200 }} />  
                </div>
                <div id="result-list">
                    .
                    {/* <ul>
                        {
                            // (suggestions).map((item, index) => {
                            //     return (<li onClick={()=>handleSetView(item.lat, item.lon)}>{item.display_name}</li>);
                            // })
                        }
                    </ul> */}
                </div>
                <div style={{height:"50vh"}}>
                <MapContainer whenCreated={setMap} center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
                </div>
            </div>
        );
}

export default Loc;