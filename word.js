var Loader = {

loadedCount:0,

totalCount:0,

loaded:true,

loadSound:function (url){

this.totalCount++;

this.loaded = false;

var aud = new Audio();

aud.src = url;

aud.addEventListener("canplaythrough",Loader.itemsLoaded);

return aud;

},

itemsLoaded:function (){

Loader.loadedCount++;

loadinfo.innerHTML = "Loaded "+Loader.loadedCount+" of "+Loader.totalCount;

if(Loader.loadedCount==Loader.totalCount){
Loader.loaded = true;
if(Loader.loaded==true){

function del(){
Game.play();
}
setTimeout(del,3000);

}
}

}

};

var Game = {

score:0,

word:"",

words:[],

scrambledwordarray:[],

init:function (){
maincontainer.style.height = 0.95*screen.height+"px";
Game.hidegamelayers();
Game.canvascreen();
},

wordArray:function (){

var request = new XMLHttpRequest();
request.open('GET','words.json');
request.onreadystatechange = function (){

if(this.readyState==this.DONE && this.status==200){

Game.displayScrambledWord(this.responseText);

}

};

request.send();

},

displayScrambledWord:function (jsonwords){

if(!jsonwords){

return;

}
else{

var wordsarray = JSON.parse(jsonwords);

for(var i=0;i<wordsarray.length;++i){

Game.words.push(wordsarray[i].word);

}

var rand = Math.floor(Math.random()*Game.words.length);

Game.word = Game.words[rand];
Game.savedword = Game.words[rand];

for(var j = 0;j<Game.word.length;++j){

Game.scrambledwordarray.push(Game.word[j]);

}

var scrambledword = Game.scrambledwordarray.sort().join('');

disp.innerHTML = scrambledword;

}

},

canvascreen:function (){
canvascontainer.style.display = "flex";
canvas.width = 0.95*screen.width;
canvas.height = 0.7*screen.height;
var context = document.getElementById("canvas").getContext("2d");

context.fillStyle = "blue";
context.font = "12px arial";
context.fillText("burtonchulu entertainment",10,0.67*screen.height);
},

loaderscreen:function (){
Game.hidegamelayers();
loadingscreen.style.display = "flex";
Game.loadAssets();
},

hidegamelayers:function (){

var layers = document.getElementsByClassName('gamelayer');
for(var i=0;i<layers.length;++i){
layers[i].style.display = "none";
}

},

gamearea:function (){

Game.hidegamelayers();
gamescreen.style.display = "flex";
controls.style.display = "block";
sound.style.display = "block";
Game.wordArray();

},

loadAssets:function (){

Game.backgroundSound = Loader.loadSound("background.mp3");

Game.correctSound = Loader.loadSound("correct.wav");

Game.wrongSound = Loader.loadSound("wrong.wav");

},

start:function (){

Game.loaderscreen();

Game.playBackgroundMusic();

},

play:function (){

Game.gamearea();

},

reset:function (){
disp.innerHTML = "";
Game.scrambledwordarray = [];
},

submitAnswer:function (){
if(ans.value==Game.word && ans.value!=""){
Game.reset();
tick.style.display = "block";
tick.src = "tick.png";
Game.correctSound.play();
score.innerHTML = Game.score+10;
}
else{
Game.reset();
Game.word = "";
tick.style.display = "block";
tick.src = "cross.png";
Game.wrongSound.play();
}
},

neWord:function (){
Game.reset();
Game.savedword = "";
tick.style.display = "none";
Game.wordArray();
},

showAnswer:function (){
tick.style.display = "none";
disp.innerHTML = Game.savedword;
},

playBackgroundMusic:function (){

var check = document.getElementById('check');

check.onclick = function (){

if(this.checked){
Game.backgroundSound.play();
}
else{
Game.backgroundSound.pause();
}
};
}

};

window.onload = Game.init;