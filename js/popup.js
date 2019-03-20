/* PrivEd: Browser Security Final Project
 *
 * popup.js: Scripts that are relevant to the popup html page
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */
 
// var protocolStatus = document.getElementById('protocolStatus');
// chrome.storage.sync.get('protocolStatus', function(data) {
// 		protocolStatus.innerHTML = data.protocolStatus;
// });


window.onload = function(){
	var urlHausHtml = document.getElementById("urlHaus");
	console.log(urlHausHtml);

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {from: 'popup', subject: 'urlHausRes'}, function(response){
			urlHausHtml.innerText = response.threat;
		})
	});
}
