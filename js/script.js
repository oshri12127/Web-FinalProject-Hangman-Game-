  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDw_tDZu1yNEh3FsAq-3mAVmMi4ECAgME8",
    authDomain: "finalprojectweb-6ea4b.firebaseapp.com",
    databaseURL: "https://finalprojectweb-6ea4b.firebaseio.com",
    projectId: "finalprojectweb-6ea4b",
    storageBucket: "finalprojectweb-6ea4b.appspot.com",
    messagingSenderId: "517852498593",
    appId: "1:517852498593:web:02203ae20e84b066"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  var scorePerGame = 100;
  var rand = 0;
  var word = "";
  var numWrong = 0;
  var numRight = 0;
  var phraseLength = 0;
  var numChar = 0;
  var sports = [];     
  var movies = []; 
  var music = [];
  var computerScience = [];
  var userNow2;
  var userEmail;
  var currentQuestion = "";
  var keys = [];

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        userNow2 = user;
        var img = document.getElementById('pic');
        var name = document.getElementById('name');
        img.src = userNow2.photoURL;
        name.innerHTML = "Hello " + userNow2.displayName;
        if(userNow2.photoURL==null)
            img.src ="images/ANONYMOUS_USER.png";
        
    } else {
        window.location.href = "index.html"
        
    }
});


function refillCategory(cat,api){
//upload data from the api to the array
    $.ajax({
        url: api,
        type: "GET",
        async: true,
        success: function(data) {
               for (let index = 0; index < 30; index++)
                    cat.push(data.results[index]);  

        },
        error: function(err) {
            console.log(err);
        }

    });
    
}


function sp(){ //single player
    refillCategory(movies,"https://opentdb.com/api.php?amount=30&category=11&difficulty=medium&type=multiple");
    refillCategory(computerScience,"https://opentdb.com/api.php?amount=30&category=18&difficulty=medium&type=multiple");
    refillCategory(sports,"https://opentdb.com/api.php?amount=30&category=21&difficulty=medium&type=multiple");
    refillCategory(music,"https://opentdb.com/api.php?amount=30&category=12&difficulty=medium&type=multiple");
    
	
    document.getElementById('introPage').style.display = "none";
    document.getElementById('HighScore').style.display = "none";
    document.getElementById('singlePage').style.display = "block";

}
function hs(){
//high score
    document.getElementById('introPage').style.display = "none";
    document.getElementById('singlePage').style.display = "none";
    document.getElementById('HighScore').style.display = "block";
    sortScors();
    YourPoints();

}


function sortScors(){
    
    
    var ref = firebase.database().ref();
    ref.once('value',function(snap) { //once - only for one time connected
    snap.forEach(function(item) {
        var itemVal = item.val();
        keys.push(itemVal);
        
    });
    keys.sort((a,b) => (a.data.score<b.data.score) ? 1:-1);//sort the users by the score
    for(var i = 0;i<keys.length;i++){
        var img = document.getElementById('picH' + i);
        var name = document.getElementById('name' + i);
        var scor = document.getElementById('score' + i);
        img.src = keys[i].data.photoURL;
        scor.innerHTML = keys[i].data.score + " ";
        name.innerHTML = keys[i].data.username;
        
    }

    
    
});
}

function YourPoints(){
	firebase.auth().onAuthStateChanged(function (user){
		userNow2 = user.uid;
        var datesRef = firebase.database().ref();
	
	return datesRef.child(userNow2).child('data').once('value').then(function(snapshot) {
  var points = snapshot.child('score').val();
  document.getElementById('characterCount').innerHTML = "your points: " + points;
});
});
	
}

function out(){ //logout

     firebase.auth().signOut().then(function () {
                window.location.href = "index.html";
            }).catch(function (error) {
                alert("Could not logout!");
            });
            
}

function computerSc(){

    document.getElementById('singlePage').style.display = "none";
    document.getElementById('categoryName').innerHTML = "Computer Scince";
    hangman(computerScience);
}

function movie(){

    document.getElementById('singlePage').style.display = "none";
    document.getElementById('categoryName').innerHTML = "Movies";
    hangman(movies);
}

function musics(){

    document.getElementById('singlePage').style.display = "none";
    document.getElementById('categoryName').innerHTML = "Music";
    hangman(music);
}

function sport(){

    document.getElementById('singlePage').style.display = "none";
    document.getElementById('categoryName').innerHTML = "Sport";
    hangman(sports);
}

function countChars(countfrom,displayto) {
    var len = document.getElementById(countfrom).value.length;
    document.getElementById(displayto).innerHTML = len;
}


function clu(obj){

    if(obj.value != "hide"){
        if(scorePerGame != 0) scorePerGame -= 20;
        document.getElementById('scores').innerHTML = "score: " + scorePerGame;
        document.getElementById('clue').innerHTML =  currentQuestion;
    }
    obj.value = "hide";

}

