const imagesG = [
    "./assets/images/Cycle-Images/About/Goals/Goals1.jpg", //https://www.sp.edu.sg/courses/schools/soc
    "./assets/images/Cycle-Images/About/Goals/Goals2.jpg"//https://www.sp.edu.sg/courses/schools/soc=        
]

const cardG = document.querySelector(".goals");

let currentImageG = 0;

function changeImageG() {
    cardG.style.backgroundImage = `url('${imagesG[currentImageG]}')`;
    currentImageG = (currentImageG + 1) % imagesG.length;
}

changeImageG();

setInterval(changeImageG, 5000);