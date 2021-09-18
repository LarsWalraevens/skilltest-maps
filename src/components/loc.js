import React, { useState } from 'react';
import {MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Ant
import { Input } from 'antd';
import 'antd/dist/antd.css'
const { Search } = Input;

const Loc = () => {    
    const defaultCenter = [50.6402809, 4.6667145];
    const defaultZoom= 10; 
    const [resultsList, setResultsList] = useState();
    const [clicked, setClicked] = useState();

    const onSearch = (searchText) => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + searchText)
            .then(result => result.json())
            .then(parsedResult => {
                setResultsList(parsedResult);
                setClicked(undefined);
            }); 
            resultList.innerHTML = "<h2>List of results</h2> <div>Options for: '" + searchText + "'</div>";;
    };
  
    return (
        <div id='loc' style={{marginTop:"100px"}}>
            <h1>Look up a place</h1>
            <div>
                <Search placeholder="Street, adress, city, ..." onSearch={onSearch} style={{ width: 400 }} />  
            </div>
            <div className="map-result">
                <div id="result-list">
                    <h2>List of results</h2>
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
                <MapContainer center={defaultCenter} zoom={defaultZoom} scrollWheelZoom={true}>
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
