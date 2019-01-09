
//MIDTERM WRITTEN IN P5

// code 2
// spring 2018
// sarah mcnutt
// midterm

var contentData;
var colorData;
var rectArray = [];
var sections = ["relationships", "weddings", "marriage", "romance", "sex", "gender", "lgbt", "about"];
var toolbarArray = [];
var previousSection; 
var aCurrentDrag = false;
var numDragged; 
var expandImage;
var resetButton;

var canvasHeight;
var canvasWidth;

function preload() {
  contentData = loadJSON('content.json');
  colorData = loadJSON('colors.json');
  goudy = loadFont('fonts/webfonts/36058A_0_0.ttf'); 
  slateReg = loadFont('fonts/webfonts/36058A_2_0.ttf'); 
  slateBold = loadFont('fonts/webfonts/36058A_1_0.ttf'); 
  monospaceBold = loadFont('fonts/webfonts/36067E_1_0.ttf'); 
  monospaceReg = loadFont('fonts/webfonts/36067E_0_0.ttf'); 
  expandImage = loadImage('images/expand.png')
}

function setup() {

  numDragged = 0;

  for (var i = 0; i < sections.length; i++) {
    var str = sections[i].toUpperCase();
    var div = createDiv(str);
    div.addClass('toolbar');
    toolbarArray.push(div);
  }

  var div = createDiv('RESET'); 
  div.addClass('reset');
  resetButton = div;
  canvasWidth = innerWidth * .9;
  canvasHeight = innerHeight - 100;
  var cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.class('cnv');
  noStroke();
}

function draw() {
  background(255);
  startPage();
  toolbarCheck();
  checkDrag();
  resetButton.style('display', 'inline-block');

  for (var i = 0; i < rectArray.length; i++) {
    drawOpinionBlockStates(rectArray[i]);
  } 
}

 //START PAGE FUNCTION 
function sectionClicked () {
  var newSection = (this.html()).toLowerCase();

  //change styles for new section
  for(var i = 0; i < sections.length; i++) {
    if(sections[i] == newSection) {
      this.style('background-color', 'rgb('+colorData.colors[newSection][0].r + ',' + colorData.colors[newSection][0].g + ',' + colorData.colors[newSection][0].b)+ ')';
    }
  } 

  //remove styles for the old section
  for(var i = 0; i < toolbarArray.length; i++) {
    if((toolbarArray[i].html()).toLowerCase() == previousSection) {
      var thePreviousOne = toolbarArray[i];
      thePreviousOne.style('background-color', 'white');
    }
  }
    previousSection = newSection;

  //fill array with new opinionBlocks for that section 
  rectArray = [];
  for (var i = 0; i < contentData.content[newSection].length; i++) {
    var x = random(150, width-175);
    var y = random(100, height-150);
    var colorArrayLength = colorData.colors[newSection].length;
    var theTitle = contentData.content[newSection][i].title;
    var theText = contentData.content[newSection][i].text;
    var theType = contentData.content[newSection][i].type;
    var r = colorData.colors[newSection][i%colorArrayLength].r;
    var g = colorData.colors[newSection][i%colorArrayLength].g;
    var b = colorData.colors[newSection][i%colorArrayLength].b;
    rectArray.push(new opinionBlock(x, y, theTitle, theText, theType, r, g, b, i));
  }
  //fill with opinionButton Objects
}

function resetAll () {
  for(var i = 0; i < rectArray.length; i++) {
    rectArray[i].currentState = 'reset';
  }
}

function fromResetTooReg () {
    for(var i = 0; i < rectArray.length; i++) {
    rectArray[i].currentState = 'regular';
  }
}

function startPage() {
  rectMode(CENTER);
  textSize(60);
  textFont(goudy);
  textAlign(CENTER);
  fill(0);
  text("Out There Mag", width/2, height/2);

  textSize(20);
  textFont(slateReg);
  textAlign(LEFT);
  text("These are the relevant, the helpful, the critical, the thoughtful, the serious, the angry, the ugly, the odd, the absurd, the ridiculous, the resentful, the unpopular, the out there love opinions. ", width/2, height/2 + 200, 350, 350);
}

