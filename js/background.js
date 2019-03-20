
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({'count': '0'}, function() {
      console.log("The count is 0.");
    });

    //build up csv data of malicious websites from URLHaus
    $.get("https://urlhaus.abuse.ch/downloads/csv/", function(data){
    	
    	var malicious_dict = {}
    	var data =data.substring(data.indexOf('"'), data.length);
    	
    	var data_dump = data.split("\n");


    	for (i = 0; i < data_dump.length; i++){
    		
    		var curr = data_dump[i];
    		var curr = curr.split(',');

    		//associate url with the kind of threat it possesess
    		malicious_dict[curr[2]] = curr[4];
    	}

    	console.log(Object.keys(malicious_dict).length);

    });


});

