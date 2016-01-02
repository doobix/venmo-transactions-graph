# Venmo Transactions Graph

This is a Node.js project that allows users to login with their Venmo account to see a C3.js bar graph of their transactions (payments sent & received) per month. The `access_profile` scope is needed for accessing the transaction history.

![Screenshot](http://i.imgur.com/jDoWvLI.png)

## Getting Started

1. Run `npm install`.
2. Run `bower install`.
3. Create a new Venmo app at [https://venmo.com/account/settings/developer](https://venmo.com/account/settings/developer). For the "Web Redirect URL", use the ip or url of your web server with path `/oauth` at the end. (e.g. `http://192.168.1.100:8080/oauth`)
4. Set the `client_id` and `client_secret` in `config.js`.
5. Run `node server.js`.
