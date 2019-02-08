var board1;
var board2;

function Quadratic(a,b,c,l){

this.a = a;
this.b = b;
this.c = c;
this.l = l;

}

Quadratic.prototype.getExpression = function (){

var exp = document.getElementById("quad").value.replace(/\s+/g,"");

board1 = document.getElementById("board1");

board1.innerHTML = "<b>"+exp+"</b>";

};

//add a method to the Quadratic constructor prototype

Quadratic.prototype.stepOne = function (){

board1 = document.getElementById("board1");

board1.innerHTML += "<br><br>";

//remove white space from user input
var exp = document.getElementById("quad").value.replace(/\s+/g,"");

//declare and initialise variables

var A = this.a;

var B = this.b;

var C = this.c;

var getBsign = B.charAt(0);

var getAsign = A.charAt(0);

var getCsign = C.charAt(0);

var fchar = exp.charAt(0);

var reg4 = exp.match(/[a-zA-Z]/);

/*logic for number sign changes on multiplication,division or crossover the equal sign*/

if(getAsign=="-" && getBsign=="-"){

var changebsign = "+";

var changeasign = "";
//when crossing the equal sign
var signchangeover = "-";

}
if(getAsign=="-" && getBsign=="+"){

var changebsign = "-";

var changeasign = "";

var signchangeover = "";

}
if(Number(getAsign) && getBsign=="-"){

var changebsign = "-";

var changeasign = "";

var signchangeover = "";

}

if(Number(getAsign) && getBsign=="+"){

var changebsign = "+";

var changeasign = "";

var signchangeover = "-";

}

if(getAsign=="-" && getCsign=="-"){

var changecsign = "+";

var finalcsign = "-";

var changeasign = "";

}
if(getAsign=="-" && getCsign=="+"){

var changecsign = "-";

var finalcsign = "+";

var changeasign = "";

}
if(Number(getAsign) && getCsign=="-"){

var changecsign = "-";

var finalcsign = "+";

var changeasign = "";

}
if(Number(getAsign) && getCsign=="+"){

var changecsign = "+";

var finalcsign = "-";

var changeasign = "";

}

//coefficients with changed signs

if(fchar=="-" && A.length>1){

var amod = A.slice(1,);

var samod = A.slice(1,);

}
else if(Number(fchar) && A.length>=1){

var amod = "-"+A.slice(0,);

var samod = A.slice(0,);

}
else if(/[a-zA-Z]/.test(fchar)){

var amod = "-"+A.slice(0,);

var samod = A.slice(0,);

}

if(exp.charAt(exp.indexOf(reg4)+2)=="-"){

var bmod = B.slice(1,);

}
else if(exp.charAt(exp.indexOf(reg4)+2)=="+"){

var bmod = "-"+B.slice(1,);

}

if(exp.charAt(exp.lastIndexOf(reg4)+1)=="-"){

var cmod = C.slice(1,);

}
else if(exp.charAt(exp.lastIndexOf(reg4)+1)=="+"){

var cmod = "-"+C.slice(1,);

}

var sbmod = B.slice(1,);

var scmod = C.slice(1,);

var bsign = B.charAt(0);

var csign = C.charAt(0);

function makeFraction(a,b,c,d,e,f){

var n1 = a+b;

var n2 = c+d;

var n3 = e+f*f;

var n4 = d*d*2*2;

var r1 = n1/n2;

var r2 = n3/n4;

return r1+r2;

}

var fract = makeFraction(finalcsign,cmod,changeasign,amod,bsign,bmod);

function makeFraction2(a,b){

var n1 = 2*a;

var n2 = b;

var n3 = n2/n1;

return n3*n3;

}

//variables to hold 

var fract2 = makeFraction2(bmod,amod);

var fract3 = bmod/amod;

var fract4 = finalcsign+scmod/samod;

var fract5 = 2*samod;

var fract6 = sbmod/fract5;

var fract7 = parseFloat(fract4)+parseFloat(fract6)*parseFloat(fract6);

var sroot = Math.sqrt(fract7);

var ans1 = signchangeover+fract6;

var ans3 = sroot;

var answer1 = parseFloat(ans1)-parseFloat(ans3);

var answer2 = parseFloat(ans1)+parseFloat(ans3);

var changesign1 = bmod;

var changesign2 = changeasign+amod;

var m = 2*changesign2;

var changesign = changesign1/m;

work = "The coefficient of "+this.l+"² is "+this.a+" so divide each term in the expression by "+this.a+" i.e "+this.a+this.l+"²/"+this.a+" "+this.b+this.l+"/"+this.a+" "+this.c+"/"+this.a+" = 0, this simplifies to "+this.l+"² "+changebsign+sbmod+this.l+"/"+changeasign+samod+changecsign+scmod+"/"+samod+" = 0. Now take "+changecsign+scmod+"/"+changeasign+samod+" to the other side of the equal sign and this becomes "+this.l+"² "+changebsign+sbmod+this.l+"/"+changeasign+samod+" = "+finalcsign+scmod+"/"+changeasign+samod+". Now multiply "+changebsign+sbmod+"/"+changeasign+samod+", the coefficient of "+this.l+" by ½ and square it then add it to both sides i.e "+this.l+"²"+changebsign+fract3+this.l+" "+"+"+"("+changesign+")²"+" = "+fract4+"+"+"("+changesign+")²"+" ,Now change the left side into a binomial i.e ("+this.l+changebsign+fract6+")² =  "+fract7+".Now take the square root both sides i.e √("+this.l+changebsign+fract6+")² = √"+fract7+".This simplifies to "+this.l+changebsign+fract6+" = "+"+/-"+sroot+".Taking "+changebsign+fract6+" to the other side, "+this.l+"="+signchangeover+fract6+"+"+sroot+" or "+this.l+"="+signchangeover+fract6+"-"+sroot+" ,therefore "+this.l+"="+answer2.toFixed(1)+" or "+this.l+"="+answer1.toFixed(1)+" (to 2 s.f)";

var i = 0;

function typ(){

if(i<work.length){

d2.style.display = "none";

board1.innerHTML += work.charAt(i);++i;

setTimeout(typ,20);

}
if(i==work.length){

d2.style.display = "block";

}

}

typ();

};

