const images2 = [
    "./assets/images/Resources/Printer/Printer1.jpg",//https://www.flickr.com/photos/101847963@N06/9755809595/in/album-72157635530104562
    "./assets/images/Resources/Printer/Printer2.jpg",//https://www.magnific.com/premium-ai-image/photo-largeformat-plotter-printer-with-color-ribbons-representing-highquality-printing_273872584.htm#fromView=search&page=1&position=5&uuid=21b71b64-4e84-4ab2-858a-1c0758c7edcf&track=ais_hybrid&query=Printers+background
    "./assets/images/Resources/Printer/Printer3.jpg"//https://www.magnific.com/premium-ai-image/photographic-image-real-printer-plain-white-background-ar-34-style-raw-job-id-2586b26a8278402e94a3cd1209775ed3_279811718.htm#fromView=search&page=1&position=6&uuid=2ee3cf10-1ad2-4976-bb11-e8997ccf3d7d&track=ais_hybrid&query=Printers+background
]

const card2 = document.querySelector(".right");

let currentImage2 = 0;

function changeImage2() {
    card2.style.backgroundImage = `url('${images2[currentImage2]}')`;
    currentImage2 = (currentImage2 + 1) % images2.length;
}

changeImage2();

setInterval(changeImage2, 5000);