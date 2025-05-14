Clone the repository

git clone repository
cd <project-folder>

Install dependencies

npm install

Register a user

Method: POST 
EndpointURL: http://localhost:4000/api/auth/register

Body (JSON):
{
  "username": "exampleUser",
  "password": "examplePassword123"
}
This will create a new user and store their information in the database. The response will confirm the registration.


Log in to get a JWT token

Method :POST 
EndpointURL: http://localhost:4000/api/auth//login

Body (JSON):
{
  "username": "exampleUser",
  "password": "examplePassword123"
}
