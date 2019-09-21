var xpos;
var a;
var b;
var h;

function randNumber(min,max){

return Math.floor(Math.random()*(max-min+1))+min;

}

var Loader = {

loaded:true,

loadedCount:0,

totalCount:0,

loadSounds:function (url){

this.totalCount++;

this.loaded = false;

var aud = new Audio();

aud.src = url;

aud.id = "audy";

if(aud.addEventListener){
aud.addEventListener("canplaythrough",Loader.itemsLoaded);
return aud;
}
else if(aud.attachEvent){
aud.attachEvent("canplaythrough",Loader.itemsLoaded);
return aud;
}

},

loadImages:function (url){

this.totalCount++;

this.loaded = false;

var img = new Image();
img.src = url;
img.onload = Loader.itemsLoaded;
return img;

},

itemsLoaded:function (){

Loader.loadedCount++;

loadinfo.innerHTML = "Loaded "+ Loader.loadedCount + " of "+ Loader.totalCount;

if(Loader.loadedCount===Loader.totalCount){

Loader.loaded = true;

if(Loader.loaded==true){
	Game.assetsloaded = true;
Game.startGame();

}

}

}

};

var Game = {

mode:"herostopped",

assetsloaded:false,

bulletcount:[],

aliencount:[],

beecount:[],

herocount:[1],

lifecount:[],

ended:true,

win:true,

resetlife:false,

bulletmode:"notfired",

eny:"",

xpos:"",

drawbullet:true,

retry:true,

init:function (){
	
	var sh = screen.height;
	if(sh<480){
		
		sorryscreen.style.display = "flex";
		function show(){
			Game.init();
			}
		setTimeout(show,500);
		
		}
		else{
	
	maincontainer.style.height = 0.85*screen.height+"px";
	Game.resetLifeAndToast();
	Game.fillArrays();
	Game.resetEntitiesData();
landingscreen.style.display = "flex";

}

},

startGame:function (){
Game.gameArea();
Game.canvas = document.getElementById("gamescreen");
Game.context = Game.canvas.getContext("2d");
Game.animateFrame = window.requestAnimationFrame(Game.animate,Game.canvas);
},

moveCharacters:function (){
	Game.win = false;
	Game.ended = false;
	Game.retry = false;
	Game.animate();
	},

hideGameLayers:function (){
var layers = document.getElementsByClassName("gamelayer");
for(var i=0;i<layers.length;++i){
layers[i].style.display = "none";
}
},

loadingPage:function (){
Game.hideGameLayers();
loadingscreen.style.display = "flex";
Game.loadAssets();
},

gameArea:function (){
	if(Game.resetlife){
		Game.resetLifeAndToast();
		}
Game.hideGameLayers();
canvascontainer.style.display = "block";
Game.countDownTimer();
life.style.fontSize = "12px";
gamescreen.width = 0.95*screen.width;
gamescreen.height = 0.5*screen.height;
gamescreen.style.background = "blue";
bullets.innerHTML = "Bullets: "+Game.bulletcount.length;
var l = Game.lifecount.length-1;
life.innerHTML = "Life: "+l.toString();
Game.resetTextFontSize();
Game.trackEnemies();
Game.resizeControls();
Game.resetlife = false;
},

resizeControls:function (){
	var control = document.getElementsByClassName("controls");
	for(var i=0;i<control.length;++i){
		control[i].style.width = 0.14*screen.width+"px";
		control[i].style.height = 0.14*screen.width+"px";
		}
	},

loadAssets:function (){

Game.backgroundSound = Loader.loadSounds("alienbackground.mp3");
Game.gunfireSound = Loader.loadSounds("gunfire.wav");
Game.gameoverSound = Loader.loadSounds("win.wav");
Game.hitSound = Loader.loadSounds("hit.wav");
Game.spritesheet = Loader.loadImages("sbus.png");

},

heroPanning:function (){

btnL.onclick = function (){

Game.mode = "heroleft";

};

btnS.onclick = function (){

Game.mode = "herostopped";

};

btnR.onclick = function (){

Game.mode = "heroright";

};

for(var i=0;i<Entities.data.length;++i){

var obj = Entities.data[i];

if(obj.type=="alien"){

a = "alien"+i;

a = obj;

}
if(obj.type=="hero" && obj.isbullet){

b = "bullet"+i;

b = obj;

}

if(obj.type=="hero" && !obj.isbullet){

h = "hero"+i;

h = obj;

}

}
if(Game.eny>Game.bulletcount.length){
	 life.innerHTML = "";
	bullets.innerHTML = "";
	enemies.innerHTML = "";
	toast.style.position = "absolute";
	toast.style.left = "10px";
	toast.style.top = "30%";
	toast.style.fontSize = "1em";
toast.innerHTML = "Bullets less than enemies";
	Game.ended = true;
	Entities.data = [];
	function dlay(){
	Game.gameEnding();
	}
	setTimeout(dlay,3000);
	}
	if(Game.allenemies.length==0){
		Game.win = true;
		if(Game.win){
			Game.gameWinning();
			}
		}
		
},

animate:function (){
	var sh = screen.height;
	if(sh<480){
		Game.hideGameLayers();
		sorryscreen.style.display = "flex";
		function show(){
			Game.countDownTimer();
			}
			setTimeout(show,500);
		}
		if(sh>=480){
			Game.hideGameLayers();
			canvascontainer.style.display = "block";
Game.heroPanning();
Game.context.clearRect(0,0,0.95*screen.width,0.5*screen.height);
Entities.draw();
if(!Game.ended && !Game.win && !Game.retry){
Game.animateFrame = window.requestAnimationFrame(Game.animate,Game.canvas);
}
Game.playBackgroundMusic();
Game.toggleGamePause();
Game.drawLine();
}
},
playBackgroundMusic:function (){

var check = document.getElementById("check");

check.onclick = function(){

if(this.checked){

Game.backgroundSound.play();
Game.backgroundSound.loop = true;
}
else{

Game.backgroundSound.pause();

}

};

},
resetArrays:function (){
	Game.bulletcount = [];
	Game.allenemies.length = 21;
	for(var i=0;i<25;i++){
		Game.bulletcount.push(i);
		}
		},
		tryAgain:function (){
		Game.resetArrays();
Game.lifecount.pop();
Game.resetEntitiesData();
Game.gameArea();
},
resetEntitiesData:function (){
	//combine all enemy types
	Game.allenemies = Game.aliencount.concat(Game.beecount);
var obj = Game.aliencount;
var obj2 = Game.herocount;
var obj3 = Game.beecount;
for(var i=0;i<obj.length;++i){
	var aly = {};
	aly.type = "alien";
    aly.name = "alien"+i;
    aly.x = randNumber(10,0.86*screen.width);
    if(i==randNumber(10,15)){
    	aly.y = randNumber(-200*i,-400*i);
    }
    else{
    aly.y = -200*i;
    }
    if(i==randNumber(10,25)){
    	aly.islife = true;
        aly.width = 0.047*screen.width;
        aly.height = 0.047*screen.width;
    }
    else{
    	aly.islife = false;
    aly.width = 0.063*screen.width;
    aly.height = 0.063*screen.width;
    }
    aly.disappear = false;
    Entities.data.push(aly);
}
for(var j = 0;j<obj2.length;j++){
	var he = {};
	he.type = "hero";
	he.name = " hero"+j;
	he.x = randNumber(125,175);
	he.y = 0.45*screen.height;
	he.width = 0.14*screen.width;
	he.height = 0.05*screen.height;
	he.isbullet = false;
	Entities.data.push(he);
	}
	for(k=0;k<obj3.length;++k){
		var be = {};
		be.type = "bee";
		be.name = "bee"+k;
		be.x = randNumber(10,0.86*screen.width);
		be.y = -400*k;
		be.width = 0.063*screen.width;
		be.height = 0.063*screen.width;
		be.disappear = false;
		Entities.data.push(be);
		}
Game.retry = false;
},
startGame2:function (){
Game.lifecount = [1,1,1];
for(var i=0;i<20;i++){
Game.bulletcount.push(i);
}
Game.resetEntitiesData();
Game.startGame();
},
trackEnemies:function (){
	
    Game.eny = --Game.allenemies.length;
    enemies.innerHTML = "Enemies: "+Game.eny.toString();
    
    },
    stopCharacters:function (){
    Game.ended = true;
    Game.retry = true;
    Game.win = true;
    },
    gameEnding:function (){
    	Game.stopCharacters();
    Game.resetlife = true;
    Game.retry = false;
    Game.lifecount = [];
    check.checked = false;
    Game.backgroundSound.pause();
    Game.backgroundSound.currentTime = 0;
    Game.gameoverSound.play();
    	Game.hideGameLayers();
    gameoverscreen.style.display = "flex";
    Game.resetEntitiesData();
    function del(){
    	Game.hideGameLayers();
    	landingscreen.style.display = "flex";
    }
    	setTimeout(del,5000);
    },
    fillArrays:function (){
    	
    for(var i=0;i<15;i++){
    	
    Game.aliencount.push(i);
    	
    }
    
    for(var j=0;j<25;j++){
    	
    Game.bulletcount.push(j);
    	
    }
    
    for(var k=0;k<5;k++){
    	
    Game.beecount.push(k);
    	
    }
    	
    },
    gameWinning:function (){
    	Game.hideGameLayers();
    creditscreen.style.display = "flex";
    Game.gameoverSound.play();
    },
    resetLifeAndToast:function (){
    	toast.innerHTML="";
    	for(var i=0;i<3;++i){
    	Game.lifecount.push(i);
    }
    },
    countDownTimer:function (){
    	toast.style.position = "absolute";
    toast.style.left = "45%";
    toast.style.top = "20%";
    toast.style.fontSize = "2em";
    function timer(){
    	var sec = 3;
   return function (){
    	sec = sec-1;
    return sec;
    }
    }
    
    var r = timer();
    
    toast.innerHTML = 3;
    toast.style.color = "red";
    
    function one(){
    toast.innerHTML = r();
    toast.style.color = "green";
    }
    function two(){
   toast.innerHTML = r();
   toast.style.color = "gold";
   }
   function three(){
    toast.innerHTML = "";
    Game.moveCharacters();
    }
    
    setTimeout(one,1000);
    setTimeout(two,2000);
    setTimeout(three,3000);
    },
    toggleGamePause:function (){
    	
    	var check2 = document.getElementById("check2");
    check2.onclick = function (){
    	if(this.checked){
    	Game.stopCharacters();
    }
    else{
    	Game.countDownTimer();
    }
   };
   
    },
    resetTextFontSize:function (){
    	var txt = document.getElementsByClassName('txt');
    for(var i=0;i<txt.length;++i){
    	txt[i].style.fontSize = 0.04*screen.width+"px";
    }
    },
    drawLine:function (){
    	Game.context.strokeStyle = 'red';
    Game.context.beginPath();
    Game.context.moveTo(0,0.4*screen.height);
    Game.context.lineTo(0.95*screen.width,0.4*screen.height);
    Game.context.stroke();
    }

};

