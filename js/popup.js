/* PrivEd: Browser Security Final Project
 *
 * popup.js: Scripts that are relevant to the popup html page
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */
 
var protocolStatus = document.getElementById('protocolStatus');
chrome.storage.sync.get('protocolStatus', function(data) {
		console.log(data.protocolStatus);
		protocolStatus.innerHTML = data.protocolStatus;
});

