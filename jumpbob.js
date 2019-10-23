//random number generator
function randNumber(min,max){
return Math.floor(Math.random()*(max-min+1))+min;
}
/*media queries to detect device screen size and set game canvas to appropriate size for use in the Levels object data property*/
function canvasSize2(x){
if(x.matches){
//canvas width
cwidth = 300;
}
}

var x = window.matchMedia('(min-width:320px)');
canvasSize2(x);
x.addListener(canvasSize2);

//Box2D common objects
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

/*define and initialise canvas */
 /*variable*/

var gamelayers = document.getElementsByClassName("gamelayer");

var Loader = {
loaded:true,
loadedCount:0,
totalCount:0,
init:function (){
//check audio support
var oggSupport,mp3Support,wavSupport;
var audio = document.createElement("audio");
if(audio.canPlayType){
mp3Support = "" !=audio.canPlayType('audio/mpeg');
oggSupport = "" !=audio.canPlayType('audio/ogg; "codecs=vorbis" ');
wavSupport = "" !=audio.canPlayType('audio/wav');
}
else{
mp3Support = false;
oggSupport = false;
}
Loader.soundFileExtension = oggSupport?".ogg":mp3Support?".mp3":wavSupport?".wav":undefined;
},
/*loadImagefiles and load loadsoundfiles will each be used in loops that loop through respective file arrays located in the loadimages and load sounds methods of the Game object*/
loadImageFiles:function(url){
this.totalCount++;
this.loaded = false;
var img = new Image();
img.src = url;
img.onload  = Loader.itemLoaded;
return img;
},

loadSoundFiles:function(url){
this.totalCount++;
this.loaded = false;
var aud = new Audio();
aud.src = url;
aud.load();
aud.oncanplaythrough = function (){
Loader.itemLoaded();
};
return aud;
},

itemLoaded:function(){
Loader.loadedCount++;
loadinfo.innerHTML="Loaded "+Loader.loadedCount+" of "+Loader.totalCount;
if(Loader.loadedCount===Loader.totalCount){
Loader.loaded = true;
if(Loader.loaded==true){
//start
Levels.init();
}
}
}
};

