  /*
  const inputs = document.querySelectorAll(".input-field");
  const toggle_btn = document.querySelectorAll(".toggle");
  const main = document.querySelector("main");
  const bullets = document.querySelectorAll(".bullets span");
  const images = document.querySelectorAll(".image");
  
  inputs.forEach(inp => {
      inp.addEventListener("focus", () => {
          inp.classList.add("active");
      });
  
      inp.addEventListener("blur", () => {
          if (inp.value != "") return;
          inp.classList.remove("active");
      });
  });
  
  toggle_btn.forEach(btn => {
      btn.addEventListener("click", () => {
          main.classList.toggle("sign-up-mode");
      });
  });
  
  function moveSlider() {
      let index = this.dataset.value;
      let currentImage = document.querySelector(`.img-${index}`);
      images.forEach((img) => img.classList.remove("show"));
      currentImage.classList.add("show");
    
      const textSlider = document.querySelector(".text-group");
      textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
    
      bullets.forEach((bull) => bull.classList.remove("active"));
      this.classList.add("active");
  }
  
  bullets.forEach((bullet) => {
      bullet.addEventListener("click", moveSlider);
  });
  
  let currentIndex = 0;
  function showImage(index) {
      images.forEach(img => img.classList.remove("show"));
      bullets.forEach(bull => bull.classList.remove("active"));
    
      images[index].classList.add("show");
      bullets[index].classList.add("active");
      const textSlider = document.querySelector(".text-group");
      textSlider.style.transform = `translateY(${-(index) * 2.2}rem)`;
  }
  
  function nextImage() {
      currentIndex = (currentIndex + 1) % images.length;
      showImage(currentIndex);
  }
  
  let slideshowInterval = setInterval(nextImage, 5000);
  
  bullets.forEach((bullet, index) => {
      bullet.addEventListener("click", () => {
          currentIndex = index;
          clearInterval(slideshowInterval);
          showImage(currentIndex);
          slideshowInterval = setInterval(nextImage, 5000);
      });
  });
  
  


  let colorIndex = 0;
  const colors = ["#ff8c6b", "#ffe0d2", "#c4f3d4", "#f9cb9c"]; // Add more colors if needed
  
  setInterval(() => {
      carousel.style.backgroundColor = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
  }, 8000);
  

  */


  const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const carousel = document.querySelector(".carousel");

inputs.forEach(inp => {
    inp.addEventListener("focus", () => {
        inp.classList.add("active");
    });

    inp.addEventListener("blur", () => {
        if (inp.value != "") return;
        inp.classList.remove("active");
    });
});

toggle_btn.forEach(btn => {
    btn.addEventListener("click", () => {
        main.classList.toggle("sign-up-mode");
    });
});

function moveSlider() {
    let index = this.dataset.value;
    let currentImage = document.querySelector(`.img-${index}`);
    images.forEach((img) => img.classList.remove("show"));
    currentImage.classList.add("show");
  
    const textSlider = document.querySelector(".text-group");
    textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;
  
    bullets.forEach((bull) => bull.classList.remove("active"));
    this.classList.add("active");
}

bullets.forEach((bullet) => {
    bullet.addEventListener("click", moveSlider);
});

let currentIndex = 0;
function showImage(index) {
    images.forEach(img => img.classList.remove("show"));
    bullets.forEach(bull => bull.classList.remove("active"));
  
    images[index].classList.add("show");
    bullets[index].classList.add("active");
    const textSlider = document.querySelector(".text-group");
    textSlider.style.transform = `translateY(${-(index) * 2.2}rem)`;
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

let slideshowInterval = setInterval(nextImage, 8000);

bullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => {
        currentIndex = index;
        clearInterval(slideshowInterval);
        showImage(currentIndex);
        slideshowInterval = setInterval(nextImage, 8000);
    });
});




// Color change 
let colorIndex = 0;
const colors = ["#ebf70a","#f9cb9c","#dc9d1e","#9ACD32"]; // Add color 

setInterval(() => {
    carousel.style.backgroundColor = colors[colorIndex];
    colorIndex = (colorIndex + 1) % colors.length;
}, 10000);

