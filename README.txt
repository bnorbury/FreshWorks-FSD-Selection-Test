#
# For quickly setting up a React/Node app I followed the tutorial at https://www.freecodecamp.org/news/create-a-react-frontend-a-node-express-backend-and-connect-them-together-c5798926047c/
#

This app uses a React client and a Node Express API server and MySQL 8.0 for the database

### Install the MySQL 8.0 Server ###
Install a MySQL server on the localhost and create a database named duck_tracker
Create a new table within duck_tracker called duck_feedings and give it the following columns:
  | date        | varchar(20)  
  | time        | varchar(20)  
  | location    | varchar(500) 
  | duck_count  | int          
  | food_amount | varchar(500)
  | food_type   | varchar(500)
Create the user 'ben' with the password 'hunter2' and grant it permissions for that table or the entire duck_tracker database

### Install the node packages
Run `npm install` in both the api and client directories for this project

### Start the client and api servers
Start the api server and the client server by running the `npm start` command from within both the api and client directories, make sure you have ports 3000 and 9000 free on localhost

### Testing it out
Navigate to localhost:3000 in your favorite web browser, it should have already opened after running `npm start` in the client directory
Fill out the form fields and click submit to feed some ducks.

### How the API works
There are only two api endpoints that a client can communicate with right now:
  localhost:9000/
    * this is the index and it just returns some text indicating how many ducks have been fed
    * it's just plaintext for displaying at the top of the client upon load
  localhost:9000/add-feeding
    * calling this api via post and passing in at least date, time, and duck_count values will save a new row to the duck_feedings table
    * location, food_amount, and food_type values are also accepted as additional data

