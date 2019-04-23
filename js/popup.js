/* PrivEd: Browser Security Final Project
 *
 * @file: popup.js
 * @description: Scripts that are relevant to creating the popup html page
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */

var advSet;
var socSet;
var trackSet;
var urlAssociations = serverIP + ":" + serverPort + "/URLAssociations/";

var pageUrl = null;
var urlRatingData = null;



/* Onclick Behavior for the thumbs up & thumbs down */

function thumbs(){
	document.getElementById("thumbsUp").onclick = function() {
		// PATCH Request 
		var patch = {
    		"rating" : urlRatingData + 1
		}
		var request = new XMLHttpRequest();
		var requestURL = urlAssociations + pageUrl + "/";
		console.log(requestURL);
		request.open('PATCH', requestURL, false);
		request.setRequestHeader("Content-type","application/json");
		request.send(JSON.stringify(patch));
		console.log("PATCH SUCCESS");
	}

	document.getElementById("thumbsDown").onclick = function() {
		// PATCH Request
		var patch = {
    		"rating" : urlRatingData - 1
		}
		var request = new XMLHttpRequest();
		var requestURL = urlAssociations + pageUrl + "/";
		request.open('PATCH', requestURL, false);
		request.setRequestHeader("Content-type","application/json");
		request.send(JSON.stringify(patch));
		console.log("PATCH SUCCESS");
	}
}

/* Filling HTML divs from content.js */

/* fillHTTPStatus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					protocolElement div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillHTTPStatus(response) { 
	var protocolElement = document.getElementById('protocolElement');
	if (response != null && response.protocol != null) {
		if (0 == response.protocol.localeCompare("https:")) {
			protocolElement.innerHTML = "HTTP Status: This website is secure by SSL TLS";
		} else if (0 == response.protocol.localeCompare("http:")){
			protocolElement.innerHTML = "HTTP Status: This webiste is not secure by SSL TLS";
		} else {
			protocolElement.innerHTML = "HTTP Status: N/A";
		}
	} else {
		// error handling
		protocolElement.innerHTML = "HTTP Status: N/A";
	}
}



/* Filling HTML divs from background.js */

/* fillUrlHaus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					urlHaus div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillUrlHaus(threat) {
	var urlHausHtml = document.getElementById("urlHaus");
	if (threat != null) {
		urlHausHtml.innerHTML = threat;
	} else {
		// error handling
		urlHausHtml.innerText = "threat status: N/A";
	}
}



/* fillTrackers:
 * @description: takes the data given from background.js and uses that data to write to popup.html's
 *					advSet, socSet, trackSet div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillTrackers(trackingData) {
	advSet = trackingData.advSet;
	trackSet = trackingData.trackSet;
	socSet = trackingData.socSet;
	// console.log(advSet, socSet, trackSet);
		
	var advHTMl = document.getElementById('advSet');
	var socHTML = document.getElementById('socSet');
	var trackHTML = document.getElementById('trackSet');


	advHTMl.innerText = advSet;
	socHTML.innerText = socSet;
	trackHTML.innerText = trackSet;
}


/* fillSSLStatus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					sslCertificate div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillSSLStatus(sslCertificate){	
	var sslCertificateHTML = document.getElementById("sslCertificate");
	// console.log(sslCertificateHTML);
	if (sslCertificate != null) {
		sslCertificateHTML.innerText = sslCertificate;
	} else {
		// error handling
		sslCertificateHTML.innerText = "SSL Certificate Status: N/A";
	}
}


function fillURLRating(urlRatingData){
	/* Fill the URL rating from Content.js' URL information */ 
	// var urlElement = document.getElementById("urlElement");
	var urlRatingElement = document.getElementById("urlRatingElement");
		
	urlRatingData = urlRatingData; // Global
	urlRatingElement.innerText = "URL Rating: " + urlRatingData;
}


	
		// var protocolElement = document.getElementById('protocolElement');
		
		// if (0 == response.protocol.localeCompare("https:")) {
		// 	protocolElement.innerHTML = "HTTP Status: This website is secure by SSL TLS";
		// } else if (0 == response.protocol.localeCompare("http:")){
		// 	protocolElement.innerHTML = "HTTP Status: This webiste is not secure by SSL TLS";
		// } else {
		// 	protocolElement.innerHTML = "HTTP Status: N/A";
		// }


function fillProtocol(text){
	var protocolElement = document.getElementById('protocolElement');
	protocolElement.innerHTML = text;
}

chrome.runtime.onMessage.addListener( function(message,sender,sendResponse)
{
	console.log(message);
	
	if (message && message.subject) {
		switch(message.subject){

			case "protocolRes":
				console.log("popup is messaging info about protocol")
				fillProtocol(message.protocolText);
				break;
			
			case "urlHausRes":
				console.log("popup is messaging info about URLHaus");
				fillUrlHaus(message.threat);
				break;
			
			case "cookieList": //Trackers
				console.log("popup is messageing info about the protocol");
				fillTrackers(message.data);
				break;

			case "sslCertificate":
				console.log("popup is messaging info about the SSL Certificate");
				fillSSLStatus(message.sslCertificate);
				break;

			case "urlRating":
				console.log("popup is messaging info about the the URL");
				fillURLRating(message.urlRatingData);
				break;

			default:
				console.log("UNEXPECTED MESSAGE");
				// TODO
		}
	}
	return true;

});

/////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function(){
	thumbs();
};

