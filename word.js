window.onload = wordArray;

var words = [];

var wordbank = [];

function wordArray(){

var request = new XMLHttpRequest();

request.open("GET","https://api.datamuse.com?sp=??????");

request.onreadystatechange = function(){

if(this.readyState==this.DONE && this.status==200){

parseWords(this.responseText);

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

function enterAnswer(){

disp2.innerHTML = document.getElementById("ans").value;

if(disp2.innerHTML==wordbank[0]){

disp.innerHTML = "Correct";

reset();

setTimeout(displayScrambledWord,500);

}
else{

disp.innerHTML = "incorrect";

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