import React from 'react';
import './App.css';
import Weather from './components/Weather-component';
import Form from './components/Form-component';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.min.css';

//API call api.openweathermap.org/data/2.5/weather?q=London,uk&appid={API key}
const API_KEY = '16a916b000a0f8b3295060ca61014b52';

class App extends React.Component{
  constructor(){
    super();
    this.state={
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description:'',
      error: false
    };
  
    this.weatherIcon = {
      Thunderstorm:'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-storm-showers',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog'
    }
  }

  calCelsius(temp){
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  get_WeatherIcon(icons, rangeId){
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        this.setState({icon: this.weatherIcon.Thunderstorm})
      break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({icon: this.weatherIcon.Drizzle})
      break;
      case rangeId >= 500 && rangeId <= 531:
        this.setState({icon: this.weatherIcon.Rain})
      break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({icon: this.weatherIcon.Atmosphere})
      break;
      case rangeId >= 801 && rangeId <= 804:
        this.setState({icon: this.weatherIcon.Clouds})
      break;
      case rangeId === 800:
        this.setState({icon: this.weatherIcon.Clear})
      break;
      default:
        this.setState({icon: this.weatherIcon.Clouds})
    }
  }

  getWeather = async (e) => {
    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if(city && country){
      const api_call = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`);
      const responce = await api_call.json()
  
      console.log(responce);
   
      this.setState({
        city: `${responce.name}, ${responce.sys.country}`,
        celsius: this.calCelsius(responce.main.temp),
        temp_max: this.calCelsius(responce.main.temp_max),
        temp_min: this.calCelsius(responce.main.temp_min),
        description: responce.weather[0].description,
        error: false
      });

      this.get_WeatherIcon(this.weatherIcon, responce.weather[0].id);

    } else {
        this.setState({error:true});
      } 
  }

  state = {};
  render() {
    return(
      <div className="App">
        <Form loadWeather={this.getWeather} error={this.state.error} /> 
        <Weather 
        city={this.state.city} 
        country={this.state.country}
        celsius= {this.state.celsius}
        temp_max= {this.state.temp_max}
        temp_min= {this.state.temp_min}
        description= {this.state.description}
        weatherIcon= {this.state.icon}
        />
      </div>
    );
  }
}

export default App;
