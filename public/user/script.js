const menuToggle = document.getElementById("menu-toggle");
const navRight = document.getElementById("nav-right");

menuToggle.addEventListener("click", () => {
  navRight.classList.toggle("show");
});
const slider=document.querySelector(".brands-container");

document.querySelector(".next").onclick=()=>{

slider.scrollBy({
left:250,
behavior:"smooth"
});

}

document.querySelector(".prev").onclick=()=>{

slider.scrollBy({
left:-250,
behavior:"smooth"
});

}

/* Mouse Drag */

let isDown=false;
let startX;
let scrollLeft;

slider.addEventListener("mousedown",(e)=>{

isDown=true;
startX=e.pageX-slider.offsetLeft;
scrollLeft=slider.scrollLeft;

});

slider.addEventListener("mouseleave",()=>{

isDown=false;

});

slider.addEventListener("mouseup",()=>{

isDown=false;

});

slider.addEventListener("mousemove",(e)=>{

if(!isDown) return;

e.preventDefault();

const x=e.pageX-slider.offsetLeft;

const walk=(x-startX)*2;

slider.scrollLeft=scrollLeft-walk;

});
