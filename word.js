var Loader = {

loadedCount:0,

totalCount:0,

loaded:true,

init:function (){
	
	var aud = document.createElement('audio');
	
	if(aud.canPlayType('audio/wav')=="probably"){
		Loader.soundFileExtension = '.wav';
		}
		if(aud.canPlayType('audio/ogg')=="probably"){
			Loader.soundFileExtension = '.ogg';
			}
			if(aud.canPlayType('audio/mpeg')=="probably"){
				Loader.soundFileExtension = '.mp3';
				}
				else{
					Loader.soundFileExtension = undefined;
					}
	},

loadSound:function (url){

this.totalCount++;

this.loaded = false;

var aud = new Audio();

aud.src = url;

aud.load();

aud.oncanplaythrough = Loader.itemsLoaded;

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

mode:"wrong",

savedword:"",

answered:true,

score:[0],

life:[3],

word:"",

words:[],

scrambledwordarray:[],

init:function (){
maincontainer.style.height = 0.95*screen.height+"px";
Game.hidegamelayers();
levelselectscreen.style.display = "flex";
},

wordArray:function (){

var request = new XMLHttpRequest();
if(Game.level=="easy"){
request.open('GET','easywords.json');
}
if(Game.level=="medium"){
	request.open('GET','mediumwords.json');
	}
	if(Game.level=="hard"){
		request.open('GET','hardwords.json');
		}
request.onreadystatechange = function (){

if(this.readyState==this.DONE && this.status==200){

Game.displayScrambledWord(this.responseText);

}

};

request.send();

},

displayScrambledWord:function (jsonwords){
	
	disp.innerHTML = "";

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

scrword.innerHTML = scrambledword;

}

},

canvascreen:function (){
	Game.hidegamelayers();
canvascontainer.style.display = "flex";
canvas.style.display = "flex";
canvas.style.width = 0.95*screen.width+"px";
canvas.style.height = 0.7*screen.height+"px";
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
keybod.style.display = "block";
sound.style.display = "block";
Game.wordArray();

},

updateWord:function (c_id){
	
var letter = document.getElementById(c_id);

	tick.src = "";
disp.innerHTML = disp.innerHTML+document.getElementById(c_id).innerHTML;

},

erase:function (){
	
	var a = disp.innerHTML;
	
	disp.innerHTML = "";
	
	for(var i=0;i<a.length-1;++i){
	
	disp.innerHTML = disp.innerHTML+a[i];
	
	}
	
	},

loadAssets:function (){
	Loader.init();
	alert(Loader.soundFileExtension);
	var a = "background"+Loader.soundFileExtension;
	var b = "gameover"+Loader.soundFileExtension;
	var c = "correct"+Loader.soundFileExtension;
	var d = "wrong"+Loader.soundFileExtension;

Game.backgroundSound = Loader.loadSound(a);

Game.gameoverSound = Loader.loadSound(b);

Game.correctSound = Loader.loadSound(c);

Game.wrongSound = Loader.loadSound(d);

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
Game.word = [];
},

submitAnswer:function (){
Game.answered = true;

if(disp.innerHTML==Game.word){
Game.mode = "correct";
tick.style.display = "block";
tick.src = "tick.png";
Game.correctSound.play();

function makeScore(){
var counter = Game.score[Game.score.length-1];
function displayScore(){
if(Game.savedword.length<=3){
counter = counter+15;
}
if(Game.savedword.length>3 && Game.savedword.length<=6){
counter = counter+25;
}
if(Game.savedword.length>6){
counter = counter+35;
}
Game.score.push(counter);
return counter;
}
return displayScore;
}

var a = makeScore();
score.innerHTML = "Score: "+a();

}
else{
Game.mode = "wrong";
Game.firelifehandler = "yes";
Game.word = "";
tick.style.display = "block";
tick.src = "cross.png";
Game.wrongSound.play();
Game.lifeHandler();
}
},

lifeHandler:function (){

Game.firelifehandler = "no";

Game.wrongSound.play();

function lifeChecker(){
var life = Game.life[Game.life.length-1];
if(life<1){
	Game.backgroundSound.pause();
	Game.backgroundSound.currentTime = 0;
Game.hidegamelayers();
keybod.style.display = "none";
sound.style.display = "none";
gameoverscreen.style.display = "flex";
Game.gameoverSound.play();
function del(){
check.checked = false;
disp.innerHTML = "";
gameover.style.display = "none";
playagain.style.display = "block";
}
setTimeout(del,4000);
}
function reduceLife(){
life = life-1;
Game.life.push(life);
return life;
}
return reduceLife;
}

var b = lifeChecker();
life.innerHTML = "Life: "+b();

},

neWord:function (){
	if(Game.answered){
Game.scrambledwordarray = [];
Game.savedword = "";
disp.innerHTML = "";
tick.style.display = "none";
Game.wordArray();
}
else{
	Game.noAnswer();
	}
	Game.answered = false;
},

noAnswer:function (){
	Game.wrongSound.play();
	alert("Enter answer");
	},

showAnswer:function (){
tick.style.display = "none";
disp.innerHTML = Game.savedword;
Game.lifeHandler();
},

tryAgain:function (){
Game.gameoverSound.pause();
Game.gameoverSound.currentTime = 0;
Game.hidegamelayers();
gamescreen.style.display = "flex";
sound.style.display = "block";
keybod.style.display = "block";
tick.src = "";
Game.life = [3];
Game.score = [0];
life.innerHTML = "Life: 3";
score.innerHTML = "Score: 0";
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
},

notAvailable:function (){
	alert(Game.level.toUpperCase()+" not yet available");
	}
};

window.onload = Game.init;