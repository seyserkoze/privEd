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
var serverIP = "http://128.237.199.215";
var serverPort = "8000";
var urlAssociations = serverIP + ":" + serverPort + "/URLAssociations/";

var pageUrl = null;
var urlRatingData = null;
var masterHost;
var masterHref;

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

/* fillUrlHaus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					urlHaus div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillUrlHaus(response) {
	var urlHausHtml = document.getElementById("urlHaus");
	// console.log(urlHausHtml);
	if (response != null && response.threat != null) {
		urlHausHtml.innerText = response.threat;
	} else {
		// error handling
		urlHausHtml.innerText = "threat status: N/A";
	}
}


/* fillCertificateStatus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					sslCertificate div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillCertificateStatus(response) {
	console.log(response)
	var sslCertificateHTML = document.getElementById("sslCertificate");
	// console.log(sslCertificateHTML);
	if (response != null && response.sslCertificate != null) {
		sslCertificateHTML.innerText = response.sslCertificate;
	} else {
		// error handling
		sslCertificateHTML.innerText = "SSL Certificate Status: N/A";
	}
}

function fillTrackers(request) {
	if (request.subject=="cookieList"){
		advSet= request.data.advSet;
		trackSet=request.data.trackSet;
		socSet=request.data.socSet;
		// console.log(advSet, socSet, trackSet);
		
		var advHTMl = document.getElementById('advSet');
		var socHTML = document.getElementById('socSet');
		var trackHTML = document.getElementById('trackSet');


		advHTMl.innerText = advSet;
		socHTML.innerText = socSet;
		trackHTML.innerText = trackSet;
	}
}

function fillSSL(request){
	if(request.subject === "sslCertificate" ) {
    	console.log(request);
		var sslCertificateHTML = document.getElementById("sslCertificate");
		// console.log(sslCertificateHTML);
		if (request != null && request.sslCertificate != null) {
			sslCertificateHTML.innerText = request.sslCertificate;
		} else {
			// error handling
			sslCertificateHTML.innerText = "SSL Certificate Status: N/A";
		}
    }
}


function fillURLRating(request){
	if (request.subject == "urlAssociations"){
		/* Fill the URL rating from Content.js' URL information */ 
		// var urlElement = document.getElementById("urlElement");
		var urlRatingElement = document.getElementById("urlRatingElement");
		
		urlRatingData = request.urlRatingData; // Global
		urlRatingElement.innerText = "URL Rating: " + urlRatingData;
	}
}

function fillFromContent(response) {

	console.log("This is the content's response:")
	console.log(response);
	if (response != null && response.hostname != null && response.href != null && response.protocol != null) {
		console.log("got response");


		/* Fill the HTTP Status from content.js' protocol information */
		var protocolElement = document.getElementById('protocolElement');
		
		if (0 == response.protocol.localeCompare("https:")) {
			protocolElement.innerHTML = "HTTP Status: This website is secure by SSL TLS";
		} else if (0 == response.protocol.localeCompare("http:")){
			protocolElement.innerHTML = "HTTP Status: This webiste is not secure by SSL TLS";
		} else {
			protocolElement.innerHTML = "HTTP Status: N/A";
		}

		/* end filling up protocol */

		masterHost=response.hostname;
		masterHref= response.href

		pageUrl = response.hostname.replace(/\./g, "");
		var requestURL = urlAssociations + pageUrl + "/";

		chrome.runtime.sendMessage(
   		{
    		from: 'popup', 
       		to: 'background',
   			subject: 'urlRating',
   			requestURL: requestURL,
  		}, function(){});

		/* send messages to background */
		// Send message to background.js about the sslCertificate
	   	chrome.runtime.sendMessage(
	   		{
	    		from: 'popup', 
	       		to: 'background',
	    		hostname: masterHost,
	   			subject: 'sslCertificateReq'
	  		}, function(){});

	   	// Send message to background.js about the trackers hostname
	  	chrome.runtime.sendMessage(
	   		{
	    		from: 'popup', 
	       		to: 'background',
	    		hostname: masterHost,
	   			subject: 'trackersReq'
	  		}, function(){});

		// Send message to background.js about the urlHaus results
	    chrome.runtime.sendMessage(
	    	{
	        	from: 'popup', 
	        	to: 'background',
	        	href: masterHref,
	    		subject: 'urlHausReq'
	    	}, function(){});
	}

}


chrome.runtime.onMessage.addListener( function(request,sender,sendResponse)
{
	fillSSL(request);
	fillTrackers(request);
	fillURLRating(request);
});

/////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function(){
	chrome.tabs.query({ active: true, currentWindow: true}, 
    	function (tabs) {
    		chrome.tabs.sendMessage(
    			tabs[0].id,
    			{
    				from: 'popup',
    				to: 'content',
    				subject: 'contentReq'
    			},
    			fillFromContent);
    	}
    );
	thumbs();
};

