/* PrivEd: Browser Security Final Project
 *
 * background.js: Scripts to run in the background
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */

chrome.tabs.onCreated.addListener(function(tabs){
 	chrome.tabs.executeScript({
		file: 'js/content.js'
	});
})

// Upon Installation we want to have these values instantiated
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({"CSPStatus": null}, null);
  chrome.storage.sync.set({"secureHeaders": null}, null);
  chrome.storage.sync.set({"protocolStatus": null}, null);
});