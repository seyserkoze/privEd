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
checkMalicious();


window.onload = function(){
	function checkSSLCertificate() {
		var url = "https://www.sslshopper.com/ssl-checker.html#hostname=" + location.href;
		console.log(url)
		$.get(url, function(data){
	    	console.log(data);
		});
	};

	checkSSLCertificate();

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


