import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import PropTypes from 'prop-types';
import {weatherConditions} from '../utils/WeatherConditions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const Weather = ({weather, temperature, min_temperature, max_temperature, feels_like_temp, wind_speed, bycity, uv, next_temp}) => {
    return (
        <View style={[styles.weatherContainer, {backgroundColor: weatherConditions[weather].color}]}>
            <View style={styles.headerContainer}>
                <MaterialCommunityIcons size={72} name={weatherConditions[weather].icon} color={'#fff'}/>
                <Text style={styles.tempText}>{temperature}˚</Text>
            </View>
            <View style={styles.leftContainer}>
                <Text style={styles.subtitle}>Max today: {max_temperature}˚</Text>
            </View>
            <View style={styles.leftContainer}>
                <Text style={styles.subtitle}>Min today: {min_temperature}˚</Text>
            </View>
            <View style={styles.leftContainer}>
                <Text style={styles.subtitle}>Feels like: {feels_like_temp}˚</Text>
            </View>
            <View style={styles.leftContainer}>
                <Text style={styles.subtitle}>UV exposure: {uv}˚</Text>
            </View>
            <View style={styles.leftContainer}>
                <Text style={styles.subtitle}>Tomorrow: {next_temp}˚</Text>
            </View>
            <View style={styles.headerContainer}>
                <TouchableWithoutFeedback onPress={() => null}>
                    <GooglePlacesAutocomplete
                        on
                        placeholder='Search'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'search'}
                        keyboardAppearance={'light'}
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                            bycity(data.terms[0].value);
                        }}
                        getDefaultValue={() => ''}
                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyDonSRdX0d766vT2rJq5o0-T23rEhSvdRU',
                            language: 'en',
                            types: '(cities)'
                        }}
                        styles={{
                            textInputContainer: {
                                width: '100%',
                            },
                            description: {
                                fontWeight: 'bold',
                                color: 'white',

                            },
                            predefinedPlacesDescription: {
                                color: '#1faadb'
                            }
                        }}
                        nearbyPlacesAPI='GooglePlacesSearch'
                        GoogleReverseGeocodingQuery={{}}
                        GooglePlacesSearchQuery={{
                            rankby: 'distance',
                            type: 'cafe'
                        }}
                        GooglePlacesDetailsQuery={{
                            fields: 'formatted_address',
                        }}
                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                        debounce={200}
                        renderRightButton={() => <Text style={styles.subtitle}>Search by city</Text>}
                    />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.bodyContainer}>
                <Text style={styles.title}>{weatherConditions[weather].title}</Text>
                <Text style={styles.subtitle}>{weatherConditions[weather].subtitle}</Text>
                <Text style={styles.subtitle}>Wind speed: {wind_speed} m/s</Text>
            </View>
        </View>
    );
};

Weather.propTypes = {
    temperature: PropTypes.number.isRequired,
    weather: PropTypes.string
};
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({

    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: '#ffffff',
        fontSize: 16
    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    weatherContainer: {
        flex: 1,
        width,
        height,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    leftContainer: {
        flex: 1,
        paddingLeft: 100,
        marginBottom: -25,
        marginTop: -70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tempText: {
        fontSize: 72,
        color: '#fff',
    },
    bodyContainer: {
        flex: 2,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        paddingLeft: 25,
        marginBottom: 40
    },
    title: {
        fontSize: 60,
        color: '#fff'
    },
    subtitle: {
        fontSize: 24,
        color: '#fff'
    }
});
export default Weather;