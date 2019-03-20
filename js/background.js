/* PrivEd: Browser Security Final Project
 *
 * background.js: Scripts to run in the background
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */

var malicious_dict = {};

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


    //build up csv data of malicious websites from URLHaus
    $.get({url: "https://urlhaus.abuse.ch/downloads/csv/", async: false}, function(data){
        
        var data =data.substring(data.indexOf('"'), data.length);
        
        var data_dump = data.split("\n");


        for (i = 0; i < data_dump.length; i++){
            
            var curr = data_dump[i];
            var curr = curr.split(',');

            //associate url with the kind of threat it possesess
            malicious_dict[curr[2]] = curr[4];
        }
    });
    console.log(Object.keys(malicious_dict).length);

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(Object.keys(malicious_dict)[0]);

        if (request.message=="urlHausReq"){
            if (malicious_dict[request.url]){
                sendResponse({threat: malicious_dict[request.url]});
            }
            else{
                sendResponse({threat: 'No Threat Detected'});
            }
        }   
    }
);