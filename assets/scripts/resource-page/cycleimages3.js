const images3 = [
    "./assets/images/Resources/Hilltop/Hilltop1.jpg",
    "./assets/images/Resources/Hilltop/Hilltop2.jpg",
    "./assets/images/Resources/Hilltop/Hilltop3.jpg"
];

const card3 = document.querySelector(".leftbottom");

let currentImage3 = 0;

function changeImage3() {
    card3.style.backgroundImage = `url('${images3[currentImage3]}')`;
    currentImage3 = (currentImage3 + 1) % images3.length;
}

changeImage3();

setInterval(changeImage3, 5000);