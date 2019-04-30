

var colorMap = {advertising: '#D9E5D6', social: '#EDDEA4', analytics: '#F7A072', other: '#FF9B42'}

function buildNodeList(userHistory){

	var resultList = []
	var uid = 0
	var webFont = {color: 'black', size: 20, face: 'helvetica'}
	for (var i in userHistory){

		website = (userHistory[i])

		for (var key in website) {
		    if (website.hasOwnProperty(key)) {

		    	resultList.push({id: uid, label: key, color: '#0FA3B1', boderWidth: 0, font: webFont, shape: 'circle'})
		    	uid += 1;
		        trackers = website[key];

		        for (var j in trackers){
		        	
		        	var curr_tracker = trackers[j]
		        	var curr_tracker_url = trackers[j].split(" ")[0]
		        	var curr_tracker_kind = trackers[j].split(" ")[1]
		        	resultList.push({id: uid, label: curr_tracker_url, color: colorMap[curr_tracker_kind], shape: 'box'});
		        	uid += 1
		        }
			}
		}
	}

	return resultList;
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


		var currList = buildNodeList(userHistory)
		var nodes = new vis.DataSet(currList);

		    // create an array with edges
		    var edges = new vis.DataSet([
		        {from: 1, to: 3},
		        {from: 1, to: 2},
		        {from: 2, to: 4},
		        {from: 2, to: 5}
		    ]);

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