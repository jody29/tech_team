![GitHub](https://img.shields.io/github/license/jody29/tech_team)
![node-current](https://img.shields.io/node/v/npm)
![npm](https://img.shields.io/npm/v/npm)
![GitHub last commit](https://img.shields.io/github/last-commit/jody29/tech_team)
![GitHub language count](https://img.shields.io/github/languages/count/jody29/tech_team)

# :iphone: Matching-app feature
## :musical_note: Description
For Blok-Tech we have to create a feauture for a matching-webapp. We learn to work with Git/GitHub, Node.js, Express, EJS & Mongodb Atlas.



### The Application
Sometimes your friends do not like the same music as you do. That means they do not enjoy the same concerts/festivals. You want to go to these events, but you know your friends won't have a good time. You do not want to bother your friends, so you are looking for people that will go with you and have a good time!

## :computer: How to install
Before you start, make sure you have Git, npm and Node.js installed on your computer.</br>
Then you can install my feature by following these simple steps: 
1. Clone the repository by running this code in your terminal:
```
$ git clone https://github.com/jody29/tech_team.git
```
2. Install all the npm packages by running this code in your terminal:</br> You should see a node_modules folder in the root when it is finished.
```
$ npm install
```
3. Create a database with MongoDB Atlas. This link will help you do it: https://docs.atlas.mongodb.com/getting-started/ </br>
4. In your **database collection** you should make documents like this:</br>  
![Mongo_Team_Tekengebied 1](https://user-images.githubusercontent.com/66092262/112736664-af89ca80-8f54-11eb-9edf-84a03b012dbe.png)

5. Create a ``.env`` file in the root of the folder. Place the following code in the ``.env`` file
```
DB_NAME = <Here comes your databasename>
M_URL = <Here comes your URL>
SESSION_SECRET = <here comes you session key>
APIKEY = <Here comes your API key>
```

And then you are good to go! :thumbsup: </br>


## 🌐 Deploying   
We deployed our web-application with [Heroku](https://id.heroku.com/login).   
You can see our result here: [https://music-matches.herokuapp.com/](https://music-matches.herokuapp.com/)

## :page_facing_up: License
MIT license - 2021 
