# Epiphany!
Web Application that allows you to brainstorm completely virtually!


## Getting started
- In order to run this software, you need to have node and mongoDB set up on your computer
- For macs we recommend to use Homebrew (https://brew.sh/) in order to install these
- Feel free to install in another way, just make sure that node and mongoDB have been install correctly
1. First install Homebrew https://brew.sh/ and add Homebrew's location to your path to 
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
export PATH="/usr/local/bin:$PATH"

```
2. Install node.js using brew https://changelog.com/posts/install-node-js-with-homebrew-on-os-x
```
brew install node
```
3. Install mongoDB and make a directory for mongo to place things
```
brew install mongodb
mkdir -p /data/db
sudo chmod go+w /data/db
```
`sudo chmod go+w /data/db` is used to allow you permission to write the database
4. Now you can clone this directory and start running it!
```
git clone https://github.com/StanfordCS194/epiphany.git
```
5. Move into app/ and do
```
npm install
```
6. Now in one terminal window run
```
mongod
```
This will begin to run the mongo database and get it ready to receive and return data
7. In another window run 
```
node_modules/.bin/nodemon server.js
```
This will begin the server, built in node and express which will handle GET and POST requests
8. And in another termainal window run
```
 npm run build:w
```
This will continually compile the code in index.js into a bundle of vanilla js code which will be exectuted by index.html
9. You're done with the install and you can play with the app. Navigate to `localhost:3000` in your choice of browser.

## Built With
* [MongoDB](https://www.mongodb.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node](https://nodejs.org/)