//CHECK SECTIONS
function toolbarCheck() {
  for (var i = 0; i < toolbarArray.length; i++) {
   toolbarArray[i].mousePressed(sectionClicked);
  }
  resetButton.mousePressed(resetAll);
}

// OPINIONBLOCK CLASS
function opinionBlock(x, y, theTitle, theText, theType, r, g, b, i) {
  this.r = r; 
  this.g = g; 
  this.b = b;
  this.w;
  this.h;

  this.currentState = 'regular';
  this.x = x;
  this.y = y;
  this.ogX = x;
  this.ogY = y;

  this.theTitle = theTitle;
  this.theText = theText;
  this.theType = theType;

  this.removeX;
  this.removeY;
  this.removeW;
  this.removeH;

  this.expandX; 
  this.expandY;
  this.expandW; 
  this.expandH;

  this.minX;
  this.minY;
  this.minW; 
  this.minH;

  this.indexInArray = i;

  this.display = function(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.w, this.h);
  }

  this.dragged = function() {
      this.currentState = 'dragging';
  }

  this.draggingStopped = function() {
    if(this.currentState == 'dragging') {
      this.currentState = 'regular';
      aCurrentDrag = false;
      numDragged = 0;
    } 

    this.currentState = 'regular';
  }

  this.expand = function() {
    this.currentState = 'expanding';
  
  }

  this.hide = function() {
    this.currentState = 'hidden';
  }

  this.minimize = function() {
    this.currentState = 'regular';
  }

  this.removalButton = function(removeX, removeY) {
    this.removeX = removeX;
    this.removeY = removeY;
    this.removeW = 14;
    this.removeH = 14;

    textSize(14);
    textFont(monospaceBold);
    text("x", this.removeX, this.removeY);
  }

  this.expandButton = function(expandX, expandY) {
    this.expandX = expandX; 
    this.expandY = expandY;
    this.expandW = 14; 
    this.expandH = 14;
    image(expandImage, this.expandX, this.expandY, 10, 10);
  }

  this.minimizeButton = function(minX, minY) {
    this.minX = minX - 2;
    this.minY = minY - 5;
    this.minW = 14; 
    this.minH = 14;

    textSize(14);
    textFont(monospaceBold);
    text("_", this.minX, this.minY);
  }
}


function drawOpinionBlockStates (anOpinion) {
  switch(anOpinion.currentState) {
    case'regular':
      drawRegularOpinionBlocks(anOpinion, anOpinion.x, anOpinion.y);
      break;
    case 'dragging':
      drawRegularOpinionBlocks(anOpinion, mouseX, mouseY);
      break; 
    case 'expanded':
      drawExpandedOpinionBlocks(anOpinion);
      break;
    case 'hidden': 
      //display nothing
      break;
    case 'reset':
      drawRegularOpinionBlocks(anOpinion, anOpinion.ogX, anOpinion.ogY);
      //Do I need to change this back to regular?
      // fromResetTooReg();
      break;
    case 'expanding':
      moveForward(anOpinion, anOpinion.indexInArray);
      anOpinion.currentState = 'expanded'
      break;  
  }
}

