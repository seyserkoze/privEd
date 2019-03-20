chrome.tabs.onCreated.addListener(function(tabs){
 	chrome.tabs.executeScript({
		file: 'content.js'
	});
})