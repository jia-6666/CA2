const imagesM = [
    "./assets/images/Cycle-Images/About/MVPS/MVP1.jpg",//https://www.facebook.com/sgministryofmanpower/photos/mr-soh-wai-wah-is-the-principal-and-ceo-of-sphe-believes-this-tie-up-with-agilen/1137275112988421/
    "./assets/images/Cycle-Images/About/MVPS/MVP2.jpg",//
    "./assets/images/Cycle-Images/About/MVPS/MVP3.jpg"//
];

const cardM = document.querySelector(".mvp");

let currentImageM = 0;

function changeImageM() {
    cardM.style.backgroundImage = `url('${imagesM[currentImageM]}')`;
    currentImageM = (currentImageM + 1) % imagesM.length;
}

changeImageM();

setInterval(changeImageM, 5000);