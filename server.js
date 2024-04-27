const http = require('http');
const https = require('https');
const fs = require('fs');
const port = 8080;
//var lastUrlHome = "";
var sessions = {};
const requestListener = function(req, res) {
	var sess = (req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress) + req.headers["user-agent"];
	console.log(sess);
	if (sessions[sess] == undefined) {
		sessions[sess] = {
			lastUrlHome: ""
		}
	}
	var lastUrlHome = sessions[sess].lastUrlHome;
	delete req.headers.host;
	delete req.headers.accept;
	delete req.headers.connection;
	delete req.headers.cookie;
	delete req.headers["upgrade-insecure-requests"];
	delete req.headers["sec-fetch-dest"];
	delete req.headers["sec-fetch-mode"];
	delete req.headers["sec-fetch-site"];
	delete req.headers["sec-fetch-user"];
	//delete req.headers["user-agent"];
	delete req.headers["accept-language"];
	delete req.headers["accept-encoding"];
	delete req.headers["cache-control"];
	delete req.headers.referer;
	delete req.headers.pragma;
	if (req.headers["content-length"]) {
		req.headers["Content-Length"] = req.headers["content-length"];
		req.headers["Content-Type"] = req.headers["content-type"];
	}
	console.log(req.headers);
	if (req.url.startsWith("//")) {
		sessions[sess].lastUrlHome = "http:" + req.url;
		res.writeHead(302, {
			'Location': '/'
			//add other headers here...
		});
		res.end();
		
	} else if (req.url.startsWith("/://")) {
		sessions[sess].lastUrlHome = "https" + req.url.replace("\/:", ":");
		res.writeHead(302, {
			'Location': '/'
			//add other headers here...
		});
		res.end();
	}else if (req.url == "/!!INF") {
		res.writeHead(200);
		res.end("Your Session:" + req.socket.remoteAddress + req.headers["user-agent"] + "\n\n/://(url) => https \n// => http");
		
	} else {
		try {
			//const randomn = Math.round(Math.random() * 400)
			//const file = fs.createWriteStream("file" + randomn.toString() + ".data");
			console.log(sessions[sess].lastUrlHome + req.url.replace(/\/\//g, "/"))
			if (sessions[sess].lastUrlHome.startsWith("https://")) {
				const request = https.get(sessions[sess].lastUrlHome + req.url,{headers: req.headers,method: req.method}, function(response) {
					response.pipe(res);
					// after download completed close filestream
					// file.on("finish", () => {
					// file.close();
					// console.log("Download Completed Of Resource, Returning..")
					// res.writeHead(200);
					// res.end(fs.readFileSync("file" + randomn.toString() + ".data"));
					// fs.unlinkSync("file" + randomn.toString() + ".data");
					// });
				}).on('error', function(err) { // Handle errors
					res.writeHead(500);
					console.error(err);
					res.end("ERROR! Cant get data.\n" + err);
				});
				if (req.headers["content-length"]) {
					//let data = []
					console.log("b");
					req.on('data', (chunk) => {
						//data.push(chunk)
						try {
							request.write(chunk);
						}catch {}
						console.log("a");
					})
					req.on('end', () => {
						request.end();
						console.log("b");
					})
					
				}
			} else {
				const request = http.get(sessions[sess].lastUrlHome + req.url,{headers: req.headers,method: req.method}, function(response) {
					response.pipe(res);
					// after download completed close filestream
					// file.on("finish", () => {
					// file.close();
					// console.log("Download Completed Of Resource, Returning..")
					// res.writeHead(200);
					// res.end(fs.readFileSync("file" + randomn.toString() + ".data"));
					// fs.unlinkSync("file" + randomn.toString() + ".data");
					// });
				}).on('error', function(err) { // Handle errors
					res.writeHead(500);
					console.error(err);
					res.end("ERROR! Cant get data.\n" + err);
				});
				if (req.headers["content-length"]) {
					//let data = []
					console.log("b");
					req.on('data', (chunk) => {
						//data.push(chunk)
						try {
							request.write(chunk);
						}catch {}
						console.log("a");
					})
					req.on('end', () => {
						request.end();
						console.log("b");
					})
					
				}
			}
		} catch (err) {
			res.writeHead(500);
			res.end("ERROR! Cant get data.\n" + err);
		}
	}
}
const server = http.createServer(requestListener);
server.listen(port);