function init(){

var exp = document.getElementById("quad").value.replace(/\s+/g,"");

var firstchar = exp.charAt(0);

var secondchar = exp.charAt(1);

var thirdchar = exp.charAt(2);

var reg1 = /[a-zA-Z]²|[a-zA-Z]2/;

var reg2 = /[^\d\w+-²=]/;

var reg3 = /[.,]/;

var x = /[a\\-z]/;

var y = /[-+]/;

var z = /[\d]/;

var reg4 = exp.match(x);

alert("reg4 "+reg4);

var firstletter = exp.indexOf(reg4);

var lastletter = exp.lastIndexOf(reg4);

var charbeforeletter = exp.charAt(lastletter-1);

var fs = exp.charAt(firstletter);

alert("letter "+fs);

var firstsign = exp.indexOf(fs)+2;

alert('fs '+firstsign);

alert("cbl "+charbeforeletter);

//test to see if coeffecients of x² equal 1

if(firstchar=="-" && x.test(secondchar)){

var a = "-1";

}
else if(x.test(firstchar)){

var a = "1";

}
else{

var a = exp.slice(0,firstletter);

}

//test to see if coefficient of x equal 1

if(charbeforeletter=="-"){

var b = "-1";

}
else if(charbeforeletter=="+"){

var b = "+1";

}
else{

var b = exp.slice(firstsign,lastletter);

}

alert("b "+b);

var c = exp.slice(lastletter+1);

var l = exp.charAt(firstletter);

var newQuad = new Quadratic(a,b,c,l);

newQuad.getExpression();

if(!reg1.test(exp) || reg2.test(exp) || reg3.test(exp)){

board1.innerHTML="Wrong quadratic format";

return;

}
else{

newQuad.stepOne();

}

}