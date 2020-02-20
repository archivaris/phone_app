import React from 'react';
import {Button, Dimensions, Share, StyleSheet, Text, View} from 'react-native';
import Weather from './components/Weather';
import {API_KEY} from './utils/APIKEY';


import * as Speech from 'expo-speech';

window.yellowbox = false;

export default class App extends React.Component {
    state = {
        token: '',
        isLoading: false,
        temperature: 24,
        min_temperature: 1,
        max_temperature: 40,
        feels_like_temp: 24,
        city: undefined,
        country: undefined,
        wind_speed: 7,
        weatherCondition: 'Thunderstorm',
        error: null,
        refreshing: false,
        uv: null,
    };

    speak = () => {
        var thingToSay = 'Fuck you,  ' + this.state.weatherCondition;
        Speech.speak(thingToSay);
    };

    onShare = async () => {
        try {
            const result = await Share.share({
                message: 'WeatherApp: best app to watch live weather.',
                url: 'http://www.weatherapp.local',
                title: 'Wow, check this app out!'
            },);
        } catch (error) {
            alert(error.message);
        }
    };

    _onRefresh = () => {
        this.setState({refreshing: true});
        navigator.geolocation.getCurrentPosition(
            position => {
                this.fetchWeather(position.coords.latitude, position.coords.longitude);
            }
        );
        this.setState({refreshing: false});
    };

    componentDidMount() {

        navigator.geolocation.getCurrentPosition(
            position => {
                this.fetchWeather(position.coords.latitude, position.coords.longitude);
                this.fetchUV(position.coords.latitude, position.coords.longitude);
            },
            error => {
                this.setState({
                    error: 'Error Getting Weather Conditions'
                });
            }
        );
    }


    fetchWeather(lat, long) {
        fetch(
            `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${API_KEY}&units=metric`
        )
            .then(resp => resp.json())
            .then(json => {
                this.setState({
                    temperature: json.main.temp,
                    min_temperature: json.main.temp_min,
                    max_temperature: json.main.temp_max,
                    feels_like_temp: json.main.feels_like,
                    wind_speed: json.wind.speed,
                    weatherCondition: json.weather[0].main,
                    isLoading: false,
                })
            });
    }

    fetchUV(lat, long) {
        fetch(
            `http://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${long} `
        ).then(resp => resp.json())
            .then(json => {
                this.setState({
                    uv: json.value
                });
            })
    }

    fetchCityUV(city) {
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`).then(resp => resp.json())
            .then(json => {
                this.setState({
                    coord_lat: json.coord.lat,
                    coord_long: json.coord.lon,
                    temperature: json.main.temp,
                    min_temperature: json.main.temp_min,
                    max_temperature: json.main.temp_max,
                    feels_like_temp: json.main.feels_like,
                    wind_speed: json.wind.speed,
                    weatherCondition: json.weather[0].main,
                    isLoading: false,
                });
            }).then(() => {
                const url = `http://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${this.state.coord_lat}&lon=${this.state.coord_long}`;
                console.log(url);
            fetch(url).then(resp => resp.json())
                .then(json => {
                    console.log(json.value);
                    this.setState({
                        uv: json.value,
                    })
                })
        });
    }


    fetchWeatherbyCity(city) {
        fetch(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        )
            .then(resp => resp.json())
            .then(json => {
                this.setState({
                    coord_lat: json.coord.lat,
                    coord_long: json.coord.lon,
                    temperature: json.main.temp,
                    min_temperature: json.main.temp_min,
                    max_temperature: json.main.temp_max,
                    feels_like_temp: json.main.feels_like,
                    wind_speed: json.wind.speed,
                    weatherCondition: json.weather[0].main,
                    isLoading: false,
                })
            });
    }

    render() {
        const {temperature, weatherCondition, isLoading, min_temperature, max_temperature, feels_like_temp, wind_speed, uv} = this.state;
        return (
            <View style={styles.container}>
                {isLoading ? <Text>Fetching Weather Data</Text> :
                    <Weather weather={weatherCondition} temperature={temperature} min_temperature={min_temperature}
                             max_temperature={max_temperature} feels_like_temp={feels_like_temp}
                             wind_speed={wind_speed} bycity={this.fetchWeatherbyCity.bind(this)} uv={this.fetchCityUV.bind(this)}/>
                }
                <Button onPress={this.onShare} title="Share"/>
                <Button title={'refresh'} onPress={() => this._onRefresh()}/>
                <Button title="Press to hear some words" onPress={this.speak}/>
            </View>
        );
    }
}

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width,
        // height,
        backgroundColor: '#ffffff'
    },
});
