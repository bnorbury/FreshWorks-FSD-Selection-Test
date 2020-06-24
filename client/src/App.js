import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const apiEndpoint = 'http://localhost:9000/';

class App extends Component {
  constructor(props) {
    super(props);
    var now = new Date();
    this.state = { 
      apiResponse: ""
      , formErrorMessage: "" 
      , formData: {
        date: now.toLocaleDateString('en-GB')
        , time: now.toLocaleTimeString('en-US').replace(/:\d\d /, ' ')
        , location: ''
        , duck_count: 1
        , food_amount: ''
        , food_type: ''
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

  componentWillMount() {
    this.callAPI();
  }
  
  render() {    
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p className="App-intro">
            {this.state.apiResponse}
          </p>
          <form id="FeedDucksForm" action="#" onSubmit={this.addFeeding} method="post">
            <div class="form-error"> {this.state.formErrorMessage}</div>
            <div>
              <label> Date
                <input value={this.state.formData.date} id="FeedDucksDate" type="text" name="date" onChange={this.handleChange} />
              </label>
            </div>
            <div>
              <label> Time
                <input value={this.state.formData.time} id="FeedDucksTime" type="text" name="time" onChange={this.handleChange} />
              </label>
            </div>
            <div>
              <label>Location
                <input value={this.state.formData.location} id="FeedDucksLocation" type="text" name="location" onChange={this.handleChange} />
              </label>
            </div>
            <div>
              <label>Number of Ducks Fed
                <input value={this.state.formData.duck_count} id="FeedDucksDuckCount" type="number" name="duck_count" step="1" min="1" onChange={this.handleChange} />
              </label>
            </div>
            <div>
              <label>Amount of Food
                <input value={this.state.formData.food_amount} id="FeedDucksFoodAmount" type="text" name="food_amount" placeholder="20 grams, 2 slices, etc." onChange={this.handleChange} />
              </label>
            </div>
            <div>
              <label>Type of Food
                <input value={this.state.formData.food_type} id="FeedDucksFoodType" type="text" name="food_type" placeholder="bread, bird seed, nuts, etc." onChange={this.handleChange} />
              </label>
            </div>
            <input type="submit" value="Feed Ducks"/>
          </form>
        </header>
      </div>
    );
  }
  
  addFeeding = (event) => {
    event.preventDefault();
    
    fetch( apiEndpoint + 'add-feeding', {
      'method': "POST"
      , 'body': JSON.stringify(this.state.formData)
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
          console.log('Fed some ducks');
          if (res.data.duck_count) {
            this.setState({formErrorMessage: res.message});
          }
        } else if (res.error && res.message) {
          this.setState({formErrorMessage: res.message});
        } else {
          //a server error ocurred on the api side that caused the JSON response to generate incorrectly
          this.setState({formErrorMessage: 'Something went wrong with the form submission, please try again later.'});
        }
      });
    
    return false;
  }
}

export default App;
