/* PrivEd: Browser Security Final Project
 *
 * content.js: Scripts to run in the context of the web pages
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */

function securityRecommendationSystem() {
	// Find the HTTP SSL status
	chrome.storage.sync.set({"protocolStatus": location.protocol}, null);
}
securityRecommendationSystem();
