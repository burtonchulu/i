var i = 0;
var j = 0;

var text = "Welcome to my portfolio.My name is Burton Chulu. I started learning web development in 2015. Along the way i have picked up numerous skills. I can code HTML5 CSS3 JavaScript Ajax PHP MySQL and do  Responsive design as well as mobile first approach.";

var text2 = "I am still putting together samples of some personal projects that i have worked on. For the meantime here is one of the earliest projects when i was still starting out.";

function callTypeWriter(){

document.getElementById("pi").innerHTML  = "";
document.getElementById("pi2").innerHTML  = "";

if(document.getElementById("pi").innerHTML==""){

typewriter();

}
}


function typewriter(){

if(i<text.length){

document.getElementById("pi").innerHTML  += text.charAt(i).toUpperCase();
i++;
auto = setTimeout(typewriter,50);

}

if(i==text.length){

typewriter2();

}

}

function typewriter2(){

if(j<text2.length){

document.getElementById("pi2").innerHTML  += text2.charAt(j).toUpperCase();
j++;

setTimeout(typewriter2,50);

}

}