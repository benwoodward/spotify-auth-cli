const opn = require('opn');
const express = require('express');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const clipboardy = require('clipboardy');
const querystring = require('querystring')
const axios = require('axios')


const PORT = argv.port || 4815
const CLIENT_ID = argv['clientId']
const CLIENT_SECRET = argv['clientSecret']
const SHOW_DIALOG = argv.showDialog || false
const SCOPE = argv.scope ? argv.scope.split(',').join('%20') : [
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'streaming',
  'ugc-image-upload',
  'user-follow-modify',
  'user-follow-read',
  'user-library-read',
  'user-library-modify',
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played'
].join('%20')

const REDIRECT_URI = 'http://localhost:' + PORT + '/callback'

const URL =
  'https://accounts.spotify.com/authorize'
  + '?client_id=' + CLIENT_ID
  + '&response_type=code'
  + '&scope=' + SCOPE
  + '&show_dialog=' + SHOW_DIALOG
  + '&redirect_uri=' + REDIRECT_URI


const app = express()

app.get('/callback', (req, res) => {
  res.sendFile(__dirname + '/callback.html')
  if (req.query.error) {
    console.log(chalk.red('Something went wrong. Error: '), req.query.error)
  }
})

app.get('/token', (req, res) => {
  res.sendStatus(200)
  const code = req.query.code
  if (code) {
    console.log(chalk.green('Received auth code.'));

    const requestBody = {
      'grant_type' : 'authorization_code',
      'code': code,
      'redirect_uri': REDIRECT_URI
    };

    const buf = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET);

    const clientToken = buf.toString('base64');

    const config = {
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': requestBody.length,
          'Authorization': 'Basic ' + clientToken
      }
    };

    const url = "https://accounts.spotify.com/api/token"

    axios.post(url, querystring.stringify(requestBody), config)
      .then((res) => {
        const access_token = res['data']['access_token'];
        const refresh_token = res['data']['refresh_token'];
        console.log(chalk.green('Your access token is: '), chalk.bold(access_token))
        console.log(chalk.green('Your refresh token is: '), chalk.bold(refresh_token))
        clipboardy.writeSync(refresh_token)
        process.exit()
      })
      .catch((err) => {
        console.error(err);
        process.exit()
      })
  }
})

const main = () => {
  app.listen(PORT, () => {
    console.log(chalk.blue('Opening the Spotify Login Dialog in your browser...'))
    opn(URL)
  })
}

module.exports = main
