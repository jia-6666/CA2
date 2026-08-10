document.querySelectorAll(".card1").forEach(card => {

    const button = card.querySelector(".show-more");

    if (!button) return;

    button.addEventListener("click", () => {

        card.classList.toggle("show");

        if (card.classList.contains("show")) {
            button.textContent = "Show Less";
        } else {
            button.textContent = "Show More";
        }

    });

});