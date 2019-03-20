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
    //build up csv data of malicious websites from URLHaus
    $.get("https://urlhaus.abuse.ch/downloads/csv/", function(data){
        
        var data = data.substring(data.indexOf('"'), data.length);
        
        var data_dump = data.split("\n");

        for (i = 0; i < data_dump.length; i++){
            
            var curr = data_dump[i];
            curr = curr.split(',');

            if (curr.length == 7){
                var url = curr[2];
                var threat = curr[4];
                malicious_dict[url] = threat; 
            }
            
        }
    });

});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        
        // console.log(malicious_dict['"http://52.90.151.246/Obtc/ShadowMonitorTool35.jpg"']);

        if (request.message=="urlHausReq"){
            var url_check = '"'+request.url+'"';
            console.log(url_check)
            if (malicious_dict[url_check]){
                console.log('url is malicious');
                sendResponse({threat: malicious_dict[url_check]});
            }
            else{
                sendResponse({threat: 'No Threat Detected'});
            }
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    }
);


