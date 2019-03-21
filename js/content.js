/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */


var malicious_threat;

function sendToBackgroud(){
	chrome.runtime.sendMessage({message: "urlHausReq", url: location.href}, function(response) {
		malicious_threat = response.threat;
	});

	chrome.runtime.sendMessage({message: "domain", url: location.hostname}, function(response) {
		console.log(location.hostname)
	});
}

function checkSSLCertificate() {
	var url = "https://www.sslshopper.com/ssl-checker.html";
	$.get(url,{search_box: 'www.facebook.com'}, function(data){
	});
};


window.onload = function(){
	checkSSLCertificate();
	sendToBackgroud();
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

			default:
				// TODO
		}
	}
});


