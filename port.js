function switchOn(){
var switchcolor = document.getElementById("d2");
switchcolor.style.backgroundColor = "blue";
}

function trans(){
var m = document.getElementById("me");
m.style.transition = "transform 5s ease";
m.style.transform= "rotate(360deg)";
var fej = document.getElementById("some");
fej.style.transition = "transform 5s ease";
fej.style.transform = "rotate(360deg)";
}