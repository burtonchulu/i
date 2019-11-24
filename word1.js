function init(){
if(document.body && typeof document.body.style.transform != undefined){
	var logo = document.getElementById("logoimg");
logo.style.transition = "all ease 2s 3s";
logo.style.transform = "rotate(360deg)";
}
	}
	
	function red(){
		alert();
		window.location = "word.html";
		}
	
	window.onload = init;