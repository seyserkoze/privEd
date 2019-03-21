/* PrivEd: Browser Security Final Project
 *
 * background.js: Scripts to run in the background
 * 
 * Marcus Greer (mgreer), Shaurya Khazanchi (Skhazanc)
 * March 19, 2019
 */

var malicious_dict = {};
var tabDomain;
var outputVar;
var adv;
var social;
var trackers;

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {   

                outputVar = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
}


//url1 is the cookie url and url2 is the hostname
//needs to be modified acc to needs later
function isSubDomain(url1, url2){
    url2 = url2.toString();
    if (url1===url2){
        return true;
    }
    else if (url2.includes(url1)){
        return true;
    }
    return false;
}

function buildThirdPartyCookies(cookies){  
    var thirdPartySet = {};

    for (i=0; i<cookies.length; i++){
        var currDomain = cookies[i].domain;
        if (currDomain[0]=="."){
             currDomain= currDomain.substring(1, currDomain.length);
        }

        var wwwInd = currDomain.indexOf('www.')
        
        if (wwwInd>-1){
            currDomain = currDomain.substring(wwwInd+4, currDomain.length);
            console.log(currDomain);
        }
        
        if (!isSubDomain(currDomain, tabDomain)){
            if (!(thirdPartySet[cookies[i].domain] )){
                thirdPartySet[cookies[i].domain] = cookies[i];
            }
        }
    }

    return thirdPartySet;
}

function segmentSet(cookieSet){

    var advSet=[];
    var socSet=[];
    var trackSet=[];
    console.log(trackers);
    for (var elem in cookieSet){
        var elemCopy = elem;
        if (elem[0]=="."){
            elem= elem.substring(1, elem.length);
        }
        if (adv.includes(elem)){
            advSet.push(elem);
        }

        else if (social.includes(elem)){
            socSet.push(elem);
        }

        else if (trackers.includes(elem)){
            trackSet.push(elem);
        }
    }

    chrome.runtime.sendMessage({
        msg: "cookieList",
        data: {
            advSet: advSet,
            socSet: socSet,
            trackSet: trackSet
        }
    })
}

function buildCookieList(){
    chrome.tabs.executeScript({code: 'performance.getEntriesByType("resource").map(e => e.name)',}, data => {
        if (chrome.runtime.lastError || !data || !data[0]) return;
        const urls = data[0].map(url => url.split(/[#?]/)[0]);
        const uniqueUrls = [...new Set(urls).values()].filter(Boolean);
        Promise.all(
        uniqueUrls.map(url =>
          new Promise(resolve => {
            chrome.cookies.getAll({url}, resolve);
          })
        )
      ).then(results => {
        // convert the array of arrays into a deduplicated flat array of cookies
        const cookies = [
          ...new Map(
            [].concat(...results)
              .map(c => [JSON.stringify(c), c])
          ).values()
        ];

        // do something with the cookies here
        var thirdPartySet = buildThirdPartyCookies(cookies);

        segmentSet(thirdPartySet);

      });
    });    
}

// Upon Installation we want to have these values instantiated
chrome.runtime.onInstalled.addListener(function() {


    //build up all the lists from db set 
    readTextFile('../texts/adv');
    adv = outputVar.split('\n');
    readTextFile('../texts/social');
    social = outputVar.split('\n');
    readTextFile('../texts/trackers');
    trackers = outputVar.split('\n');

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
            if (malicious_dict[url_check]){
                sendResponse({threat: malicious_dict[url_check]});
                chrome.browserAction.setIcon({
            		path: "images/red2.png", // frown.png
            		tabId: sender.tab.id
        		});
            }
            else{
                sendResponse({threat: 'No Threat Detected'});
                chrome.browserAction.setIcon({
            		path: "images/green2.png", // smile.png
            		tabId: sender.tab.id
        		});
            }
        }

        else if (request.message=="domain"){
            tabDomain = request.url.toString();
            var wwwIndex = tabDomain.indexOf('www.');
           
            if (wwwIndex>-1){
                tabDomain = tabDomain.substring(wwwIndex+4, tabDomain.length);
            }
            buildCookieList();      
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    }
);
