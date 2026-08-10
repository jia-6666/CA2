const images3 = [
    "./assets/images/Cycle-Images/Resources/Food/Food1.jpg",//https://p1922644.neocities.org/foodcourt6
    "./assets/images/Cycle-Images/Resources/Food/Food2.jpg",//https://eatbook.sg/singapore-polytechnic-food/#10_Creamy_Duck
    "./assets/images/Cycle-Images/Resources/Food/Food3.jpg"//https://www.foodadvisor.com.sg/restaurant/singapore-polytechnic-food-court-6/
];

const card3 = document.querySelector(".leftbottom");

let currentImage3 = 0;

function changeImage3() {
    card3.style.backgroundImage = `url('${images3[currentImage3]}')`;
    currentImage3 = (currentImage3 + 1) % images3.length;
}

changeImage3();

setInterval(changeImage3, 5000);