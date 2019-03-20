/* PrivEd: Browser Security Final Project
 *
 * popup.js: Scripts that are relevant to the popup html page
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */
function fillHTTPStatus(response) { 
	var protocolElement = document.getElementById('protocolElement');
	// console.log(response.protocol);
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

function fillUrlHaus(response) {
	var urlHausHtml = document.getElementById("urlHaus");
	console.log(urlHausHtml);
	urlHausHtml.innerText = response.threat;
}





/////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function(){

	chrome.tabs.query({ active: true, currentWindow: true}, 
    	function (tabs) {

    		// Send message to popup.js about protocol Status
    		chrome.tabs.sendMessage(
        		tabs[0].id,
        		{from: 'popup', subject: 'protocolStatusReq'},
        		fillHTTPStatus);

    		// Send message to popup.js about the urlHaus results
    		chrome.tabs.sendMessage(
    			tabs[0].id, 
    			{from: 'popup', subject: 'urlHausRes'}, 
    			fillUrlHaus);
    	});
};

