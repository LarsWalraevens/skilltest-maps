import React, { useState } from 'react';
import {MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Ant
import { Input } from 'antd';
import 'antd/dist/antd.css'
import { useEffect } from 'react/cjs/react.development';

import * as L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const { Search } = Input;


delete L.Icon.Default.prototype._getIconUrl;

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const Loc = () => {    
    const defaultCenter = [50.6402809, 4.6667145];
    const defaultZoom= 10; 
    const [map, setMap] = useState(); 
    const [resultsList, setResultsList] = useState();
    const [clicked, setClicked] = useState();
    const [searchText, setSearchText] =useState();

    const onSearch = async (searchText) => {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + searchText)
        const result = await response.json()
        setResultsList(result);
        setClicked(undefined);
        setSearchText(searchText);
    };
  
    useEffect(()=> {
        if(map) {
            if(clicked) {
                map.flyTo([clicked.lat, clicked.lon], 16);
            } else if(resultsList && resultsList?.length) {
                const coordinates = resultsList.map((item) => ([item.lat, item.lon]));
                map.fitBounds(coordinates);
            } else {
                map.flyTo(defaultCenter, 12);
            }
            
        }

    },[map, clicked, defaultCenter, resultsList])
    return (
        <div id='loc' style={{marginTop:"100px"}}>
            <h1>Look up a place</h1>
            <div>
                <Search placeholder="Street, adress, city, ..." onSearch={onSearch} style={{ width: 400 }} />  
            </div>
            <div className="map-result">
                <div id="result-list">
                    <h2>List of results</h2>
                    { searchText && <div>Options for: '{searchText}'</div> }
                    <ul>
                        {
                            resultsList && resultsList.map((item, key) => 
                                <li key={key} className="list-group-item list-group-item-action" onClick={() => {
                                    setClicked(item)
                                }}>
                                    {item.display_name}
                                </li>
                            )
                        }
                    </ul>
                </div>
                <div id="result-map" style={{height:"80vh"}}>
                <MapContainer whenCreated={setMap} center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
                    <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                    />

                    {
                        clicked === undefined && resultsList && resultsList.map((item, key) => (
                            <Marker key={key} position={[item.lat, item.lon]} />
                        )) 
                    }

                    {
                        clicked && <Marker position={[clicked.lat, clicked.lon]} />
                    }

                </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default Loc;
