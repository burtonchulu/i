var Loader = {

loadedCount:0,

totalCount:0,

loaded:true,

init:function (){
	
	var aud = document.createElement('audio');
	
	if(aud.canPlayType('audio/wav')){
		Loader.soundFileExtension = '.wav';
		}
		if(aud.canPlayType('audio/ogg')){
			Loader.soundFileExtension = '.ogg';
			}
			if(aud.canPlayType('audio/mpeg')){
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

aud.oncanplaythrough = function (){
Loader.itemsLoaded();
};

return aud;

},

itemsLoaded:function (){

Loader.loadedCount++;

loadinfo.innerHTML = "Loaded "+Loader.loadedCount+" of "+Loader.totalCount;

if(Loader.loadedCount==Loader.totalCount){
Loader.loaded = true;
if(Loader.loaded==true){

Game.play();

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

answershown:true,

keyboarddetected:false,

words:[],

scrambledwordarray:[],

selectedwords:[],

init:function (){
var sw = screen.width;
	Game.detectKeyboard();
	if(sw<960){
maincontainer.style.width = 0.95*screen.width+"px";
maincontainer.style.height = 0.7*screen.height+"px";
}
else{
	maincontainer.style.width = 0.7*screen.width+"px";
	maincontainer.style.height = 0.7*screen.width+"px";
	}
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

Game.decodeJsonWords(this.responseText);

}

};

request.send();

},

decodeJsonWords:function (jsonwords){
	
	disp.innerHTML = "";

if(!jsonwords){

return;

}
else{
//turn json array into javascript array
//containing word objects
var wordsarray = JSON.parse(jsonwords);
//extract words from objects on array
//store them in array called words
for(var i=0;i<wordsarray.length;++i){
Game.words.push(wordsarray[i].word);
}
//shuffle words in the array
function shuffle(array){
	for(var i = array.length-1;i>0;i--){
		var j = Math.floor(Math.random()*(i+1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
		}
	}
	shuffle(Game.words);
	//select 20 words from words
	//array
	//store them in selected words
	for(var i = 0;i<20;i++){
		Game.selectedwords.push(Game.words[i]);
		}
}

},

displayScrambledWord:function (arr){
	
	for(var i = arr.length-1;i>0;i--){
		var j = Math.floor(Math.random()*(i+1));
		var temp = arr[i];
		arr[i] = arr[j];
		arr[j] = temp;
		}

var last = arr.length-1;

Game.word = arr[last];
Game.savedword = Game.savedword;
Game.answer = Game.word;
arr.pop();

for(var j=0;j<Game.word.length;++j){

Game.scrambledwordarray.push(Game.word[j]);

}

var scrambledword = Game.scrambledwordarray.sort().join('');

scrword.innerHTML = scrambledword;

},

canvascreen:function (){
	var sw = screen.height;
	Game.hidegamelayers();
canvascontainer.style.display = "flex";
canvas.style.display = "flex";
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
var sw = screen.width;
Game.hidegamelayers();
gamescreen.style.display = "flex";
if(sw<960){
Game.styleVirtualKeyboard();
}
else{
	keybod.style.display = "none";
	}
sound.style.display = "block";

Game.wordArray();

},

updateWord:function (c_id){
	
	var sw = screen.width;
	tick.src = "";
	
	if(sw<960){
var letter = document.getElementById(c_id);
letter.style.background = "blue";
function del(){
	letter.style.background = "";
	}
	setTimeout(del,500);
disp.innerHTML = disp.innerHTML+document.getElementById(c_id).innerHTML;
}
},
detectKeyboard:function (){
	var sw = screen.width;
    if(sw>=960){
    	Game.keyboarddetected = true;
	if(document.addEventListener){
	document.addEventListener("keypress",function (event){
if(event.defaultPrevented){
	return;
	}
	var key = event.key;
	if(key.length==1){
	disp.innerHTML = disp.innerHTML+key;
	}
	if(key=="Enter"){
		Game.submitAnswer();
		}
		if(key=="Space"){
			Game.neWord();
			}
			if(key=="Backspace"){
				Game.erase();
				}
				if(key=="Up" || key=="ArrowUp"){
					Game.showAnswer();
					}
});
	}
	}

},

erase:function (){
	
	var a = disp.innerHTML;
	
	disp.innerHTML = "";
	
	for(var i=0;i<a.length-1;++i){
	
	disp.innerHTML = disp.innerHTML+a[i];
	
	}
	//highlight key on press
	var key = document.getElementById("del");
	key.style.background = "blue";
	function res(){
		key.style.background = "";
		}
		setTimeout(res,500);
	
	},

loadAssets:function (){
	Loader.init();
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
if(!Game.keyboarddetected){
Game.hideSomeButtons();
}
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
if(!Game.keyboarddetected){
	submit.style.display = "none";
	}
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
if(!Game.keyboarddetected){
keybod.style.display = "none";
}
sound.style.display = "none";
gameoverscreen.style.display = "flex";
Game.gameoverSound.play();
function del(){
check.checked = false;
disp.innerHTML = "";
gameover.style.display = "none";
playagain.style.display = "block";
ex.style.display = "block";

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
	if(!Game.keyboarddetected){
	Game.showSomeButtons();
	}
	if(Game.answered){
Game.scrambledwordarray = [];
Game.savedword = "";
disp.innerHTML = "";
tick.style.display = "none";
Game.displayScrambledWord(Game.selectedwords);
}
else{
	Game.noAnswer();
	}
	Game.answered = false;
	//highlight key on press
	var key = document.getElementById("scramble");
	key.style.background = "blue";
	function res(){
		key.style.background = "";
		}
		setTimeout(res,500);
},

noAnswer:function (){
	Game.wrongSound.play();
	},

showAnswer:function (){
	Game.answered = true;
	if(!Game.keyboarddetected){
Game.hideSomeButtons();
}
tick.style.display = "none";
disp.innerHTML = Game.answer;
if(Game.mode!="wrong"){
Game.lifeHandler();
}
Game.mode = "correct";
Game.answer = "";
},

hideSomeButtons:function (){
	submit.style.display = "none";
	shoans.style.display = "none";
	},
	
	showSomeButtons:function (){
		submit.style.display = "inline-block";
		shoans.style.display = "inline-block";
		},

tryAgain:function (){
Game.gameoverSound.pause();
Game.gameoverSound.currentTime = 0;
Game.hidegamelayers();
gamescreen.style.display = "flex";
sound.style.display = "block";
if(!Game.keyboarddetected){
Game.styleVirtualKeyboard();
}
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

styleVirtualKeyboard: function (){
	var kpys = document.getElementsByClassName('kps');
	var kys = document.getElementsByClassName('kp');
	keybod.style.display = "block";
	for(var i=0;i<kys.length;++i){
		kys[i].style.position = "relative";
		kys[i].style.left = "0px";
		kys[i].style.top = "0px";
		kys[i].style.width = 0.0775*screen.width+"px";
		kys[i].style.height = 0.0775*screen.width+"px";
		}
		for(var j=0;j<kpys.length;++j){
			kpys[j].style.position = "relative";
			kpys[j].style.left = "0px";
			kpys[j].style.top = "0px";
			kpys[j].style.height = 0.0775*screen.width+"px";
			}
	},

notAvailable:function (){
	alert(Game.level.toUpperCase()+" not yet available");
	},
	
	exitGame:function (){
		window.location = "index.html";
		}
};

window.onload = Game.init;