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
var serverProtocol = "http://";
var serverIP = "128.237.219.76";
var serverChannel = "8000";
var requestURL = serverProtocol + serverIP + ":" + serverChannel;  "/URLAssociations/" + pageUrl + "/";

var pageUrl = null;
var urlRatingData = null;

function thumbs(){
	document.getElementById("thumbsUp").onclick = function() {
		// PATCH Request 
		var patch = {
    		"rating" : urlRatingData + 1
		}
		var request = new XMLHttpRequest();
		request.open('PATCH', requestURL, false);
		request.setRequestHeader("Content-type","application/json");
		request.send(JSON.stringify(patch));
		console.log("PATCH SUCCESS");
	}

	document.getElementById("thumbsDown").onclick = function() {
		// GET REQUEST
		$.get(requestURL, function( data ) {
			rating = urlRatingData;
		});

		// PATCH Request
		var patch = {
    		"rating" : rating - 1
		}
		var request = new XMLHttpRequest();
		request.open('PATCH', requestURL, false);
		request.setRequestHeader("Content-type","application/json");
		request.send(JSON.stringify(patch));
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
	var sslCertificateHTML = document.getElementById("sslCertificate");
	// console.log(sslCertificateHTML);
	if (response != null && response.sslCertificate != null) {
		sslCertificateHTML.innerText = response.sslCertificate;
	} else {
		// error handling
		sslCertificateHTML.innerText = "SSL Certificate Status: N/A";
	}
}


/* fillUrlRating:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					sslCertificate div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillUrlRating(response) {
	var urlRating = document.getElementById("urlRating");
	if (response != null && response.url != null) {
		urlRating.innerText = response.url;
		pageUrl = response.url.replace(/\./g, "");

		$.get(requestURL, function( data ) {
			urlRatingData = data.rating;
			urlRating.innerText = urlRatingData;
		});

	}
}


//get message from background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.msg=="cookieList"){
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
});

/////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function(){

	chrome.tabs.query({ active: true, currentWindow: true}, 
    	function (tabs, ) {

    		// Send message to content.js about protocol Status
    		chrome.tabs.sendMessage(
        		tabs[0].id,
        		{from: 'popup', subject: 'protocolStatusReq'},
        		fillHTTPStatus);

    		// Send message to content.js about the urlHaus results
    		chrome.tabs.sendMessage(
    			tabs[0].id, 
    			{from: 'popup', subject: 'urlHausRes'}, 
    			fillUrlHaus);

    		chrome.tabs.sendMessage(
    			tabs[0].id, 
    			{from: 'popup', subject: 'sslCertificateReq'}, 
    			fillCertificateStatus);

    		chrome.tabs.sendMessage(
    			tabs[0].id, 
    			{from: 'popup', subject: 'urlReq'}, 
    			fillUrlRating);
    	});
	thumbs();
};

