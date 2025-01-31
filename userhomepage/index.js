import { userID } from "../managementjavascript/fetchanddisplay.js";


const firstcategory = document.getElementById("firstcategory");
const secondcategory = document.getElementById("secondcategory");
const thirdcategory = document.getElementById("thirdcategory");

const userId = userID();
// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function() {

  const nikeitem = document.getElementById('btnNike');
  const adidasitem = document.getElementById('btnAdidas');
  const pumaitem = document.getElementById('btnPuma');
  const  productbutton = document.getElementById('productbutton');
  const shopbutton = document.getElementById('shopbutton');
  const aboutbutton = document.getElementById('aboutbutton');
  nikeitem.href = `product-detail.html?Userid=${userID()}&Itemid=1`;
  adidasitem.href = `product-detail.html?Userid=${userID()}&Itemid=13`;
  pumaitem.href = `product-detail.html?Userid=${userID()}&Itemid=18`;
  productbutton.href = `Products.html?Userid=${userID()}&Page=1&Filter=1&Brand=Default`;
  shopbutton.href = `Products.html?Userid=${userID()}&Page=1&Filter=1&Brand=Default`;
  aboutbutton.href = `about.html?Userid=${userID()}`;


  firstcategory.onclick =function(){window.location.assign(`./Products.html?Userid=${userId}&Page=1&Filter=1&Brand=${firstcategory.alt}`)};
  secondcategory.onclick = function(){window.location.assign(`./Products.html?Userid=${userId}&Page=1&Filter=1&Brand=${secondcategory.alt}`)};
  thirdcategory.onclick = function(){window.location.assign(`./Products.html?Userid=${userId}&Page=1&Filter=1&Brand=${thirdcategory.alt}`)};

  // Initialize the slide index to start at the first slide
  let slideIndex = 0;

  // Call the showSlides function to display the first slide when the page loads
  showSlides(slideIndex);

  // Function to handle the display of slides
  function showSlides() {
    // Get all elements with the class 'mySlides' (i.e., the slides)
    let slides = document.getElementsByClassName("mySlides");

    // Hide all slides initially by setting their display to "none"
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    // Increment the slideIndex to show the next slide
    slideIndex++;

    // If slideIndex exceeds the number of slides, reset it back to 1 to loop through the slides
    if (slideIndex > slides.length) { slideIndex = 1; }

    // Show the current slide by setting its display to "block"
    slides[slideIndex - 1].style.display = "block";

    // Set a timeout to automatically change the slide every 5 seconds
    setTimeout(showSlides, 5000); // 5000 milliseconds = 5 seconds
  }

  // Function to show a specific slide when a dot is clicked
  function currentSlide(n) {
    // Get all slides and dots
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");

    // Hide all slides first
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }

    // Remove the "active" class from all dots
    for (let i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }

    // Display the selected slide and add the "active" class to the corresponding dot
    slides[n - 1].style.display = "block";
    dots[n - 1].className += " active";

    // Update the slideIndex to reflect the selected slide
    slideIndex = n;
  }

  // Add click event listeners to each dot to allow manual navigation between slides
  let dots = document.getElementsByClassName("dot");
  for (let i = 0; i < dots.length; i++) {
    dots[i].addEventListener("click", function() {
      // When a dot is clicked, call currentSlide with the index of the clicked dot
      currentSlide(i + 1);
    });
  }
});
let slideIndex = 0;
const slideImages = document.querySelectorAll('.slide-image');
const heroDots = document.querySelectorAll('.hero-dot');

function changeSlide(index) {
  slideIndex = index;
  slideImages.forEach((image, idx) => {
    image.style.display = idx === slideIndex ? 'block' : 'none';
  });
  updateDots();
}

function updateDots() {
  heroDots.forEach((dot, index) => {
    dot.classList.toggle('active-dot', index === slideIndex);
  });
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    changeSlide(index);
  });
});

setInterval(() => {
  slideIndex = (slideIndex + 1) % slideImages.length;
  changeSlide(slideIndex);
}, 6000); // Change slide every 6 seconds 