function drawRegularOpinionBlocks(anOpinion, x, y) {
  var w;
  var h;
  var x; 
  var y;
  var theTextSize;
  var leadingSize;
  var spaceSize;
  var margin = 15;
  var splitStrings = [];
  var textX;
  var textY;
  var xOffset = 0;
  var yOffset = 0;
  var splitArray;

  if(anOpinion.theType == "post") {
    w = 250;
    textFont(monospaceBold);
    theTextSize = 12;
    leadingSize = 14;
    spaceSize = 5;
    textSize(theTextSize);
    textLeading(leadingSize);

    //CALCULATING THE HEIGHT OF THE RECT
    var titleH = calcHeight(anOpinion.theTitle, spaceSize, leadingSize, textSize, w, margin);
    rectMode(CENTER);

    var threeMoreLines = 3 * leadingSize;
    h = titleH + threeMoreLines;
    anOpinion.display(x, y, w, h);

    rectMode(CORNER);
    textX = (anOpinion.x - w/2) + margin;
    textY = (anOpinion.y - h/2) + margin;
    textW = w - (2 * margin);
    textH = anOpinion.h - (2 * margin);

    //SPLIT ARRAY
    splitArray = splitString(anOpinion.theTitle);
    var splitText = splitString(anOpinion.theText);
    fill(0);

    //DISPLAY TITLE    
    for(var j = 0; j < splitArray.length; j++) {
      var wordWidth = textWidth(splitArray[j]);
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }
      text(splitArray[j], (textX + xOffset), (textY + yOffset));
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }  
    }

    // DISPLAY TEXT
    textFont(slateReg);
    var bounds; 

    if(splitText.length >= 50) {
      bounds = 50;
    } else {
      bounds = splitText.length;
    }

    for(var j = 0; j < bounds; j++) {
      var wordWidth = textWidth(splitText[j]);
      if(j==0) {
        xOffset = 0;
        yOffset += leadingSize;
      }
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }
      if(yOffset < h - leadingSize) {
        text(splitText[j], (textX + xOffset), (textY + yOffset));
      }
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }
    }
  } 
  if (anOpinion.theType == "quote") {
    w = 350;
    textFont(goudy);
    theTextSize = 42;
    leadingSize = 46;
    spaceSize = 10;
    textSize(theTextSize);
    textLeading(leadingSize);

    //CALCULATING THE HEIGHT OF THE RECT
    var h = calcHeight(anOpinion.theTitle, spaceSize, leadingSize, textSize, w, margin);

    rectMode(CENTER);
    anOpinion.display(x, y, w, h);

    rectMode(CORNER);
    textX = (x - w/2) + margin;
    textY = (y - h/2) + (1.5 * margin) + leadingSize/2;

    //SPLIT ARRAY
    splitArray = splitString(anOpinion.theTitle);
    fill(0);
    
    for(var j = 0; j < splitArray.length; j++) {
      var wordWidth = textWidth(splitArray[j]);

      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }

      text(splitArray[j], (textX + xOffset), (textY + yOffset));

      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }  
    } 
  }

  if (anOpinion.theType == "article") {
    w = 300;
    textFont(slateBold);
    theTextSize = 24;
    leadingSize = 26;
    spaceSize = 6;
    textSize(theTextSize);
    textLeading(leadingSize);

  //CALCULATING THE HEIGHT OF THE RECT
    var h = calcHeight(anOpinion.theTitle, spaceSize, leadingSize, textSize, w, margin);

    rectMode(CENTER);
    anOpinion.display(x, y, w, h);

    rectMode(CORNER);

    textX = (x - w/2) + margin;
    textY = (y - h/2) + (1.5 * margin) + leadingSize/2;

    //SPLIT ARRAY
    splitArray = splitString(anOpinion.theTitle);
    fill(0);
    
    // TEXT DISPLAY
    for(var j = 0; j < splitArray.length; j++) {
      var wordWidth = textWidth(splitArray[j]);
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }
      text(splitArray[j], (textX + xOffset), (textY + yOffset));
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }  
    } 
  }
  
  var removeX = x + (anOpinion.w/2) - margin;
  var removeY = y - (anOpinion.h/2) + margin;
  var expandX = x + (anOpinion.w/2) - margin;
  var expandY = y + (anOpinion.h/2) - margin;
    
  anOpinion.removalButton(removeX, removeY);
  if(anOpinion.theType !== "quote") {
    anOpinion.expandButton(expandX, expandY); 
  }
}

