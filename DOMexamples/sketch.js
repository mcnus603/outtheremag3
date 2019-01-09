var canvas;
var h1;
var bgcolor;
var button;
var r;


function setup() {
  canvas = createCanvas(600, 600);
  bgcolor= color(200);
  button = createButton("go go go go");
  button.mousePressed(changeColor);
 
}

function draw() {
  background(bgcolor);
  fill(255, 0, 175);

  for (var i = 0; i< 10; i++) {
  	r = random(600);
  	rect(r, r, 50, 50);
  }
  
  
}


function mousePressed() {
}

function changeColor() {
	bgcolor = color(random(255));
}

function createRectangles(){

// for loop creating rectgangles
//display rectangles
//update rectangles 


}




