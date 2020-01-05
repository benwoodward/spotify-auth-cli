# Spotify CLI Authentication
A tiny helper tool that can be used to quickly fetch a Spotify access token from with the command line.

### Installation
```
$ npm install -g spotify-auth-code-flow-cli
```

### Usage
1. Register a Spotify API client via [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)

2. Edit the settings for the client and add `http://localhost:4815/callback` to the list of Redirect URIs.

3. Retrieve auth tokens run the following command:

```
$ spotify-tokens --clientId "your-client-id" --clientSecret "your-client-secret"
```

### Options
Several options are available when running the `spotify-tokens` command.

##### Scope
The `--scope` option can be used to specify the scopes you wish to access. For ease of use, this tool will by default request access to ALL available scopes, so use this option to limit that.

Enter the scope as a comma separated list.
```
$ spotify-tokens --scope user-read-private,playlist-modify-private
```

#### Show Dialog
Add the `--showDialog` flag to prevent the Spotify Login dialog from automatically granting the request after you've already logged in once. Add this flag if you want to switch Spotify user.