var Entities = {
	
	data:[],

draw:function (){
	
for(var i=0;i<Entities.data.length;i++){

var obj = Entities.data[i];

switch(obj.type){

case "alien":

if(b){
	if(b.y<0.25*obj.y && b.y>0.25*obj.y-2){
		if(b.x>=obj.x && b.x<=obj.x+obj.width){
			
			Game.hitSound.play();
			
			obj.disappear = true;
			obj.x = undefined;
			obj.y = undefined;
			
			b.disappear = true;
			b.x = undefined;
			b.y = undefined;
			
			Game.trackEnemies();
			
			if(obj.islife && Game.lifecount.length<3){
				Game.lifecount.push(1);
				var l = Game.lifecount.length-1;
				life.innerHTML = "Life: "+l.toString();
				
				}
			
			}
		
		}
	
	}

if(obj.y>1.5*screen.height && !obj.disappear){
	Entities.data = [];
	Game.hideGameLayers();
	Game.retry = true;
if(Game.retry){
if(Game.lifecount.length>1){
	tryagainscreen.style.display = "flex";
}
else{
	
	Game.gameEnding();

Game.gameoverSound.play();

audy.onended = function (){
Game.gameoverSound.pause();
Game.gameoverSound.currentTime =0;
};
}

}
}
if(!obj.disappear){
	var y = 0.25*obj.y++;
	}
	if(obj.disappear){
		var y = undefined;
		obj.x = undefined;
		}
	
Game.context.drawImage(Game.spritesheet,254,0,32,32,obj.x,y,obj.width,obj.height);

break;

case "bee":

if(b){
	if(b.y<0.27*obj.y && b.y>0.27*obj.y-2){
		if(b.x>=obj.x && b.x<=obj.x+obj.width){
			
			Game.hitSound.play();
			
			obj.disappear = true;
			obj.x = undefined;
			obj.y = undefined;
			
			b.disappear = true;
			b.x = undefined;
			b.y = undefined;
			
			Game.trackEnemies();
			
			}
		}
	}
	if(obj.y>1.4*screen.height && !obj.disappear){
		Entities.data = [];
		Game.hideGameLayers();
		Game.retry = true;
		if(Game.retry){
			if(Game.lifecount.length>1){
			tryagainscreen.style.display = "flex";
			}
			else{
				
				Game.gameEnding();
				
				Game.gameoverSound.play();
				
				audy.onended = function (){
					Game.gameoverSound.play();
					Game.gameoverSound.currentTime = 0;
					};
				
				}
				}
		}

Game.context.drawImage(Game.spritesheet,320,0,32,32,obj.x,0.27*obj.y++,obj.width,obj.height);

break;

case "hero":

Game.xpos = obj.x;
Game.bulstate = obj.isfired;
Game.obtype = obj.isbullet;

btnF.onclick = function (){

Game.gunfireSound.play();

xpos = "";

Game.bulletcount.pop();

bullets.innerHTML = "Bullets: "+Game.bulletcount.length;

if(Game.bulstate && Game.obtype){
xpos = h.x+0.063*screen.width;
}
else{
xpos = Game.xpos+0.063*screen.width;
}

Game.bulletmode = "fired";

if(Game.bulletcount.length>0){

Entities.data.push({type:"hero",width:0.016*screen.width,height:0.032*screen.width,isbullet:true});
Entities.data[Entities.data.length-1].x = xpos;
Entities.data[Entities.data.length-1].y = h.y;
Entities.data[Entities.data.length-1].isfired = true;
Entities.data[Entities.data.length-1].disappear = false;
}

};

if(Game.mode=="heroright" && !obj.isbullet){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x++,obj.y,obj.width,obj.height);

}
if(Game.mode=="heroleft" && !obj.isbullet){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x--,obj.y,obj.width,obj.height);

}

if(Game.mode=="heroright" && obj.isbullet && obj.isfired && !obj.disappear){
Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x,obj.y,obj.width,obj.height);

}
if(Game.mode=="heroright" && obj.isbullet && !obj.isfired){
Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x++,obj.y,obj.width,obj.height);

}
if(Game.mode=="heroleft" && obj.isbullet && obj.isfired && !obj.disappear){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x,obj.y,obj.width,obj.height);

}
if(Game.mode=="heroleft" && obj.isbullet && !obj.isfired){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x--,obj.y,obj.width,obj.height);

}
if(Game.mode=="herostopped" && !obj.disappear){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x,obj.y,obj.width,obj.height);

}

if(obj.isbullet && Game.bulletmode=="fired" && !obj.disappear){

Game.context.drawImage(Game.spritesheet,160,0,32,32,obj.x,obj.y--,obj.width,obj.height);

}

if(obj.x<0 || obj.x>0.95*screen.width-obj.width){
Game.mode = "herostopped";
}
if(obj.isbullet && Game.bulletmode=="fired" && obj.y<0){
obj.disappear = true;
obj.y = 5000;
}

break;

}

}

}

};

window.onload = Game.init;