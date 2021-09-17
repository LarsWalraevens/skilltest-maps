import React, { Component } from 'react';
import { ReactOsmGeocoding } from '@paraboly/react-osm-geocoding';
import '@paraboly/react-osm-geocoding/dist/index.css';
import Geolookup from 'react-geolookup-v2';
import * as Nominatim from 'nominatim-browser';
import { Button } from 'antd';

import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			longitude: 0,
			latitude:0
		}
		this.onSuggestsLookup = this.onSuggestsLookup.bind(this);
		this.getSuggestLabel = this.getSuggestLabel.bind(this);
		this.onGeocodeSuggest = this.onGeocodeSuggest.bind(this);
	}  
	

onSuggestsLookup(userInput) {
	
    return Nominatim.geocode({
      q: userInput,
      addressdetails: true
    });
  }

  onGeocodeSuggest(suggest) {
    let geocoded = {};
    if (suggest) {
      geocoded.nominatim = suggest.raw || {};
      geocoded.location = {
        lat: suggest.raw ? suggest.raw.lat : '',
        lon: suggest.raw ? suggest.raw.lon : ''
      };
      geocoded.placeId = suggest.placeId;
      geocoded.isFixture = suggest.isFixture;
      geocoded.label = suggest.raw ? suggest.raw.display_name : '';

	//   this.setState({
	// 	  longitude: suggest.raw.lon,
	// 	  latitude: suggest.raw.lat
	//   });
    }

    return geocoded;
  }
  
  getSuggestLabel(suggest) {
	  
	console.log("searched")
    return suggest.display_name;
  }

	render() {
		return (
			<div id='home'>
				<Geolookup
					inputClassName="geolookup__input--nominatim"
					disableAutoLookup={true}
					onSuggestsLookup={this.onSuggestsLookup}
					onGeocodeSuggest={this.onGeocodeSuggest}
					getSuggestLabel={this.getSuggestLabel}
					radius="20"
				/>

				<div className="map">
					<Map google={this.props.google} style={{width:'100%', height:"100%"}} zoom={18} center={{
                      lat: this.state.latitude,
                      lng: this.state.longitude }} >
						  
						<Marker position={{lat: this.state.latitude,
                      	lng: this.state.longitude}} />
					</Map>
              </div>
			</div>
		);
	}
}

export default Home;