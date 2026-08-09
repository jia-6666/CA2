const imagesM = [
    "./assets/images/Cycle-Images/About/Why/Why1.jpg",//https://p1922644.neocities.org/foodcourt6
    "./assets/images/Cycle-Images/About/Why/Why2.jpg",//https://eatbook.sg/singapore-polytechnic-food/#10_Creamy_Duck
    "./assets/images/Cycle-Images/About/Why/Why3.jpg"//
];

const cardM = document.querySelector(".leftbottom");

let currentImageM = 0;

function changeImageM() {
    cardM.style.backgroundImage = `url('${imagesM[currentImageM]}')`;
    currentImageM = (currentImageM + 1) % imagesM.length;
}

changeImageM();

setInterval(changeImageM, 5000);