var Game = {
	
	life:[3],
	
	lifeimages:["life0","life1","life2"],
	
insectharmful:true,

herodead:false,

heroburn:false,
	
init:function (){
Loader.init();
Game.detectKeyboard();
gamecontainer.style.width = cwidth+"px";
gamecontainer.style.height = 0.8*screen.height+"px";
Game.hidegamelayers();
landingpage.style.display = "block";
Game.mediaQueries();
Game.displayLifeImages();
},

displayLifeImages:function (){
		life0.style.display = "block";
		life1.style.display = "block";
		life2.style.display = "block";
	},

hidegamelayers:function (){
for(var i = 0;i<gamelayers.length;++i){
gamelayers[i].style.display = "none";
}
},

hideplaybutton:function (){
	Game.hidegamelayers();
	loadingscreen.style.display = "flex";
loadinfo.style.fontSize = "1em";
},

showgamelevels:function (){
Game.hidegamelayers();
levelselectscreen.style.display = "flex";
},

loadImages:function (arg){
/*image files array for a particular game level*/
var imageNames =
/*the argument arg is the level number supplied in the Levels object init method when the gameloadimages method is called on level button click so that the correct images for the level are loaded*/ [Levels.data[arg].background];
/*loop through the array to load image files using Loader object loadimagefiles method and push the images into loadedimages array for later use in the animate method of the game object to draw the image*/
for(var i = 0;i<imageNames.length;++i){
Game.loadedImagesArray.push(Loader.loadImageFiles(imageNames[i]));
}
},
//refer to loadImages method 
loadSounds:function (arg){
var soundNames = [
Levels.data[arg].sounds[0],Levels.data[arg].sounds[1]];
for(var i = 0;i<soundNames.length;++i){
Game.loadedSoundsArray.push(Loader.loadSoundFiles(soundNames[i]));
}
},
startGame:function (){
//display the canvas and define and initialize certain  game object properties 
Game.hidegamelayers();
canvascontainer.style.display = "block";
Game.canvas = document.getElementById("canvas");
Game.mediaQueries();
Game.context = Game.canvas.getContext('2d');
Game.offSetHeroLeft = 0;
Game.offSetLeft=0;
Game.mode = "intro";
Game.ended = false;
Game.win = false;
Game.retry = false;
Game.animateFrame = window.requestAnimationFrame(Game.animate,Game.canvas);
Game.cancelFrame = cancelAnimationFrame(Game.animate);
Game.countHeroesAndVillains();
Game.currentHero = Game.heroes[0];
},

maxSpeed:3,
minOffSet:0,
maxOffSet:6000,
score:0,

detectKeyboard:function (){
	if(window.addEventListener){
	document.addEventListener("keydown", function (event){
if(event.defaultPrevented){
	return;
	}
	var key = event.key;
	if(key=="Left" || key=="ArrowLeft"){
		Game.mode = "autowalkingleft";
		function stophero(){
			Game.mode = "herostoppedleft";
			}
			setTimeout(stophero,500);
		}
		if(key=="Right" || key=="ArrowRight"){
			Game.mode = "autowalkingright";
			function stophero(){
				Game.mode = "herostoppedright";
				}
				setTimeout(stophero,500);
			}
			if(key=="Up" || key=="ArrowUp"){
				Game.currentHero.ApplyImpulse({x:0,y:-0.067*cwidth*0.067*cwidth/box2d.scale},Game.currentHero.GetBodyCenter());
				Game.currentHero.SetAwake(true);
				Game.mode = "herostoppedleft";
				}
});
	}
	},

panTo:function (newCenter){
if(Math.abs(newCenter-Game.offSetLeft-canvas.width/4) && Game.offSetLeft>=Game.minOffSet && Game.offSetLeft<=Game.maxOffSet){
var deltaX = Math.round((newCenter-Game.offSetLeft-canvas.width/4)/2);
if(deltaX && Math.abs(deltaX)>Game.maxSpeed){
deltaX = Game.maxSpeed*Math.abs(deltaX)/(deltaX);
}
Game.offSetLeft+=deltaX;
}
else{
return true;
}
if(Game.offSetLeft>Game.maxOffSet){
Game.offSetLeft = Game.maxOffSet;
return true;
}
if(Game.offSetLeft<Game.minOffSet){
Game.offSetLeft = Game.minOffSet;
return true;
}
return false;
},

handlePanning:function (){

if(Game.mode=="intro"){
if(Game.panTo(0)){
Game.mode = "gamestarted";
}
}

if(Game.mode=="gamestarted" || Game.mode=="herostoppedright"){
//move hero foward
btnR.onclick = function (){
Game.mode = "autowalkingright";
function stophero(){
Game.mode = "herostoppedright";
}
setTimeout(stophero,500);
};
}

if(Game.mode=="gamestarted" || "herostoppedleft"){
//move hero back
btnL.onclick = function (){
Game.mode = "autowalkingleft";
function stophero(){
Game.mode = "herostoppedleft";
}
setTimeout(stophero,500);
};
}

if(Game.mode=="autowalkingright"){
Game.currentHero.SetLinearVelocity({x:2,y:0});
Game.currentHero.SetAwake(true);
}

if(Game.mode=="autowalkingleft"){
Game.currentHero.SetLinearVelocity({x:-2,y:0});
Game.currentHero.SetAwake(true);
}
//game entities behaviors
if(Game.mode=="autowalkingright" || "autowalkingleft" || "herostoppedleft" || "gamestarted" || "herostoppedright"){
for(var i = 0;i<Game.insects.length;++i){
//homing in insects toward hero
if(Game.currentHero.GetPosition().x>Game.insects[i].GetPosition().x){
Game.insects[i].SetLinearVelocity({x:0.1,y:0});
Game.insects[i].SetAwake(true);
}
if(Game.currentHero.GetPosition().x<Game.insects[i].GetPosition().x){
Game.insects[i].SetLinearVelocity({x:-0.75,y:0});
Game.insects[i].SetAwake(true);
}
if(Game.insects[i].GetPosition().y>=Game.currentHero.GetPosition().y-5){
Game.insects[i].SetLinearVelocity({x:0,y:1});
}
//insect attack if hero is in range
if(Game.insects[i].GetPosition().x>=Game.currentHero.GetPosition().x && Game.insects[i].GetPosition().x<=Game.currentHero.GetPosition().x+Math.floor(Math.random()*5)){
Game.insects[i].SetLinearVelocity({x:-Math.floor(Math.random()*3),y:0});
}
if(Game.insects[i].GetPosition().x<Game.currentHero.GetPosition().x && Game.insects[i].GetPosition().x>=Game.currentHero.GetPosition().x-Math.floor(Math.random()*5)){
Game.insects[i].SetLinearVelocity({x:Math.floor(Math.random()*3),y:0});
}
}
for(var j = 0;j<Game.lifts.length;++j){
if(Game.currentHero.GetPosition().x>=Game.lifts[j].GetPosition().x-2.5 && Game.currentHero.GetPosition().x<=Game.lifts[j].GetPosition().x-0.5){
if(Game.villains.length<=1){
Game.lifts[j].SetAwake(true);
Game.lifts[j].SetLinearVelocity({x:0,y:-3});
}
else{
	toasty.style.display = "block";
	toasty.innerHTML = "Destroy all insects to open door";
	function hidetoast(){
		toasty.innerHTML = "";
		}
		setTimeout(hidetoast,5000);
	}
}
}
for(var k = 0;k<Game.bees.length;++k){
if(Game.currentHero.GetPosition().x>=Game.bees[k].GetPosition().x-Math.floor(Math.random()*4) && Game.currentHero.GetPosition().x<Game.bees[k].GetPosition().x-1){
if(!Game.bees[k].GetUserData().isSlider){
Game.bees[k].SetAwake(true);
Game.bees[k].SetLinearVelocity({x:0,y:-1});
}
if(Game.bees[k].GetUserData().isSlider){
Game.bees[k].SetAwake(true);
Game.bees[k].SetLinearVelocity({x:randNumber(-3,-1),y:0});
}
}
if(Game.bees[k].GetPosition().y<0.05*cwidth/box2d.scale){
Game.bees[k].SetAwake(false);
}
if(Game.currentHero.GetPosition().x>=Game.bees[k].GetPosition().x-0.25 && Game.bees[k].GetPosition().y<=0.05*cwidth/box2d.scale){
Game.bees[k].SetLinearVelocity({x:0,y:0});
Game.bees[k].SetAwake(true);
}
}
}
/*pan the game world to hero to wherever the hero is*/
if(Game.mode=="autowalkingright" || "autowalkingleft"){
Game.panTo(Game.currentHero.GetPosition().x*box2d.scale);
}
//hero jumping behavior
if(Game.mode=="autowalkingleft"  || "autowalkingright"|| "herostoppedleft" || "herostoppedright" || "gamestarted"){
btnJ.onclick = function (){
btnJ.disabled = true;
function enablebtn(){
btnJ.disabled = false;
}
setTimeout(enablebtn,1000);
Game.currentHero.ApplyImpulse({x:0,y:-0.067*cwidth*0.067*cwidth/box2d.scale},Game.currentHero.GetWorldCenter());
Game.currentHero.SetAwake(true);
Game.mode = "herostoppedleft";
//hero grabs coins
for(var bdy=box2d.world.GetBodyList();bdy;bdy=bdy.GetNext()){
var entity = bdy.GetUserData();
if(entity.type=="coin"){
	if(Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/2/box2d.scale>=bdy.GetPosition().x-0.35 && Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/2/box2d.scale<=bdy.GetPosition().x+0.35){
if(entity.health<5){
box2d.world.DestroyBody(bdy);
Game.villains.pop();

if(entity.coinSound){
entity.coinSound.play();
}
}
}
}
}
};
}
},

animate:function (){
Game.toggleBackgroundSound();
Game.handlePanning();
Game.context.clearRect(0,0,300,300);
var currentTime = new Date().getTime();
var timeStep;
if(Game.lastUpdateTime){
timeStep = (currentTime-Game.lastUpdateTime)/1000;
box2d.step(timeStep);
}
Game.lastUpdateTime = currentTime;
Game.drawAllImages();
if(Game.win){
Game.winscreen();
}
if(Game.herodead && Game.insectharmful){
Game.endGame();
}
if(!Game.win && !Game.herodead){
Game.animateFrame = window.requestAnimationFrame(Game.animate,Game.canvas);
}
},

drawAllImages:function (){
for(var body = box2d.world.GetBodyList();body;body = body.GetNext()){
var entity = body.GetUserData();
if(entity){
if(entity.type=="insect" || entity.type=="bee"){
if(Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale>=body.GetPosition().y-0.1 && Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale<=body.GetPosition().y){
if(Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/2/box2d.scale>=body.GetPosition().x && Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/2/box2d.scale<=body.GetPosition().x+entity.width/box2d.scale){
/*remove body from game world when hero jumps on it*/
box2d.world.DestroyBody(body);
Game.villains.pop();
if(entity.bounceSound){
entity.bounceSound.play();
}
}
}
}
//hero incapacitated by villains
if(Game.insectharmful){
if(entity.type=="insect"){
	//insect approaches from front
if(body.GetPosition().y>=Game.currentHero.GetPosition().y && body.GetPosition().y<=Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale){
if(body.GetPosition().x<=Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale+0.1 && body.GetPosition().x>Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale){
Game.screamSound.play();
Game.heroburn = true;
function d(){
	Game.herodead = true;
	}
	setTimeout(d,40);
}
}
if(body.GetPosition().y>=Game.currentHero.GetPosition().y && body.GetPosition().y<=Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale){
if(body.GetPosition().x+body.GetUserData().width/box2d.scale>=Game.currentHero.GetPosition().x-0.1 && body.GetPosition().x+body.GetUserData().width/box2d.scale<=Game.currentHero.GetPosition().x){
//insect approaches from back
Game.screamSound.play();
Game.heroburn = true;
function d(){
Game.herodead = true;
}
setTimeout(d,40);
}
}
if(body.GetPosition().y+body.GetUserData().height/box2d.scale>=Game.currentHero.GetPosition().y-0.1 && body.GetPosition().y+body.GetUserData().height/box2d.scale<=Game.currentHero.GetPosition().y){
if(body.GetPosition().x+body.GetUserData().width/2/box2d.scale>=Game.currentHero.GetPosition().x && body.GetPosition().x+body.GetUserData().width/2/box2d.scale<=Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale){
//insect approaches from top
Game.screamSound.play();
Game.heroburn = true;
function d(){
Game.herodead = true;
}
setTimeout(d,40);
}
}
}
if(entity.type=="bee"){
if(body.GetPosition().y>=Game.currentHero.GetPosition().y-0.4 && body.GetPosition().y<=Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale){
if(Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale>=body.GetPosition().x-0.2 && Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale<=body.GetPosition().x){
Game.screamSound.play();
Game.heroburn = true;
function d(){
Game.herodead = true;
}
setTimeout(d,40);
}
}
if(body.GetPosition().y>=Game.currentHero.GetPosition().y-0.4 && body.GetPosition().y<=Game.currentHero.GetPosition().y+Game.currentHero.GetUserData().height/box2d.scale){
if(Game.currentHero.GetPosition().x>=body.GetPosition().x+body.GetUserData().width/box2d.scale && Game.currentHero.GetPosition().x<=body.GetPosition().x+body.GetUserData().width/box2d.scale+0.2){
Game.screamSound.play();
Game.heroburn = true;
function d(){
Game.herodead = true;
}
setTimeout(d,40);
}
}
}
if(entity.type=="box" || entity.type=="bee"){
if(body.GetPosition().y+body.GetUserData().height/box2d.scale>=Game.currentHero.GetPosition().y-0.4 && body.GetPosition().y+body.GetUserData().height/box2d.scale<=Game.currentHero.GetPosition().y){
if(body.GetPosition().x+body.GetUserData().width/2/box2d.scale>=Game.currentHero.GetPosition().x-body.GetUserData().width/2/box2d.scale && body.GetPosition().x+body.GetUserData().width/2/box2d.scale<=Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale+body.GetUserData().width/2/box2d.scale){
Game.screamSound.play();
Game.heroburn = true;
function d(){
Game.herodead = true;
}
setTimeout(d,40);
}
}
}
if(entity.type=="flag"){
if(Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale>=body.GetPosition().x-body.GetUserData().width/2/box2d.scale){
Levels.nextLevel();
}
if(Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale>body.GetPosition().x-body.GetUserData().width/2/box2d.scale-2 && Game.currentHero.GetPosition().x+Game.currentHero.GetUserData().width/box2d.scale<body.GetPosition().x-0.5){
	toasty.innerHTML = "";
	}
}
	}
if(body.GetPosition().y>0.9*cwidth/box2d.scale){
/*remove body from game world if it falls beyond 200 pixels*/
box2d.world.DestroyBody(body);
Game.villains.pop();
/*if the fallen body is the hero end game*/
if(body.GetUserData().name=="hero"){
//remove all other bodies as well
Game.screamSound.play();
Game.ended = true;
Game.herodead = true;
Game.life[0] = 0;
}
}
else{
entities.draw(entity,body.GetPosition());
}
}
}
},

loadResources:function (){
Game.hideplaybutton();
var e = "background"+Loader.soundFileExtension;
var a = "win"+Loader.soundFileExtension;
var b = "bounce"+Loader.soundFileExtension;
var c = "scream"+Loader.soundFileExtension;
var d = "coin"+Loader.soundFileExtension;
Game.backgroundSound = Loader.loadSoundFiles(e);
Game.winSound = Loader.loadSoundFiles(a);
Game.bounceSound = Loader.loadSoundFiles(b);
Game.screamSound = Loader.loadSoundFiles(c);
Game.coinSound = Loader.loadSoundFiles(d);
Game.sprites = Loader.loadImageFiles('sbus.png');
Game.backgroundImage = Loader.loadImageFiles('background.jpg');
Game.fireImage = Loader.loadImageFiles('fire.jpg');
},

toggleBackgroundSound:function (){
	var check = document.getElementById("check");
	check.onclick = function (){
		if(this.checked){
			Game.backgroundSound.play();
			Game.backgroundSound.loop = true;
			}
			else{
				Game.backgroundSound.pause();
				}
		};
	},

endGame:function (){
if(Game.life[0]>0 && !Game.ended){
	Game.insectharmful = false;
	Game.heroburn = true;
	if(!Game.retrycalled){
	var l = document.getElementById(Game.lifeimages[Game.lifeimages.length-1]);
	l.style.display = "none";
	Game.lifeimages.pop();
	}
	if(Game.retrycalled){
		var ims = document.getElementsByClassName("im");
		for(var i=0;i<ims.length;++i){
ims[i].style.display = "none";

			}
		}
Game.countDownTimer();
}
else{
	function del(){
	Game.hidegamelayers();
	endingscreen.style.display = "flex";
	Game.winSound.play();
	Game.destroyBodies();
	}
	setTimeout(del,2000);
	}
},

destroyBodies:function (){
	for(var bo = box2d.world.GetBodyList();bo;bo = bo.GetNext()){
		box2d.world.DestroyBody(bo);
		}
	},

winScreen:function (){
	if(Game.villains.length>1){
		toasty.style.display = "block";
		toasty.innerHTML = "Destroy all insects to finish level";
		}
		else{
function del(){
Game.destroyBodies();
Game.hidegamelayers();
winscreen.style.display = "flex";
Game.winSound.play();
Game.win = false;
}
setTimeout(del,500);
}
},

countHeroesAndVillains:function (){
Game.heroes= [];
Game.insects = [];
Game.coins = [];
Game.villains = [];
Game.lifts = [];
Game.bees = [];
Game.flags = [];
for(var body = box2d.world.GetBodyList();body;body=body.GetNext()){
var entity = body.GetUserData();
if(entity){
if(entity.type==="mainchar"){
Game.heroes.push(body);
}
if(entity.type==="insect"){
Game.insects.push(body);
}
if(entity.type==="coin"){
Game.coins.push(body);
}
if(entity.type=="bee"){
Game.bees.push(body);
}
if(entity.type=="flag"){
Game.flags.push(body);
}
if(entity.type==="insect" || entity.type==="bee"){
Game.villains.push(body);
}
if(entity.type==="box" && entity.isLift===true){
Game.lifts.push(body);
}
}
}
},
playagain:function (){
	Game.retry = true;
	Game.retrycalled = true;
Game.winSound.pause();
Game.winSound.currentTime = 0;
if(Game.life[0]==0){
	Game.life[0] = 1;
	}
Levels.nextLevel();
},
mediaQueries:function (){
if(Game.canvas){
Game.canvas.width = cwidth;
Game.canvas.height = cwidth;
}
btnR.style.position = "absolute";
btnL.style.position = "absolute";
btnJ.style.position = "absolute";
btnR.style.fontSize = 0.1*cwidth+"px";
btnL.style.fontSize = 0.1*cwidth+"px";
btnJ.style.fontSize = 0.1*cwidth+"px";
btnR.style.top = 1.1*cwidth+"px";
btnL.style.top = 1.1*cwidth+"px";
btnJ.style.top = 0.98*cwidth+"px";
btnJ.style.left = screen.width/2-parseInt(btnJ.style.fontSize)+"px";
btnR.style.left = screen.width/2+parseInt(btnR.style.fontSize)+"px";
btnL.style.left = screen.width/2-3*parseInt(btnL.style.fontSize)+"px";
},
countDownTimer:function (){
	toast.style.display = "flex";
	toast.style.position = "absolute";
	toast.style.width = "1em";
	toast.style.height = "1em";
	toast.style.top = "30%";
	toast.style.left = 0.5*screen.width-16*parseInt(toast.style.width)+"px";
	toast.style.border = "solid";
	toast.style.borderRadius = "1em";
	function timer(){
		Game.life[0] = Game.life[0]-1;
		var sec = 3;
		return function(){
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
					toast.style.border = "none";
					toast.style.left = 0.5*screen.width+16*parseInt(toast.style.width)+"px";
					toast.innerHTML = "GO!!";
					function move(){
						toast.style.display = "none";
						Game.herodead = false;
					    Game.heroburn = false;
						Game.animate();
						//move back hero to decontact insect
						//make insect harmful after decontact
						function m(){
					    Game.currentHero.SetLinearVelocity({x:-3,y:-5});
					    Game.currentHero.SetAwake(true);
					    function f(){
					    Game.insectharmful = true;
					}
					setTimeout(f,1000);
					}
					setTimeout(m,1000);
						}
						setTimeout(move,1500);
					}
				
				setTimeout(one,1500);
				setTimeout(two,3000);
				setTimeout(three,4500);
				
	}
};

//game levels object
var Levels = {
data:[
{entities:[{type:"mainchar",name:"hero",x:20,y:0.67*cwidth,width:0.067*cwidth,height:0.093*cwidth,isStatic:false},{type:"wall",name:"block1",x:105,y:0.75*cwidth,width:200,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block2",x:305,y:0.5*cwidth,width:200,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block3",x:605,y:0.75*cwidth,width:300,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block4",x:1105,y:0.75*cwidth,width:400,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block5",x:1655,y:0.75*cwidth,width:500,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block6",x:1655,y:0.167*cwidth,width:200,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block7",x:2400,y:0.667*cwidth,width:700,height:20,isStatic:true,isBoundary:false},{type:"wall",name:"block8",x:2355,y:0.033*cwidth,width:500,height:0.667*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block9",x:2670,y:0.033*cwidth,width:100,height:0.667*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block10",x:2655,y:0,width:125,height:0.133*cwidth,isStatic:true,isBoundary:false},{type:"insect",name:"insect1",x:randNumber(500,720),y:0.7*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect2",x:randNumber(510,700),y:0.7*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect3",x:randNumber(950,1270),y:0.7*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect4",x:randNumber(910,1150),y:0.7*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect5",x:randNumber(1200,1300),y:0.7*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect6",x:1650,y:0.117*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect7",x:1715,y:0.117*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect8",x:randNumber(2450,2650),y:0.617*cwidth,width:20,height:15,isStatic:false},{type:"insect",name:"insect9",x:randNumber(2250,2440),y:0.617*cwidth,width:20,height:15,isStatic:false},{type:"box",name:"box1",x:150,y:0.583*cwidth,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box2",x:500,y:0.667*cwidth,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box3",x:1600,y:0.1*cwidth,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box4",x:1730,y:0.1*cwidth,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box5",x:1675,y:0.1*cwidth,width:25,height:25,isStatic:true,isLift:false},{type:"box",name:"box6",x:1742.5,y:0.017*cwidth,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box7",x:2609,y:0.442*cwidth,width:15,height:90,isStatic:false,isLift:true,isdoor:true},{type:"coin",name:"coin1",x:randNumber(250,1600),y:155,radius:10,isStatic:true,health:15},{type:"bee",name:"bee1",x:randNumber(250,380),y:0.433*cwidth,width:25,height:20,isStatic:false},{type:"bee",name:"bee2",x:1050,y:0.683*cwidth,width:25,height:20,isStatic:false},{type:"bee",name:"bee3",x:randNumber(2100,2550),y:0.6*cwidth,width:25,height:20,isStatic:false,isSlider:true},{type:"flag",name:"flag1",x:2760,y:0.517*cwidth,width:60,height:30,isStatic:true,isGamender:false}]
},
{
entities:[{type:"mainchar",name:"hero",x:20,y:0.37*cwidth,width:0.067*cwidth,height:0.093*cwidth,isStatic:false},{type:"insect",name:"insect1",x:randNumber(150,500),y:180,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect2",x:randNumber(280,500), y:0.48*cwidth-20,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect3",x:randNumber(500,900),y:0.15*cwidth,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect4",x:350,y:0,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect5",x:700,y:0,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect6",x:550,y:-20,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect7",x:900,y:-40,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect8",x:1300,y:80,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect9",x:1500,y:20,width:20,height:15,isStatic:false,health:20},{type:"insect",name:"insect10",x:1800,y:250,width:20,height:15,isStatic:false,health:20},{type:"wall",name:"block2",x:500,y:0.67*cwidth,width:1000,height:0.17*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block1",x:150,y:0.23*cwidth,width:200,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block3",x:160,y:0.43*cwidth,width:120,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block4",x:560,y:0.27*cwidth,width:45,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block5",x:400,y:0.28*cwidth,width:200,height:0.08*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block6",x:0,y:0,width:4,height:cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block7",x:520,y:0.48*cwidth,width:120,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block8",x:688,y:0.37*cwidth,width:160,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block9",x:888,y:0.23*cwidth,width:170,height:0.053*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block10",x:1380,y:0.67*cwidth,width:500,height:0.17*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block11",x:1730,y:0.87*cwidth,width:200,height:0.067*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block12",x:1955,y:0.45*cwidth,width:250,height:0.067*cwidth,isStatic:true,isBoundary:false},{type:"wall",name:"block13",x:1730,y:0.15*cwidth,width:250,height:0.067*cwidth,isStatic:true,isBoundary:false},{type:"coin",name:"coin1",x:randNumber(270,3000),y:155,radius:10,isStatic:true,health:5},{type:"box",name:"box1",x:340,y:70,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box2",x:500,y:55,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box3",x:randNumber(1100,1400),y:100,width:50,height:50,isStatic:false,isLift:false},{type:"box",name:"box4",x:170,y:55,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box5",x:900,y:175,width:120,height:25,isStatic:false,isLift:false},{type:"box",name:"box6",x:870,y:60,width:25,height:25,isStatic:false,isLift:false},{type:"box",name:"box7",x:1300,y:150,width:50,height:50,isStatic:false,isLift:false},{type:"box",name:"box8",x:1500,y:70,width:80,height:80,isStatic:false,isLift:false},{type:"box",name:"box9",x:730,y:25,width:35,height:25,isStatic:false,isLift:false},{type:"bee",name:"bee1",x:randNumber(1800,2100),y:0.4*cwidth,width:30,height:20,isStatic:false},{type:"bee",name:"bee2",x:randNumber(1150,1600),y:0.25*cwidth,width:30,height:20,isStatic:false},{type:"flag",name:"flag1",x:2050,y:0.3*cwidth,width:60,height:30,isStatic:true,isGamender:true}]
}
],
init:function (){
box2d.init();
Game.showgamelevels();
for(var i = 0;i<Levels.data.length;++i){
/*create level select button for each level*/
var btn = document.createElement("button");
btn.id = "b"+i;

btn.onclick = function (c){
/*create box2d objects from appropriate level entities*/
c = this.id;
Game.arg = document.getElementById(c).innerHTML.slice(5)-1;
var level = Levels.data[Game.arg];
for(var k = level.entities.length-1;k>=0;k--){
var entity = level.entities[k];
/*call the create method in the entities object to create box2d objects*/
entities.create(entity);
}
Game.startGame();
};

var num = i+1;
var txt = document.createTextNode("Level"+num);
btn.appendChild(txt);
levelsbtns.appendChild(btn);
}
},
nextLevel:function (){
	if(Game.retry){
		Game.arg = Game.arg;
		}
		else{
	Game.arg = Game.arg+1;
	}
	if(Game.arg>Levels.data.length-1){
		Game.winScreen();
		}
		else{
	Game.destroyBodies();
	var level = Levels.data[Game.arg];
	for(var k=level.entities.length-1;k>=0;k--){
		var entity = level.entities[k];
		entities.create(entity);
		}
		Game.startGame();
	}
	}
};

var entities = {
definitions:{
"hero":{
density:4,
friction:0.5,
restitution:0.3
},
"insect1":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect2":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect3":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect4":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect5":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect6":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect7":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect8":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect8":{
density:0.5,
friction:0.3,
restitution:0.4
},
"insect9":{
density:1,
friction:0.3,
restitution:0.4
},
"insect10":{
density:1,
friction:0.3,
restitution:0.4
},
"block2":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block1":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block3":{
density:4.5,
friction:0.5,
restitution:0.1
},
"block4":{
density:4.5,
friction:0.5,
restitution:0.1
},
"block5":{
density:4.5,
friction:0.5,
restitution:0.1
},
"block6":{
density:4.5,
friction:0.5,
restitution:0.1
},
"block7":{
density:4.5,
friction:0.5,
restitution:0.1
},
"block8":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block9":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block10":{
density:10,
friction:0.5,
restitution:0.2
},
"block11":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block12":{
density:4.5,
friction:0.5,
restitution:0.2
},
"block13":{
density:4.5,
friction:0.5,
restitution:0.2
},
"coin1":{
density:10,
friction:0.05,
restitution:0.3
},
"box1":{
density:1,
friction:0.2,
restitution:0.1
},
"box2":{
density:4,
friction:0.2,
restitution:0.1
},
"box3":{
density:1,
friction:0.5,
restitution:0.5
},
"box4":{
density:1,
friction:0.5,
restitution:0.5
},
"box5":{
density:1,
friction:0.3,
restitution:0.1
},
"box6":{
density:10,
friction:0.5,
restitution:0.1
},
"box7":{
density:3,
friction:0.3,
restitution:0.1
},
"box8":{
density:1,
friction:0.5,
restitution:0.1
},
"box9":{
density:4,
friction:0.5,
restitution:0.05
},
"bee1":{
density:0.75,
friction:0.2,
restitution:0.2
},
"bee2":{
density:0.75,
friction:0.2,
restitution:0.2
},
"bee3":{
density:0.75,
friction:0.2,
restitution:0.2
},
"flag1":{
density:0.5,
friction:0.5,
restitution:0.1
}
},
/*the entity argument is an entity object from Levels object property data array passed when this method iscalled in the Levels init method*/
create:function (entity){
/*create an entity by calling the box2d object create rectangle or circle method*/
var definition = entities.definitions[entity.name];
if(!definition){
alert("Undefined entity "+ entity.name);
return;
}
switch(entity.type){

case "mainchar":
entity.shape = "rectangle";
entity.sprite = Game.sprites;
entity.screamSound = Game.screamSound;
box2d.createRectangle(entity,definition);
break;

case "insect":
entity.shape = "rectangle";
entity.sprite = Game.sprites;
entity.bounceSound = Game.bounceSound;
box2d.createRectangle(entity,definition);
break;

case "wall":
entity.shape = "rectangle";
entity.sprite = Game.sprites;
box2d.createRectangle(entity,definition);
break;

case "coin":
entity.shape = "circle";
entity.sprite = Game.sprites;
entity.coinSound = Game.coinSound;
box2d.createCircle(entity,definition);
break;

case "box":
entity.shape = "rectangle";
entity.sprite = Game.sprites;
box2d.createRectangle(entity,definition);
break;

case "bee":
entity.sprite = Game.sprites;
box2d.createRectangle(entity,definition);
break;

case "flag":
entity.sprite = Game.sprites;
box2d.createRectangle(entity,definition);
}
},
draw:function (entity,position){

Game.context.translate(position.x*box2d.scale-Game.offSetLeft,position.y*box2d.scale);

switch(entity.type){

case "mainchar":
if(Game.heroburn){
	Game.context.drawImage(Game.fireImage,0,0,32,32,-entity.width/2-2,-1.2*entity.height-1,2*entity.width-1,2*entity.height-1);
	}
	else{
Game.context.drawImage(entity.sprite,1,2,30,entity.sprite.height-4,-entity.width/2-2,-entity.height/2-1,entity.width-1,entity.height-1);
}
break;

case "insect":
Game.context.drawImage(entity.sprite,262,0,28,30,-entity.width/2-1,-entity.height/2-1,entity.width-1,entity.height-1);
break;

case "wall":
Game.context.drawImage(entity.sprite,64,0,32,32,-entity.width/2-2,-entity.height/2-1,entity.width-1,entity.height-1);
break;

case "coin":
Game.context.drawImage(entity.sprite,290,0,32,32,-entity.radius,-entity.radius,entity.radius*2-1,entity.radius*2-1);
break;

case "box":
if(!entity.isLift){
Game.context.drawImage(entity.sprite,96,0,32,32,-entity.width/2-1,-entity.height/2-1,entity.width-1,entity.height-1);
}
if(entity.isLift){
Game.context.drawImage(entity.sprite,96,0,32,32,-entity.width/2-1.6,-entity.height/2-3.6,entity.width-1,entity.height-1);
}
break;

case "bee":
Game.context.drawImage(entity.sprite,325,2,27,30,-entity.width/2-2,-entity.height/2+1,entity.width-1,entity.height-1);
break;

case "flag":
Game.context.drawImage(entity.sprite,32,0,32,32,-entity.width/2-1,-entity.height/2-1,entity.width-1,entity.height-1);

}
Game.context.translate(-position.x*box2d.scale+Game.offSetLeft,-position.y*box2d.scale);
}
};

