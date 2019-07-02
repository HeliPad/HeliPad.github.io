var dragging = false;
var dragEle
var dragOffset = {x:0, y:0}

var gridSize = 20;
var imageSize = 20;
var vertices = []
var vLabels = []
var gridContainer
var lineContainer
var vertexContainer
var vLabelContainer

function snapPoint(x, y) {
   var frameSize = document.getElementById("frame").getAttribute("width");
   var frameToImage = imageSize / frameSize;

   var newX = Math.round(x * frameToImage) * (1 / frameToImage);
   var newY = Math.round(y * frameToImage) * (1 / frameToImage);

   return [newX, newY];
}

function startDrag(e) {
   dragging = true;
   dragEle = e;
}

function stopDrag() {
   dragging = false;
}

function updateVertexConnections() {
   // Remove old connections
   while (lineContainer.firstChild)
      lineContainer.removeChild(lineContainer.firstChild);

   for (var i = 1; i < vertices.length; i++) {
      var line = document.createElementNS(document.getElementById("frame").namespaceURI, 'line')
      line.setAttribute("x1", vertices[i-1].getAttribute("cx"));
      line.setAttribute("y1", vertices[i-1].getAttribute("cy"));
      line.setAttribute("x2", vertices[i].getAttribute("cx"));
      line.setAttribute("y2", vertices[i].getAttribute("cy"));
      line.setAttribute("style", "stroke:rgb(50, 50, 50);stroke-width:4");
      lineContainer.appendChild(line);
   }
}

function updateVLabels() {
   for (var i = 0; i < vLabels.length; i++) {
      vLabels[i].innerHTML = i;
   }
}

function addVertex() {
   var frameSize = document.getElementById("frame").getAttribute("width");

   var hX = frameSize * 0.5;
   var hY = frameSize * 0.5;
   var snapped = snapPoint(hX, hY);
   hX = snapped[0];
   hY = snapped[1];

   var vertex = document.createElementNS(document.getElementById("frame").namespaceURI, 'circle');
   vertex.setAttribute("onmousedown", "startDrag(this)");
   vertex.setAttribute("onmouseup", "startDrag(this)");
   vertex.setAttribute("cx", hX);
   vertex.setAttribute("cy", hY);
   vertex.setAttribute("r", 5);
   vertex.setAttribute("stroke", "black");
   vertex.setAttribute("stroke-width", 2);
   vertex.setAttribute("fill", "orange");

   var label = document.createElementNS(document.getElementById("frame").namespaceURI, 'text');
   label.setAttribute("x", hX - 15);
   label.setAttribute("y", hY - 10);
   label.setAttribute("font-family", "Arial Black");
   label.setAttribute("font-size", "20px");
   label.setAttribute("fill", "blue");

   var text = document.createTextNode(vertices.length);
   label.appendChild(text);

   vertices[vertices.length] = vertex;
   vertexContainer.appendChild(vertex);

   vLabels[vLabels.length] = label;
   vLabelContainer.appendChild(label);

   updateVertexConnections();
}

function removeVertex() {
   var i = document.getElementById("removeIndex").value;
   var removedVert = vertices.splice(i, 1)[0];
   var removedLabel = vLabels.splice(i, 1)[0];

   vertexContainer.removeChild(removedVert);
   vLabelContainer.removeChild(removedLabel);

   updateVertexConnections();
   updateVLabels();
}

document.addEventListener("mousemove", function(event) {
   if (dragging)
   {
      var rect = document.getElementById("drawing").getBoundingClientRect();
      var oldCX = dragEle.getAttribute("cx");
      var oldCY = dragEle.getAttribute("cy");
      var nCX = event.clientX - rect.left
      var nCY = event.clientY - rect.top;

      var newPoint = snapPoint(nCX, nCY);
      nCX = Math.max(Math.min(newPoint[0], rect.width), 0);
      nCY = Math.max(Math.min(newPoint[1], rect.height), 0);

      dragEle.setAttribute("cx", nCX);
      dragEle.setAttribute("cy", nCY);

      for (var i = 0; i < vertices.length; i++) {
         if (vertices[i] == dragEle) {
            vLabels[i].setAttribute("x", vertices[i].getAttribute("cx") - 15);
            vLabels[i].setAttribute("y", vertices[i].getAttribute("cy") - 10);
            break;
         }
      }

      if (oldCX != nCX || oldCY != nCY)
         updateVertexConnections();
   }
});

function updateGrid() {
   // Delete all grid lines
   while (gridContainer.firstChild)
      gridContainer.removeChild(gridContainer.firstChild);

   var frameSize = document.getElementById("frame").getAttribute("width");
   var step = frameSize / gridSize;

   // Vertical lines
   for (var x = 1; x < gridSize; x++) {
      var line = document.createElementNS(document.getElementById("frame").namespaceURI, 'line')
      line.setAttribute("x1", x * step);
      line.setAttribute("y1", 0);
      line.setAttribute("x2", x * step);
      line.setAttribute("y2", frameSize);
      line.setAttribute("style", "stroke:rgb(150, 150, 150);stroke-width:2");
      gridContainer.appendChild(line);
   }

   // Horizontal lines
   for (var y = 1; y < gridSize; y++) {
      var line = document.createElementNS(document.getElementById("frame").namespaceURI, 'line')
      line.setAttribute("x1", 0);
      line.setAttribute("y1", y * step);
      line.setAttribute("x2", frameSize);
      line.setAttribute("y2", y * step);
      line.setAttribute("style", "stroke:rgb(150, 150, 150);stroke-width:2");
      gridContainer.appendChild(line);
   }
}

String.prototype.replaceAll = function(search, replacement) {
   var target = this;
   return target.split(search).join(replacement);
};

function arrToCPPArrayString(arr) {
    var str = JSON.stringify(arr);
    str = str.replaceAll("[", "{");
    str = str.replaceAll("]", "}");
    return str;
}

function exportVertices() {
   var frameSize = document.getElementById("frame").getAttribute("width");
   var vertArr = [];

   for (var i = 0; i < vertices.length; i++) {
      // Scale coordinates to image size
      var x = vertices[i].getAttribute("cx") / frameSize * imageSize - imageSize*0.5;
      // Must be reversed so y = 0 is at the bottom instead of top
      var y = (frameSize - vertices[i].getAttribute("cy")) / frameSize * imageSize - imageSize*0.5;
      vertArr[i] = [x, y];
   }

   document.getElementById("codeArea").innerText = arrToCPPArrayString(vertArr);
}

function importVertices() {
   var str = document.getElementById("codeArea").innerHTML;
   str = str.replaceAll("{", "[");
   str = str.replaceAll("}", "]");
   var vertArr = JSON.parse(str);

   
}

function init() {
   gridContainer = document.getElementById("grid");
   lineContainer = document.getElementById("lines");
   vertexContainer = document.getElementById("vertices");
   vLabelContainer = document.getElementById("vLabels");

   updateGrid();
   addVertex();
   addVertex();
}


document.addEventListener("mouseup", function(event) {
   dragging = false;
});

// Prevent text highlighting while dragging vertices
window.addEventListener('mousedown', (e) => {
   if (dragging)
      e.preventDefault();
 })

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