function drawExpandedOpinionBlocks(anOpinion) {
  var w; 
  var h; 
  var x = innerWidth/2;
  var y = innerHeight/2;
  var margin = 15;
  var spaceSize;
  var theTextSize;
  var leadingSize;
  var xOffset = 0;
  var yOffset = 0;

  if(anOpinion.theType == "post") {
    // var titleHeight = calcHeight
    w = 250;
    
    theTextSize = 12;
    leadingSize = 14;
    spaceSize = 5;
    textSize(theTextSize);
    textLeading(leadingSize);
    
    textFont(monospaceBold);
    var titleHeight = calcHeight(anOpinion.theTitle, spaceSize, leadingSize, textSize, w, margin);
    textFont(slateReg);
    var textHeight = calcHeight(anOpinion.theText, spaceSize, leadingSize, textSize, w, margin);

    var maxHeight = canvasHeight * .8;

    h = titleHeight+textHeight;
    rectMode(CENTER);

    if (h >= maxHeight) {
      var area = w * h;
      var newWidth = area/maxHeight;
      w = newWidth;
      h = maxHeight;
      //calc width 
    }

    anOpinion.display(x, y, w, h);
    rectMode(CORNER);
    textX = (anOpinion.x - w/2) + margin;
    textY = (anOpinion.y - h/2) + margin;
    textW = w - (2 * margin);
    textH = anOpinion.h - (2 * margin);

    //SPLIT ARRAY
    splitArray = splitString(anOpinion.theTitle);
    var splitText = splitString(anOpinion.theText);
    fill(0);

    //DISPLAY TITLE   
     textFont(monospaceBold); 
    for(var j = 0; j < splitArray.length; j++) {
      var wordWidth = textWidth(splitArray[j]);
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }
      text(splitArray[j], (textX + xOffset), (textY + yOffset));
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }  
    }

    // DISPLAY TEXT
    textFont(slateReg);
    for(var j = 0; j < splitText.length; j++) {
      var wordWidth = textWidth(splitText[j]);
      if(j==0) {
        xOffset = 0;
        yOffset += leadingSize;
      }
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }
      if(yOffset < h - leadingSize) {
        text(splitText[j], (textX + xOffset), (textY + yOffset));
      }
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
      }
    }
  } 

  if(anOpinion.theType == "article") {
    resetButton.style('display', 'none');
    w = innerWidth * .9;
    h = innerHeight - 100;
    x =width/2;
    y = height/2;
    margin = 15;

    rectMode(CENTER);
    anOpinion.display(x, y, w, h);

    var columnmargin = 4;
    var columnWidths = (w - (5 * columnmargin))/5;

    var splitArray = splitString(anOpinion.theTitle);
    var splitText = splitString(anOpinion.theText);

    textFont(slateBold);
    theTextSize = 24;
    leadingSize = 26;
    spaceSize = 6;
    textSize(theTextSize);
    textLeading(leadingSize);
    fill(0);

    textX =  margin;
    textY = 2 * margin;

    rectMode(CORNER);
    // display title
    for(var j = 0; j < splitArray.length; j++) {
      var wordWidth = textWidth(splitArray[j]);

      if (xOffset >= (columnWidths - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }

      text(splitArray[j], (textX + xOffset), (textY + yOffset));
      if (xOffset >= (columnWidths - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      } else {
        xOffset += wordWidth + spaceSize;
    }
  }

    theTextSize = 11;
    leadingSize = 13;
    spaceSize = 4;
    textSize(theTextSize);
    textLeading(leadingSize);
    fill(0);
    textFont(slateReg);

    for(var j = 0; j < splitText.length; j++) {
      var wordWidth = textWidth(splitText[j]);
    
      if(j == 0) {
        yOffset += (leadingSize * 2);
        xOffset = 0;
      }
      
      if (xOffset >= (columnWidths - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }

      if(yOffset >= (h - wordWidth - (2* margin))) {
        textX += (columnWidths + columnmargin);
        yOffset = 0; 
        xOffset = 0;
      }
      
      if (splitText[j] == '\n') {
         yOffset +=  leadingSize; 
         xOffset = 8;
      }

      text(splitText[j], (textX + xOffset), (textY + yOffset));
      
      if (xOffset >= (columnWidths - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leadingSize; 
      }  
      if(splitText[j] != '\n') {
        xOffset += wordWidth + spaceSize;
      } 

      if(yOffset >= h - wordWidth - (2 * margin)) {
        textX += (columnWidths);
        yOffset = 0; 
        xOffset = 0;
      }
    }
  }
  rectMode(CENTER);
  var minX = x + (w/2) - margin;
  var minY = y - (h/2) + margin;

  anOpinion.minimizeButton(minX, minY);
}

//MOUSE DRAG
function mouseDragged() {
  var onesBeingDragged = []; 
  var nums = [];
  var aDrag;
  //check if the mouse is dragging something and figure out how many are being
  for (var i = 0; i < rectArray.length; i++) {
    var anOpinion = rectArray[i];
    if (abs(anOpinion.x - mouseX) < anOpinion.w/2 && abs(anOpinion.y - mouseY) < anOpinion.h/2 && anOpinion.currentState != 'expanded' && anOpinion.currentState != 'hidden') {
      if(aCurrentDrag == false || (aCurrentDrag == true && anOpinion.currentState == 'dragging')){
      aDrag = rectArray[i];
      onesBeingDragged.push(aDrag); 
      }
    }
  }  

  numDragged = onesBeingDragged.length;

  if(numDragged == 1) {
    aDrag.dragged();
  } else if (numDragged > 1) {
    for (var i = 0; i < onesBeingDragged.length; i++) {
      num = onesBeingDragged[i].indexInArray;
      nums.push(num);
    }  

      var mx = max(nums);
      rectArray[mx].dragged();
      aDrag =  rectArray[mx];
  }
  // console.log(aDrag);
  var theIndex = aDrag.indexInArray;
  moveForward(aDrag, theIndex);
}

function mouseClicked () {
  for (var i = 0; i < rectArray.length; i++) {
    var anOpinion = rectArray[i]; 
    //Remove button
    if(abs(anOpinion.removeX - mouseX) < anOpinion.removeW/2 && abs(anOpinion.removeY - mouseY) < anOpinion.removeH/2) {
      anOpinion.hide();
    }
    //Expand button
    if(abs(anOpinion.expandX - mouseX) < anOpinion.expandW/2 && abs(anOpinion.expandY - mouseY) < anOpinion.expandH/2) {
      anOpinion.expand();
    }
    //Minimize button
    if(abs(anOpinion.minX - mouseX) < anOpinion.minW/2 && abs(anOpinion.minY - mouseY) < anOpinion.minH/2) {
      anOpinion.minimize();
      resetButton.style('visibility', 'visibile');
    }
  }
}

//WINDOW RESIZE
function windowResized() {
  var canvasHeight = innerHeight - 100;
  resizeCanvas(innerWidth *.9 , canvasHeight);
}

function mouseReleased() {
  for (var i = 0; i < rectArray.length; i++) {
    if(rectArray[i].currentState == 'dragging') {
      rectArray[i].draggingStopped();
    }
    
  }  
}

function checkDrag() {
  for (var i = 0; i < rectArray.length; i++) {
    if(rectArray[i].currentState == 'dragging') {
      aCurrentDrag = true;
    } 
  } 
}

// figuring out how to calculate the height of the box and the idea to split the strings came from the last example in this code titled "text metrics" https://creative-coding.decontextualize.com/text-and-type/

function calcHeight(theText, spaceSize, leading, textSize, w, margin) {
    var xOffset;
    var yOffset;
    var splitArray;

    for(var i = 0; i < theText.length; i++) {
      var theOriginalString = theText;
      splitArray = split(theOriginalString, ' ');  
      xOffset = 0;
      yOffset = 0;
    }  

    for(var j = 0; j < splitArray.length; j++) {
      rectMode(CORNER);
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leading; 
      } 
      var wordWidth = textWidth(splitArray[j]);
      if (xOffset >= (w - wordWidth - (2 * margin))) {
        xOffset = 0;
        yOffset += leading; 
      } else {
        xOffset += wordWidth + spaceSize;
      }
    }  
    var numLines = (yOffset/leading) + 1;
    if(leading > 20) {
    }
    
    var h = (numLines * leading) + (margin * 2.5);
    return h;  
}

function splitString(theText) {
  var splitArray; 

  for(var i = 0; i < theText.length; i++) {
    var theOriginalString = theText;
    splitArray = split(theOriginalString, ' ');
  }

  return splitArray;  
}

function reassignIndexNumbers() {
  for (var i = 0; i < rectArray.length; i++) {
    rectArray[i].indexInArray = i;
  }
}

function moveForward (anOpinion, index) {
  rectArray.splice(index, 1);
  rectArray.push(anOpinion); 
  reassignIndexNumbers();
}


//tight iteninerary, complicated, logisitical
//something carter and I had been 
//maybe we could go on a family vacation, cus patrick said he wouldnt mind going 


