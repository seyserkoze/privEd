/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (skhazanc)
 * March 19, 2019
 */


var malicious_threat;
var validity_window;

function sendToBackgroud(){
	chrome.runtime.sendMessage({message: "urlHausReq", url: location.href}, function(response) {
		malicious_threat = response.threat;
	});

	chrome.runtime.sendMessage({message: "domain", url: location.hostname}, function(response) {
		console.log(location.hostname)
	});
}

function checkSSLCertificate() {

	var url = window.location.hostname;
	url = (url[url.length-1] == "/") ? url.substring(0, url.length - 1) : url;
	var payload= {r: 126, 
				  host: url}
	console.log(payload);
	$.post("https://www.digicert.com/api/check-host.php", payload)
		.done(function(data){
			// console.log(data);
			var parser = new DOMParser();
			var htmlDoc = parser.parseFromString(data, 'text/html');

			const TDs = htmlDoc.getElementsByTagName("td");
			validity_window = "Certificate is " + TDs[17].innerText;
			console.log(validity_window);
		});
}


window.onload = function(){
	checkSSLCertificate();
	sendToBackgroud();
	$.get("128.237.219.76:8000/URLAssociations/", function( data ) {
		console.log('hi from shaurya');
  		console.log(data);
	});
}


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.from == "popup") {
		switch(request.subject){
			
			case "urlHausRes":
				console.log("popup is requesting info about URLHaus");
				sendResponse({threat: malicious_threat});
				break;
			
			case "protocolStatusReq":
				console.log("popup is requesting info about the protocol");
				sendResponse({protocol: location.protocol});
				break;

			case "sslCertificateReq":
				console.log("popup is requesting info about the SSL Certificate");
				sendResponse({sslCertificate: validity_window});
				break;

			case "urlReq":
				console.log("popup is requesting info about the the URL");
				sendResponse({url: window.location.hostname});
				break;

			default:
				// TODO
		}
	}
});


