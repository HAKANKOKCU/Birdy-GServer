const http = require('http');
const https = require('https');
const fs = require('fs');
const port = 8080;
var lastUrlHome = "";
const requestListener = function (req, res) {
	if (req.url.startsWith("//")) {
	try {
  const file = fs.createWriteStream("file.data");
  const request = http.get("http:" + req.url, function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed, Returning..")
	    res.writeHead(200);
		res.end(fs.readFileSync("file.data"));
		lastUrlHome = "http://" + req.url.split("/")[2];
   });
  }).on('error', function(err) { // Handle errors
    res.writeHead(500);
	res.end("ERROR! Cant get data.\n" + err);
  });
	}catch (err) {
		res.writeHead(500);
		res.end("ERROR! Cant get data.\n" + err);
	}
	}else if (req.url.startsWith("/://")) {
	try {
  const file = fs.createWriteStream("file.data");
  const request = https.get("https" + req.url.replace("\/:",":"), function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed, Returning..")
	    res.writeHead(200);
		res.end(fs.readFileSync("file.data"));
		lastUrlHome = "https://" + req.url.split("/")[3];
   });
  }).on('error', function(err) { // Handle errors
    res.writeHead(500);
	res.end("ERROR! Cant get data.\n" + err);
  });
	}catch (err) {
		res.writeHead(500);
		res.end("ERROR! Cant get data.\n" + err);
	}
	}else {
	try {
		const randomn = Math.round(Math.random() * 400)
		const file = fs.createWriteStream("file.data" + randomn.toString());
		console.log(lastUrlHome + req.url.replace(/\/\//g,"/"))
		if (lastUrlHome.startsWith("https://")) {
  const request = https.get(lastUrlHome + req.url, function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed Of Resource, Returning..")
	    res.writeHead(200);
		res.end(fs.readFileSync("file.data" + randomn.toString()));
   });
  }).on('error', function(err) { // Handle errors
    res.writeHead(500);
	res.end("ERROR! Cant get data.\n" + err);
  });
		} else {const request = http.get(lastUrlHome + req.url, function(response) {
   response.pipe(file);

   // after download completed close filestream
   file.on("finish", () => {
       file.close();
       console.log("Download Completed Of Resource, Returning..")
	    res.writeHead(200);
		res.end(fs.readFileSync("file.data" + randomn.toString()));
   });
  }).on('error', function(err) { // Handle errors
    res.writeHead(500);
	res.end("ERROR! Cant get data.\n" + err);
  });
		}
	}catch (err) {
		res.writeHead(500);
	res.end("ERROR! Cant get data.\n" + err);
	}
	}
}

const server = http.createServer(requestListener);
server.listen(port);