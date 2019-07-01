function counter(i, target) {
   setTimeout(function() {
      document.getElementById("text").innerHTML = i;
      if (i < target)
         counter(i + 1, target);
   }, 1000);
}
var dragging = false;
var dragEle
var dragOffset = {x:0, y:0}

var gridSize = 20;
var imageSize = 20;


function test(e) {
   //document.getElementById("circle").setAttribute("fill", "red");
   e.setAttribute("fill", "red");
}

function startDrag(e) {
   dragging = true;
   dragEle = e;
}

function stopDrag() {
   dragging = false;
}

function snapPoint(x, y) {
   var frameSize = document.getElementById("frame").getAttribute("width");
   var frameToImage = imageSize / frameSize;
   var newX = Math.round(x * frameToImage) * (1 / frameToImage);
   var newY = Math.round(y * frameToImage) * (1 / frameToImage);
   return [newX, newY];
}

document.addEventListener("mousemove", function(event) {
   if (dragging)
   {
      var rect = document.getElementById("drawing").getBoundingClientRect();
      var nCX = event.clientX - rect.left
      var nCY = event.clientY - rect.top;
      var newPoint = snapPoint(nCX, nCY);
      nCX = Math.max(Math.min(newPoint[0], rect.width), 0);
      nCY = Math.max(Math.min(newPoint[1], rect.height), 0);
      console.log(nCY, rect.height);
      dragEle.setAttribute("cx", nCX);
      dragEle.setAttribute("cy", nCY);
   }
});

function updateGrid() {
   // Delete all grid lines
   var grid = document.getElementById("grid");
   while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
   }

   var frameSize = document.getElementById("frame").getAttribute("width");
   var step = frameSize / gridSize;

   // Vertical lines
   for (var x = 1; x < gridSize; x++) {
      var line = document.createElementNS(document.getElementById("frame").namespaceURI, 'line')
      line.setAttribute("x1", x * step);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", x * step);
      line.setAttribute("y2", frameSize);
      line.setAttribute("style", "stroke:rgb(150,150,150);stroke-width:2");
      grid.appendChild(line);
      console.log(x);
   }

   // Horizontal lines
   for (var y = 1; y < gridSize; y++) {
      var line = document.createElementNS(document.getElementById("frame").namespaceURI, 'line')
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y * step);
      line.setAttribute("x2", frameSize);
      line.setAttribute("y2", y * step);
      line.setAttribute("style", "stroke:rgb(150,150,150);stroke-width:2");
      grid.appendChild(line);
      console.log(x);
   }
}

function init() {
   counter(0, 10);
   updateGrid()
}


document.addEventListener("mouseup", function(event) {
   dragging = false;
});

// make the system use numbered nodes and it will automatically connect them in numerical order

/* window.addEventListener('mousedown', (e) => {
   // Let's pick a random color between #000000 and #FFFFFF
   const color = Math.round(Math.random() * 0xFFFFFF)
 
   // Let's format the color to fit CSS requirements
   const fill = '#' + color.toString(16).padStart(6,'0')
 
   // Let's apply our color in the
   // element we actually clicked on
   e.target.style.fill = fill
 })

window.addEventListener('mouseup', (e) => {
   // Let's pick a random color between #000000 and #FFFFFF
   const color = Math.round(Math.random() * 0xFFFFFF)
 
   // Let's format the color to fit CSS requirements
   const fill = '#' + color.toString(16).padStart(6,'0')
 
   // Let's apply our color in the
   // element we actually clicked on
   e.target.style.fill = fill
 })*/