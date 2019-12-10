// Navigation function

function openNav() {
  document.getElementById("open").style.display = "none";
  document.getElementById("navEffects").style.width = "100%";
}

function closeNav() {
  document.getElementById("close").style.display = "visible";
  document.getElementById("navEffects").style.width = "0%";
}

// Year function

document.getElementById("year").innerHTML = new Date().getFullYear();
