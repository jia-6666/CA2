const images = [
    "./assets/images/Cycle-Images/Resources/Hilltop/Hilltop1.jpg",//https://www.facebook.com/spmediacomm/posts/next-well-look-at-hilltop-haven-which-is-located-on-the-second-floor-above-the-h/494589010659303/
    "./assets/images/Cycle-Images/Resources/Hilltop/Hilltop2.jpg",//https://www.facebook.com/spmediacomm/posts/next-well-look-at-hilltop-haven-which-is-located-on-the-second-floor-above-the-h/494589010659303/
    "./assets/images/Cycle-Images/Resources/Hilltop/Hilltop3.jpg",//https://www.hongjun.sg/2010/02/
    "./assets/images/Cycle-Images/Resources/Hilltop/Hilltop4.jpg"//https://www.hongjun.sg/2010/02/
];

const card = document.querySelector(".lefttop");

let currentImage = 0;

function changeImage() {
    card.style.backgroundImage = `url('${images[currentImage]}')`;
    currentImage = (currentImage + 1) % images.length;
}

changeImage();

setInterval(changeImage, 5000);