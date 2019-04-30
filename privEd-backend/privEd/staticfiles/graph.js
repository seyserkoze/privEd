

window.onload=function(){
	var graphHtml = document.getElementById("graph")
	var id = document.getElementById("user").innerText
	var url = 'http://128.237.115.176:8000/Users/'+id
	$.get(url, function(response)){
		console.log(response);
	}
}