var box2d = {
scale:30,
init:function (){
var gravity = new b2Vec2(0,9.8);
var allowSleep = true;
box2d.world = new b2World(gravity,allowSleep);

var listener = new Box2D.Dynamics.b2ContactListener;
listener.PostSolve = function (contact,impulse){
var body1 = contact.GetFixtureA().GetBody();
var body2 = contact.GetFixtureB().GetBody();
var entity1 = body1.GetUserData();
var entity2 = body2.GetUserData();
var impulseAlongNormal = Math.abs(impulse.normalImpulses[0]);
if(impulseAlongNormal>5){
if(entity1.health){
entity1.health -= impulseAlongNormal;
}
if(entity2.health){
entity2.health -= impulseAlongNormal;
}
}
};
box2d.world.SetContactListener(listener);
},
createRectangle:function (entity,definition){

var bodyDef = new b2BodyDef;
if(entity.isStatic==true){
bodyDef.type = b2Body.b2_staticBody;
}
else{
bodyDef.type = b2Body.b2_dynamicBody;
}
bodyDef.position.x = entity.x/box2d.scale;
bodyDef.position.y = entity.y/box2d.scale;

var fixtureDef = new b2FixtureDef;
fixtureDef.density = definition.density;
fixtureDef.friction = definition.friction;
fixtureDef.restitution = definition.restitution;
fixtureDef.shape = new b2PolygonShape;
fixtureDef.shape.SetAsBox(entity.width/2/box2d.scale,entity.height/2/box2d.scale);

var body = box2d.world.CreateBody(bodyDef);
body.SetUserData(entity);
var fixture = body.CreateFixture(fixtureDef);
return body;
},
createCircle:function (entity,definition){

var bodyDef = new b2BodyDef;
if(entity.isStatic==true){
bodyDef.type = b2Body.b2_staticBody;
}
else{
bodyDef.type = b2Body.b2_dynamicBody;
}
bodyDef.position.x = entity.x/box2d.scale;
bodyDef.position.y = entity.y/box2d.scale;

var fixtureDef = new b2FixtureDef;
fixtureDef.density = entity.density;
fixtureDef.friction = entity.friction;
fixtureDef.restitution = entity.restitution;
fixtureDef.shape = new b2CircleShape(entity.radius/box2d.scale);

var body = box2d.world.CreateBody(bodyDef);
body.SetUserData(entity);
var fixture = body.CreateFixture(fixtureDef);
return body;

},
step:function (timeStep){
if(timeStep>2/60){
timestep = 2/60;
}
box2d.world.Step(timeStep,8,3);
}
};

window.onload = Game.init;