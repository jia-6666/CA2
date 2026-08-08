const images = [
    "./assets/images/Resources/Hilltop.jpg",
    "./assets/images/Resources/Hilltop1.jpg",
    "./assets/images/Resources/Hilltop2.jpg"
];

const card = document.querySelector(".lefttop");

let currentImage = 0;

function changeImage() {
    card.style.backgroundImage = `url('${images[currentImage]}')`;
    currentImage = (currentImage + 1) % images.length;
}

changeImage();

setInterval(changeImage, 3000);