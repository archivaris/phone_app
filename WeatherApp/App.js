import React from 'react';
import {Alert, Button, Dimensions, Share, StyleSheet, Text, View} from 'react-native';
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
        next_temp: null,
    };
    speak = () => {
        var thingToSay = 'You should expect ,  ' + this.state.weatherCondition + ' today.';
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
            Alert.alert(error.message);
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
            }).then(() => {
            fetch(
                `http://api.openweathermap.org/data/2.5/uvi?appid=${API_KEY}&lat=${lat}&lon=${long} `
            ).then(resp => resp.json())
                .then(json => {
                    this.setState({
                        uv: json.value
                    });
                })
        }).then(() => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API_KEY}&units=metric`
            ).then(resp => resp.json())
                .then(json => {
                    this.setState({
                        next_temp: json.list[13].main.temp
                    })
                });
        })
    }

    _showAlert = () => {
        Alert.alert(
            'IMPORTANT',
            'No threatening news.',
            [
                {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false}
        )
    };

    fetchWeatherbyCity(city) {
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
        }).then(() => {
            fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.coord_lat}&lon=${this.state.coord_long}&appid=${API_KEY}&units=metric`
            ).then(resp => resp.json())
                .then(json => {
                    this.setState({
                        next_temp: json.list[13].main.temp
                    })
                })
        })
    }

    render() {
        const {temperature, weatherCondition, isLoading, min_temperature, max_temperature, feels_like_temp, wind_speed, uv, next_temp} = this.state;
        return (
            <View style={styles.container}>
                {isLoading ? <Text>Fetching Weather Data</Text> :
                    <Weather weather={weatherCondition} temperature={temperature} min_temperature={min_temperature}
                             max_temperature={max_temperature} feels_like_temp={feels_like_temp}
                             wind_speed={wind_speed} bycity={this.fetchWeatherbyCity.bind(this)} uv={uv}
                             next_temp={next_temp}/>
                }
                <Button onPress={this.onShare} title="Share App"/>
                <Button title={'refresh local weather'} onPress={() => this._onRefresh()}/>
                <Button title="What's the weather like?" onPress={this.speak}/>
                <Button title='Alert' onPress={this._showAlert}/>
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
    }, button: {
        margin: 24,
        padding: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "transparent",
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#34495e',
        backgroundColor: '#ff6666'
    },
});
