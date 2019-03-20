/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */


var malicious_threat;

function checkMalicious(){
	chrome.runtime.sendMessage({message: "urlHausReq", url: location.href}, function(response) {
		malicious_threat = response.threat;
	});
}




function sendThreatToPopup(){
	chrome.runtime.sendMessage({message: "urlHausRes", threat: malicious_threat}, function(response) {
		console.log("message to popup sent");
	});
}

function securityRecommendationSystem() {
	// Find the HTTP SSL status
	chrome.storage.sync.set({"protocolStatus": location.protocol}, null);
}


securityRecommendationSystem();
checkMalicious();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	console.log('hahahahaha');
	if (request.subject=="urlHausRes" && request.from == "popup"){
		console.log("popup is requesting info");
		sendResponse({threat: malicious_threat});
	}
	
});


