study-kanboard-presenter
======================

NodeJS and AngularJS application that displays all Kanban boards of a configured Kanboard (fguillot/kanboard, http://kanboard.net) server in a cyclic manor.<br>
The goal of this app is to simply present all important Kanban Boards of multiple Projects on a TV screen in a beautiful, automatic way.<br>
The App runs fine on a Raspberry Pi 2 using the linaro ubunto image.

![app screenshot](https://raw.githubusercontent.com/davideberlein/kanboard-presenter/master/doc/kanboard-presenter.png)

## Kanboard
This app needs a running fguillot/kanboard server and its API Token as prerequisite.<br>
The Proxy communicates with the Kanboard using its JSON RPC interface.<br>
Compatibility was tested up to Kanboard v1.0.13 API.

## Structure
The App exists of two parts. A node.js backend and a AngularJS frontend.
### Backend
The node.js server in combination with Express4 and node-rest-client function as REST proxy between the Kanboard server and the Frontent by providing convenience REST service to simplfy the API implemented on the Frontend.<br>
### Frontend
The frontend is implemented using AngularJS and is visualized with AngularMaterial.


## Configuring the project

### Server API URL and API token
You may retrieve this information on the Kanboard from: <code>Home > Settings > API</code>.<br>
<i>hint: Admin rights are needed to access this page.</i><br>

The API Endpoint and API Token must be configured using environment variables <code>KANBOARD_ADDR</code>, <code>KANBOARD_APIKEY</code> or in the following file:
<code>app/routes.js</code> and the function <code>kanboardApi.configureServer()</code>.

### Configure the user
To display all boards of a specific user, the user ID must be configured in the browser URL.<br>
To do so, use the following URL: http://localhost:16565/#/user/{YOUR_USER_ID}/board/<br>

## Installing, building and running
1. Download and install nodejs from https://nodejs.org/download/
2. Navigate to the repo dir in the command line.
3. Call <code>npm install</code>.
4. Call <code>bower install</code>. (If problems come up check if the proxy config fits your network environment in .bowerrc)
5. Call <code>node server.js</code> and the server will start
6. Open http://localhost:16565 in the browser to view the presenter.

## Docker
You can build and run a docker container:

1. Install docker.
2. Navigate to the repo dir in the command line.
3. Run <code>docker build . -t kanboard-presenter</code>
4. Start the container: <code>docker run -p 16565:16565 -e KANBOARD_ADDR=server.company.com -e KANBOARD_APIKEY=abcdef1234567890</code>
5. Open http://localhost:16565 in the browser to view the presenter.

## Distribution
<p>The project can be distributed as a single nw.js executable for linux and windows x32/64 platforms.</p>
To do so call: <code>gulp nw:build</code> in the project directory and find the binaries in the <code>build</code> folder.
