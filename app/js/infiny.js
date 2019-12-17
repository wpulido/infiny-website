// Navigation function

function openNav() {
  document.getElementById("open").style.display = "visible";
  document.getElementById("navEffects").style.left = "0px";
}

function closeNav() {
  document.getElementById("close").style.display = "visible";
  document.getElementById("navEffects").style.left = "-2000px";
}

// Year function

document.getElementById("year").innerHTML = new Date().getFullYear();
