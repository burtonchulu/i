var i = 0;
var j = 0;

var text = "Welcome to my portfolio.My name is Burton Chulu. I started learning web development in 2015.Along the way i have picked up numerous skills. I can code HTML5 CSS3 JavaScript Ajax PHP MySQL JSON and can do  Responsive design,REST API intergration as well as mobile first approach.";

var text2 = "This portfolio is still under construction and will always be under continous development.This is so that it continously reflects my growing knowledge and skill set as i learn more.I am still putting together samples of some personal projects that i have worked on. For the meantime here is a sample of some of the projects.";

function callTypeWriter(){

document.getElementById("pi").innerHTML  = "";
document.getElementById("pi2").innerHTML  = "";
document.getElementById("proj1").style.display = "none";
document.getElementById("proj2").style.display = "none";
document.getElementById("proj3").style.display = "none";

if(document.getElementById("pi").innerHTML==""){

typewriter();

}
}


function typewriter(){

if(i<text.length){

document.getElementById("pi").innerHTML  += text.charAt(i);
i++;
auto = setTimeout(typewriter,50);

}

if(i==text.length){

typewriter2();

}

}

function typewriter2(){

if(j<text2.length){

document.getElementById("pi2").innerHTML  += text2.charAt(j);
j++;

setTimeout(typewriter2,50);

}

if(j==text2.length){

document.getElementById("proj1").style.display = "block";

document.getElementById("proj2").style.display = "block";

document.getElementById("proj3").style.display = "block";

}

}