function hangman(cat){
    
    rand = Math.floor(Math.random()*cat.length);
    word = cat[rand].correct_answer;
    currentQuestion = cat[rand].question;
    var x = word.length;
    var y = x-1;
    var spaces = 0;

    var validChar = new Array("a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "?", "!", ",", ".", "-", "'");

    for(z = 0; z < word.length; z++){
        var letter = word.substring(y,x);
        if(validChar.indexOf(letter) > -1){
            x--;
            y--;
        }
        else{ 
            rand = Math.floor(Math.random()*cat.length);
            word = cat[rand].correct_answer;
            var x = word.length;
            var y = x-1;
            z=0;
        }
    }
    
    x = word.length;
    y = x-1;
    while (x>0){
        numChar++;
        var letter = word.substring(y,x);
        if(letter === " "){
            document.getElementById('letter'+x).innerHTML = "&nbsp;";
            document.getElementById('letter'+x).style.visibility = "hidden";
            document.getElementById('letter'+x).style.display = "block";
            document.getElementById('underline'+x).style.display = "block";
            spaces++;
        }
        else if(letter === "?" || letter === "!" || letter === "," || letter === "." || letter === "-" || letter === "'"){
            document.getElementById('letter'+x).innerHTML = letter;
            document.getElementById('letter'+x).style.display = "block";
            document.getElementById('underline'+x).style.display = "block";
            spaces++;
        }
        else{
            document.getElementById('letter'+x).innerHTML = letter;
            document.getElementById('letter'+x).style.visibility = "hidden";
            document.getElementById('underline'+x).style.display = "block";            
            document.getElementById('underline'+x).style.borderBottom = "3px solid black";
        }
        x--;
        y--;
    }
    phraseLength = word.length - spaces;
    document.getElementById('HighScore').style.display = "none";
    document.getElementById('gamePage').style.display = "block";
	document.getElementById('scores').innerHTML = "score: " + scorePerGame;
    splitWords();
    draw();
}

function draw(){
    var ctx = document.getElementById("hangman").getContext('2d');
        ctx.fillStyle = "white";
        ctx.lineWidth=3;
        ctx.fillRect(0, 0, 300, 300);
        ctx.beginPath(); //vertical bar
            ctx.moveTo(50,270);
            ctx.lineTo(50,25);
            ctx.stroke();
        ctx.beginPath(); //vertical bar long piece
            ctx.moveTo(65,270);
            ctx.lineTo(65,85);
            ctx.stroke();
        ctx.beginPath(); //vertical bar short piece
            ctx.moveTo(65,64);
            ctx.lineTo(65,40);
            ctx.stroke();
        ctx.beginPath(); //horizontal bar
            ctx.moveTo(49,25);
            ctx.lineTo(175,25);
            ctx.stroke();
        ctx.beginPath(); //horizontal bar short piece
            ctx.moveTo(49,40);
            ctx.lineTo(86,40);
            ctx.stroke();
        ctx.beginPath(); //horizontal bar long piece
            ctx.moveTo(106,40);
            ctx.lineTo(175,40);
            ctx.stroke();
        ctx.beginPath(); //small vertical bar
            ctx.moveTo(173,25);
            ctx.lineTo(173,40);
            ctx.stroke();
        ctx.beginPath(); //cross bar
            ctx.moveTo(50,80);
            ctx.lineTo(100,25);
            ctx.stroke();
        ctx.beginPath(); //cross bar
            ctx.moveTo(60,90);
            ctx.lineTo(111,35);
            ctx.stroke();
        ctx.beginPath(); //cross bar
            ctx.moveTo(50,80);
            ctx.lineTo(60,90);
            ctx.stroke();
        ctx.beginPath(); //cross bar
            ctx.moveTo(100,25);
            ctx.lineTo(111,35);
            ctx.stroke();
        ctx.beginPath(); //ground
            ctx.moveTo(35,270);
            ctx.lineTo(265,270);
            ctx.stroke();
        ctx.beginPath(); //noose
            ctx.moveTo(150,40);
            ctx.lineTo(150,80);
            ctx.stroke();
}

function splitWords(){
    var placeKeep = 0;
    var countBack = 16;
    if(numChar > 15){
        while(countBack > 1){
            if(document.getElementById('letter16').innerHTML == "&nbsp;"){
                document.getElementById('underline16').style.width = "0px";
                document.getElementById('underline16').style.marginRight = "0px";
            }
            if(document.getElementById('letter'+countBack).innerHTML == "&nbsp;"){
                document.getElementById('underline'+countBack).style.width = (document.getElementById('underline1').offsetWidth)*(16-countBack)+"px";
                placeKeep = countBack;
                countBack = 0;
            }
            countBack--;
        }
    }
    for(x=0;x<8;x++){
        countBack = 15+placeKeep;
        if(numChar > countBack){
            while(countBack > 1){
                if(document.getElementById('letter'+countBack).innerHTML == "&nbsp;"){
                    document.getElementById('underline'+countBack).style.width = (document.getElementById('underline1').offsetWidth*((16+placeKeep)-countBack))+"px";
                    placeKeep = countBack;
                    countBack = 0;
                }
                countBack--;
            }
        }
    }
    
}

function guessLetter(){
    var correct = 0;
    var target = event.target || event.srcElement;
    target.style.visibility = "hidden";
    var lower = target.id;
    var upper = document.getElementById(lower).getAttribute('value');
    var results = document.getElementById('results');
    var ul1 = document.getElementById('underline1').offsetWidth;

    for(a = 1; a < 101; a++){
        if(document.getElementById('letter'+a).innerHTML === upper || document.getElementById('letter'+a).innerHTML === lower){
            document.getElementById('letter'+a).style.visibility = "visible";
            correct++;
            numRight++;
            document.getElementById('scores').innerHTML = "score: " +scorePerGame;
        }
    }

    if(correct == 0){ //no letter was correct 
        numWrong++; 
		if(numWrong < 7)
			scorePerGame+=-10;
		document.getElementById('scores').innerHTML = "score: " +scorePerGame;
        hang();
    }
    if(numWrong == 6){
        results.style.visibility = "visible";
        results.style.color = "red";
        results.innerHTML = "You can't miss another letter!";

        if(ul1 == 50){
            results.style.lineHeight = "70px";
            results.style.fontSize = "30px";
        }
        if(ul1 == 28){
            results.style.lineHeight = "50px";
            results.style.fontSize = "25px";
        }
        if(ul1 == 18){
            results.style.lineHeight = "40px";
            results.style.fontSize = "20px";
        }
    }
    if(numWrong == 7)//stop in 7 worng;
	{
        scorePerGame=0;
		document.getElementById('scores').innerHTML = "score: " +scorePerGame;
		results.innerHTML = "You lost!";
        var ul1 = document.getElementById('underline1').offsetWidth;
        var again = document.getElementById('again');
        var results = document.getElementById('results');
        results.style.visibility = "visible";
        results.style.color = "red";
        document.getElementById('letterBank').style.display = "none";
        again.style.display = "block";
        document.getElementById('home').style.display = "block";
		
        if(ul1 == 50){
            results.style.lineHeight = "40px";
        }
        if(ul1 == 28){
            results.style.lineHeight = "25px";
        }
        if(ul1 == 18){
            results.style.lineHeight = "20px";
        }
		updateScore();
    }
	
    if(numRight == phraseLength){//to complete all the word
        updateScore();
		win();	
    }
}
function updateScore()//update score to firebase that game over(per game)
{
	firebase.auth().onAuthStateChanged(function (user){
		userNow2 = user.uid;
    var datesRef = firebase.database().ref();
	
	datesRef.child(userNow2).child('data').child('score').transaction(function(score){
				return score+scorePerGame; //transcation==> Todo += to the score
    });

    console.log();
	});
}
function win(){
    var ul1 = document.getElementById('underline1').offsetWidth;
    var again = document.getElementById('again');
    var results = document.getElementById('results');
        results.style.color = "green";
        results.innerHTML = "You won!";
        results.style.visibility = "visible";
        document.getElementById('letterBank').style.display = "none";
        again.style.display = "block";
        document.getElementById('home').style.display = "block";

        if(ul1 == 50){
            again.style.marginTop = "75px";
            results.style.marginTop = "75px";
            results.style.fontSize = "200px";
        }
        if(ul1 == 28){
            again.style.marginTop = "50px";
            results.style.marginTop = "40px";
            results.style.fontSize = "100px";
        }
        if(ul1 == 18){
            again.style.marginTop = "40px";
            results.style.marginTop = "15px";
            results.style.fontSize = "75px";
        }
       
    }


function hang(){
    var ctx = document.getElementById("hangman").getContext('2d');
    if(numWrong == 1){
        ctx.beginPath(); //head
            ctx.arc(150, 100, 20, 0, 2*Math.PI);
            ctx.stroke();
        ctx.beginPath(); //left eye
            ctx.arc(143, 95, 3.5, 0, 2*Math.PI);
            ctx.stroke();
        ctx.beginPath(); //right eye
            ctx.arc(157, 95, 3.5, 0, 2*Math.PI);
            ctx.stroke();
        ctx.beginPath(); //mouth
            ctx.arc(150, 103, 9, 0, Math.PI);
            ctx.stroke();
    }
    if(numWrong == 2){
        ctx.beginPath(); //body
            ctx.moveTo(150,120);
            ctx.lineTo(150,190);
            ctx.stroke();
    }
    if(numWrong == 3){
        ctx.fillStyle = "white";
        ctx.fillRect(138, 102, 24, 12); //cover mouth
        ctx.beginPath(); //straight mouth
            ctx.moveTo(140,108);
            ctx.lineTo(160,108);
            ctx.stroke();
        ctx.beginPath(); //right arm
            ctx.moveTo(150,135);
            ctx.lineTo(180,160);
            ctx.stroke();
    }
    if(numWrong == 4){
        ctx.beginPath(); //left arm
            ctx.moveTo(150,135);
            ctx.lineTo(120,160);
            ctx.stroke();
    }
    if(numWrong == 5){
        ctx.fillRect(138, 102, 24, 12); //cover mouth
        ctx.beginPath(); //sad mouth
            ctx.arc(150, 112, 9, 0, Math.PI, true);
            ctx.stroke();
        ctx.beginPath(); //right leg
            ctx.moveTo(149,188);
            ctx.lineTo(180,230);
            ctx.stroke();
    }
    if(numWrong == 6){
        ctx.beginPath(); //left leg
            ctx.moveTo(151,188);
            ctx.lineTo(120,230);
            ctx.stroke();
    }
    if(numWrong == 7){
        ctx.fillRect(138, 90, 24, 24); //cover face
        ctx.fillRect(118, 121.2, 70, 120); //cover body
        ctx.beginPath(); //straight mouth
            ctx.moveTo(140,108);
            ctx.lineTo(160,108);
            ctx.stroke();
        ctx.beginPath(); //body
            ctx.moveTo(150,135);
            ctx.lineTo(150,205);
            ctx.stroke();
        ctx.beginPath(); //right arm
            ctx.moveTo(150,150);
            ctx.lineTo(180,175);
            ctx.stroke();
        ctx.beginPath(); //left arm
            ctx.moveTo(150,150);
            ctx.lineTo(120,175);
            ctx.stroke();
        ctx.beginPath(); //right leg
            ctx.moveTo(149,203);
            ctx.lineTo(180,245);
            ctx.stroke();
        ctx.beginPath(); //left leg
            ctx.moveTo(151,203);
            ctx.lineTo(120,245);
            ctx.stroke();
        ctx.lineWidth=2;
        ctx.beginPath(); //left eye
            ctx.moveTo(140,93);
            ctx.lineTo(146,98);
            ctx.stroke();
            ctx.moveTo(140,98);
            ctx.lineTo(146,93);
            ctx.stroke();
        ctx.beginPath(); //right eye
            ctx.moveTo(154,98);
            ctx.lineTo(160,93);
            ctx.stroke(); 
            ctx.moveTo(154,93);
            ctx.lineTo(160,98);
            ctx.stroke();
    }
 
}

function reset(){
    var ul1 = document.getElementById('underline1').offsetWidth;
    var results = document.getElementById('results');
    var again = document.getElementById('again');
    
    for(a = 1; a < 101; a++){
        document.getElementById('letter'+a).innerHTML = "&nbsp;";
        document.getElementById('underline'+a).style.width = ul1 + "px";
        if(ul1 == 50){
            document.getElementById('underline'+a).style.marginRight = "5px";
            results.style.height = "70px";
        }
        else if(ul1 == 28){
            document.getElementById('underline'+a).style.marginRight = "3px";
            results.style.height = "50px";
        }
        else{
            document.getElementById('underline'+a).style.marginRight = "3px";
            results.style.height = "40px";
        }
        document.getElementById('underline'+a).style.display = "none";
        document.getElementById('underline'+a).style.borderBottom = "0px";
    }
    var bank = document.getElementById("letterBank").querySelectorAll("div");
    for(b = 0; b < 26; b++){
        bank[b].style.visibility = "visible";
    }
    scorePerGame = 100;
    numWrong = 0;
    numRight = 0;
    phraseLength = 0;
    numChar = 0;
    results.style.marginTop = "5px";
    results.style.lineHeight = "40px";
    results.innerHTML = " ";
    document.getElementById('letterBank').style.display = "block";
    again.style.marginTop = "0px";
    again.style.display = "none";
    
    document.getElementById('clue').value = "not hidden";
    document.getElementById('clue').innerHTML = "Hint";
    document.getElementById('clue').style.display = "visible";
    document.getElementById('home').style.display = "none";

    if(computerScience[rand].correct_answer == word){
        computerScience.splice(rand,1);
        computerSc();
    }
    else if(movies[rand].correct_answer == word){
        movies.splice(rand,1);
        movie();
    }
    else if(music[rand].correct_answer == word){
        music.splice(rand,1);
        musics();
    }
    else if(sports[rand].correct_answer == word){
        sports.splice(rand,1);
        sport();
    }
 
}

    
        



