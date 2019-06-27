function counter(i, target) {
   setTimeout(function() {
      document.getElementById("text").innerHTML = i;
      if (i < target)
         counter(i + 1, target);
   }, 1000);
}
var dragging = false;
var dragEle

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

document.addEventListener("mousemove", function(event) {
   if (dragging)
   {
      var rect = document.getElementById("drawing").getBoundingClientRect();
      dragEle.setAttribute("cx", event.clientX - rect.left);
      dragEle.setAttribute("cy", event.clientY - rect.top);
      console.log(event.clientX, event.clientY);
   }
});

document.addEventListener("mouseup", function(event) {
   dragging = false;
});

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