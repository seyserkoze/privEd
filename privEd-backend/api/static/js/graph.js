

var colorMap = {advertising: 'rgba(255, 206, 86, 1)', social: 'rgba(255, 99, 132, 1)', analytics:'rgba(54, 162, 235, 1)', other: 'rgba(206, 255, 112, 1)'}

var trackerMap = {}

function buildNodeList(userHistory){

	var resultList = [];
	var edgeList = [];
	var uid = 0;
	var webFont = {color: 'black', size: 20, face: 'roboto'};
	for (var i in userHistory){

		website = (userHistory[i])

		for (var key in website) {
		    if (website.hasOwnProperty(key)) {

		    	resultList.push({id: uid, label: key, color: '#FFF1D0', boderWidth: 0, font: webFont, shape: 'circle'})
		    	var webUID = uid;
		    	uid += 1;
		        trackers = website[key];

				for (var j in trackers){

					var curr_tracker = trackers[j]
					var curr_tracker_url = trackers[j].split(" ")[0]
					var curr_tracker_kind = trackers[j].split(" ")[1]

					
					if (trackerMap[curr_tracker]){
						var curr_uid = trackerMap[curr_tracker];
		        		edgeList.push({from: webUID, to: curr_uid})
					}
		        	
		        	else {
		        		resultList.push({id: uid, label: curr_tracker_url, color: colorMap[curr_tracker_kind], shape: 'box'});
						trackerMap[curr_tracker] = uid;
						// console.log(trackerMap)
						edgeList.push({from: webUID, to: uid});
					 	uid += 1;

		        		
		        	}
		        }
			}
		}
	}


	return [resultList, edgeList];
}

window.onload=function(){
	var graphHtml = document.getElementById("graph");
	var id = document.getElementById("user").innerText;
	var url = 'http://128.237.115.176:8000/Users/'+id;
	

	$.get(url, {}, function(response){
		var userInfo = response;
		var userId = response['identity'];
		var userEmail = response['email'];

		var userHistory = response['history'];

		console.log(userHistory)

		document.getElementById("user").innerText= userEmail + "'s Third Party Tracker Data" 


		var currList = buildNodeList(userHistory)

		var nodes = new vis.DataSet(currList[0]);

		    // create an array with edges
		    var edges = new vis.DataSet(currList[1]);

		    // create a network
		    var container = document.getElementById('mynetwork');

		    // provide the data in the vis format
		    var data = {
		        nodes: nodes,
		        edges: edges
		    };
		    var options = {};

		    // initialize your network!
		    var network = new vis.Network(container, data, options);

	})
}