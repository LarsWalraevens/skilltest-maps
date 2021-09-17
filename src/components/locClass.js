import React, { Component, useState,useEffect, useRef } from 'react';
import { ReactOsmGeocoding } from '@paraboly/react-osm-geocoding';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Ant
import { Button, Tooltip, Input, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as L from "leaflet";
import 'antd/dist/antd.css'
const { Search } = Input;

class Loc extends Component {
    constructor(props) {
		super(props)
		this.state = {      
            suggestions: [],
            lat:"51.505",
            lon:"-0.09",
		}      
        this.onSearch = this.onSearch.bind(this);  
        this.onSelect = this.onSelect.bind(this);   
        this.changeMap = this.changeMap.bind(this);  
	}

    onSearch = (searchText) => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&polygon=1&addressdetails=1&q=' + searchText)
            .then(result => result.json())
            .then(parsedResult => {
                console.log(parsedResult);  
                this.setState({
                    suggestions: parsedResult
                })           
            }); 
    };
  
    onSelect (data) {
      console.log('onSelect', data);
    };
    
    changeMap(newlat, newlon) {

        // map.setView([newlat,newlon],14);
        this.setState({
            lat: newlat,
            lon: newlon
        });
    }

    render() {
        return (
            <div id='loc'>
                <div>
                    <Search placeholder="Search" onSearch={this.onSearch} style={{ width: 200 }} />      
                </div>
                <div id="result-list">
                    <ul>
                        {
                            Array.from(this.state.suggestions).map((item, index) => {
                                return (<li onClick={()=>this.changeMap(item.lat, item.lon)}>{item.display_name}</li>);
                            })
                        }
                    </ul>
                </div>
                <div style={{height:"50vh"}}>
                <div>
                    Current: lat: {this.state.lat} - lon: {this.state.lon}
                </div>
                <MapContainer whenCreated="" center={[this.state.lat, this.state.lon]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </MapContainer>
                </div>
            </div>
        );
    }
}

export default Loc;