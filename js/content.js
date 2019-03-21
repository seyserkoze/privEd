/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (skhazanc)
 * March 19, 2019
 */


var malicious_threat;

function checkMalicious(){
	chrome.runtime.sendMessage({message: "urlHausReq", url: location.href}, function(response) {
		malicious_threat = response.threat;
	});
}
checkMalicious();


function checkSSLCertificate() {

	var url = location.href;
	url = (url[url.length-1] == "/") ? url.substring(0, url.length - 1) : url;
	var payload= {r: 126, 
				  host: url}
	console.log(payload);
	$.post("https://www.digicert.com/api/check-host.php", payload)
		.done(function(data){
			console.log(data);
		});
}
checkSSLCertificate();


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


