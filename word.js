window.onload = wordArray;

var words = [];

var wordbank = [];

function wordArray(){

var request = new XMLHttpRequest();

request.open("GET","https://api.datamuse.com/words?sp=??????");

request.onreadystatechange = function(){

if(this.readyState==this.DONE && this.status==200){

parseWords(this.responseText);

displayScrambledWord();

}

};

request.send();

}

function parseWords(jsonWords){

if(!jsonWords){

return;

}

var wordObjects = JSON.parse(jsonWords);

for(var i=0;i<wordObjects.length;++i){

var word = wordObjects[i].word;

words.push(word);

}

}

function displayScrambledWord(){

reset();

var len = words.length;

var word = [];

var rand = Math.floor(Math.random()*len);

var disp = document.getElementById("disp");

var a = words[rand];

wordbank.push(a);

for(var i=0;i<a.length;++i){

var letter = a.charAt(i);

word.push(letter);

}

var scrambledword = word.sort().join('');

disp.innerHTML = scrambledword;

}

function enterAnswer(arg){

var arg = wordbank[0];

var a = arg.slice(0).toLowerCase();

var b = arg.slice(0).toUpperCase();

var c = arg.charAt(0).toUpperCase();

var d = arg.slice(1);

var e = c+d;

disp2.innerHTML = document.getElementById("ans").value;

if(disp2.innerHTML== a || disp2.innerHTML==b || disp2.innerHTML==e){

alert("Correct");

reset();

setTimeout(displayScrambledWord,500);

}
else{

alert("Incorrect");

resetInputField(ans);

}

}

function reset(){

wordbank = [];

disp.innerHTML = "";

disp2.innerHTML = "";

resetInputField(ans);

}

function showAnswer(){

disp2.innerHTML = wordbank[0];

}

function resetInputField(arg){

arg.value = "";

}