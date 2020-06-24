import React, { Component } from 'react';
import logo from './duck-logo.png';
import './App.css';

const apiEndpoint = 'http://localhost:9000/';

class App extends Component {
  //set default state values here
  constructor(props) {
    super(props);
    var now = new Date();
    this.state = { 
      apiResponse: ""
      , formErrorMessage: "" 
      , formData: {
        //default the date and time to now
        date: now.toLocaleDateString('en-GB')
        , time: now.toLocaleTimeString('en-US').replace(/:\d\d /, ' ')
        , location: ''
        , duck_count: 1
        , food_amount: ''
        , food_type: ''
      }
      , formFieldErrors: {
        date: ''
        , time: ''
        , duck_count: ''
      }
    };
    
    this.errorMessage = '';
  }

  
  handleChange = (event) => {
    var formData = this.state.formData;
    formData[event.target.name] = event.target.value;
    this.setState({ 'formData': formData });
  }

  callAPI() {
    fetch(apiEndpoint)
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res}));
  }

  //upon page load get the number of ducks fed from the api
  componentDidMount() {
    this.callAPI();
  }
  
  render() {    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="app-intro" id="AppIntro">
            {this.state.apiResponse}
          </p>
          <form id="FeedDucksForm" action="#" onSubmit={this.addFeeding} method="post">
            <div className="form-error">{this.state.formErrorMessage}</div>
            <div className="form-success">{this.state.formSuccessMessage}</div>
            <div className="input">
              <label> Date
                <input value={this.state.formData.date} id="FeedDucksDate" type="text" name="date" onChange={this.handleChange} />
                <div className="field-error">{this.state.formFieldErrors.date}</div>
              </label>
            </div>
            <div className="input">
              <label> Time
                <input value={this.state.formData.time} id="FeedDucksTime" type="text" name="time" onChange={this.handleChange} />
                <div className="field-error">{this.state.formFieldErrors.time}</div>
              </label>
            </div>
            <div className="input">
              <label>Location
                <input value={this.state.formData.location} id="FeedDucksLocation" type="text" name="location" onChange={this.handleChange} />
              </label>
            </div>
            <div className="input">
              <label>Number of Ducks Fed
                <input value={this.state.formData.duck_count} id="FeedDucksDuckCount" type="number" name="duck_count" step="1" min="1" onChange={this.handleChange} />
                <div className="field-error">{this.state.formFieldErrors.duck_count}</div>
              </label>
            </div>
            <div className="input">
              <label>Amount of Food
                <input value={this.state.formData.food_amount} id="FeedDucksFoodAmount" type="text" name="food_amount" placeholder="20 grams, 2 slices, etc." onChange={this.handleChange} />
              </label>
            </div>
            <div className="input">
              <label>Type of Food
                <input value={this.state.formData.food_type} id="FeedDucksFoodType" type="text" name="food_type" placeholder="bread, bird seed, nuts, etc." onChange={this.handleChange} />
              </label>
            </div>
            <div className="row-splitter"></div>
            <input type="submit" value="Feed Ducks"/>
          </form>
        </header>
      </div>
    );
  }
  
  addFeeding = (event) => {
    event.preventDefault();
    
    //reset the state of the form when it's submitted so that the error messages go away
    this.setState({
      formSuccessMessage: ''
      , formErrorMessage: ''
      , formFieldErrors: {
        date: ''
        , time: ''
        , duck_count: ''
      }
      , apiResponse: ""
    });
    
    //send the form values to the api
    fetch( apiEndpoint + 'add-feeding', {
      'method': "POST"
      , 'body': JSON.stringify(this.state.formData)
      , 'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.text())
      .then(res => { 
        //catch json parse errors and log them
        try { 
          res = JSON.parse(res) 
        } catch(e) { 
          console.log(e, res); 
        }
        
        //display form errors on the screen
        if (res.success) {
          this.setState({
            formErrorMessage: ''
            , formSuccessMessage: res.message
          });
        } else if (res.error && res.message) {
          //set form error messages
          this.setState({ formErrorMessage: res.message });
          //set the error messages for the specific fields if there are any
          if (res.errorData) {
            this.setState({ formFieldErrors: res.errorData.fields });
          }
        } else {
          //a server error ocurred on the api side that caused the JSON response to generate incorrectly
          this.setState({ formErrorMessage: 'Something went wrong with the form submission, please try again later.' });
        }
      });
    
    return false;
  }
}

export default App;
