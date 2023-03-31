const reviewForm = document.querySelector(".reviewForm");
const defaultStarInput = document.querySelector("input[name='review[rating]']");
const statusContainer = document.querySelector("#status");
if (reviewForm) {
    reviewForm.addEventListener("submit", function (e) {
        if (defaultStarInput.checked) {
            statusContainer.classList.remove("d-none");
            e.preventDefault();
        } else {
            statusContainer.classList.add("d-none");
        }
    })
}