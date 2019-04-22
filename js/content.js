/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (skhazanc)
 * March 19, 2019
 */


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if (request.from == "popup" && request.subject == "contentReq") {
		console.log(location.protocol, location.href, location.hostname);
		sendResponse({protocol: location.protocol, href: location.href, hostname: location.hostname})
	}
});


