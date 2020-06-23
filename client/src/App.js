import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const apiEndpoint = 'http://localhost:9000/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
    
    this.errorMessage = '';
  }

  callAPI() {
    fetch(apiEndpoint)
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
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
            {this.errorMessage}
            <div>
              <label for="FeedDucksDate">Date</label>
              <input id="FeedDucksDate" type="text" name="date" />
            </div>
            <div>
              <label for="FeedDucksTime">Time</label>
              <input id="FeedDucksTime" type="text" name="time" />
            </div>
            <div>
              <label for="FeedDucksLocation">Location</label>
              <input id="FeedDucksLocation" type="text" name="location" />
            </div>
            <div>
              <label for="FeedDucksDuckCount">Number of Ducks Fed</label>
              <input id="FeedDucksDuckCount" type="number" name="duck_count" step="1" />
            </div>
            <div>
              <label for="FeedDucksFoodAmount">Amount of Food</label>
              <input id="FeedDucksFoodAmount" type="text" name="food_amount" placeholder="20 grams, 2 slices, etc." />
            </div>
            <div>
              <label for="FeedDucksFoodType">Type of Food</label>
              <input id="FeedDucksFoodType" type="text" name="food_type" placeholder="bread, bird seed, nuts, etc." />
            </div>
            <input type="submit" value="Feed Ducks"/>
          </form>
        </header>
      </div>
    );
  }
  
  addFeeding(event) {
    event.preventDefault();
    var formData = {
      'date': event.target.date.value
      , 'time': event.target.time.value
      , 'location': event.target.location.value
      , 'duck_count': event.target.duck_count.value
      , 'food_amount': event.target.food_amount.value
      , 'food_type': event.target.food_type.value
    };
    
    fetch( apiEndpoint + 'add-feeding', {
      'method': "POST"
      , 'body': JSON.stringify(formData)
    })
      .then(res => res.text())
      //catch json parse errors and log them
      .then(res => { try { return JSON.parse(res) } catch(e) { console.log(e, res); return res; } } )
      .then(res => {
        if (res.success) {
          console.log('Fed some ducks');
        } else if (res.error && res.message) {
          this.errorMessage = res.message;
        }
      });
    
    return false;
  }
}

export default App;
