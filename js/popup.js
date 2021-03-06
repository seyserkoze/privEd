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
var serverIP = "http://128.237.115.176";
var serverPort = "8000";
var urlAssociations = serverIP + ":" + serverPort + "/URLAssociations/";

var pageUrl = null;
var urlRatingData = null;


function deliverPatch(incr){
	var patch = {
		"rating" : urlRatingData + incr
	}
	var request = new XMLHttpRequest();
	var requestURL = urlAssociations + pageUrl + "/";
	console.log(requestURL);
	request.open('PATCH', requestURL, false);
	request.setRequestHeader("Content-type","application/json");
	request.send(JSON.stringify(patch));
	console.log(request.responseText);
	urlRatingData = JSON.parse(request.responseText).rating;
	console.log(urlRatingData);
	fillURLRating(urlRatingData);

	chrome.runtime.sendMessage({subject: "updateRating", urlRatingData: urlRatingData});

	console.log(request.responseText);
}


/* Onclick Behavior for the thumbs up & thumbs down */

function thumbs(){
	document.getElementById("thumbsUp").onclick = function() {
		// PATCH Request 
		deliverPatch(1);
		
	}

	document.getElementById("thumbsDown").onclick = function() {
		// PATCH Request
		deliverPatch(-1);
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
	console.log(trackingData)
	advSet = trackingData.advSet;
	trackSet = trackingData.trackSet;
	socSet = trackingData.socSet;
	otherSet = trackingData.otherSet;
	// console.log(advSet, socSet, trackSet);
		
	var advHTMl = document.getElementById('advSet');
	var socHTML = document.getElementById('socSet');
	var trackHTML = document.getElementById('trackSet');
	var otherHTML = document.getElementById('otherSet');

	advHTMl.innerText = advSet.join("\n");
	socHTML.innerText = socSet.join("\n");
	trackHTML.innerText = trackSet.join("\n");
	otherHTML.innerText = otherSet.join("\n");

	var ctx = document.getElementById('myChart');
	ctx.height = 100;
	ctx.width =100;

	data= {
	        labels: ['Social', 'Analytical', 'Advertising', 'Other'],
	        datasets: [{
	            label: 'Distribution of Third Party Trackers',
	            data: [socSet.length, trackSet.length, advSet.length, otherSet.length],
	            backgroundColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(206, 255, 112, 1)',
	            ],
	            borderColor: [
	                'rgba(255, 99, 132, 1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(206, 255, 90, 1)',
	            ],
	            borderWidth: 1
	        }]
	    }

	var myPieChart = new Chart(ctx, {
	    type: 'doughnut',
	    data: data,
	    options: {
	    			responsive: true,
                    maintainAspectRatio: false,
                }
	});

}


/* fillSSLStatus:
 * @description: takes the data diven from consent.js and uses that data to write to popup.html's
 *					sslCertificate div
 * @input: response - the data given to popup.js from the 
 * @output: void
 */
function fillSSLStatus(sslCertificate){	
	var sslCertificateHTML = document.getElementById("sslCertificate");
	console.log(sslCertificate);

	if (sslCertificate != null) {
		sslCertificateHTML.innerText = sslCertificate;
	} else {
		// error handling
		sslCertificateHTML.innerText = "SSL Certificate Status: N/A";
	}
}


function fillURLRating(rating){
	/* Fill the URL rating from Content.js' URL information */ 
	// var urlElement = document.getElementById("urlElement");
	var urlRatingElement = document.getElementById("urlRatingElement");
		
	urlRatingData = rating; // Global
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
				fillProtocol(message.protocol);
				pageUrl = message.pageUrl
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

	chrome.runtime.sendMessage({subject: "needInfo"}, function(message){
		console.log("response after window load was");
        console.log(message);
        pageUrl = message.pageUrl

        fillProtocol(message.protocol);
        fillUrlHaus(message.threat);
        fillTrackers(message.data);
        fillSSLStatus(message.sslCertificate);
        fillURLRating(message.urlRatingData);

	})
	thumbs();
};

