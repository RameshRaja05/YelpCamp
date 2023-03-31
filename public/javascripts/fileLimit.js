const form = document.querySelector('.fileLimit');
const fileInput = document.querySelector('input[type="file"]')
const notify = document.querySelector('.notify')

form.addEventListener("submit", function (e) {
    if (fileInput.files.length > 7) {
        e.preventDefault();
        notify.classList.remove('d-none')
        console.log("You have Uploaded more then 7 images");
    } else {
        notify.classList.add('d-none');
    }
});


// <% campground.images.forEach((img,i)=>{ %>
//     <img src="<%= img.thumbnail %>" alt="" class="img-thumbnail">
//     <div class="form-check-inline">
//       <input type="checkbox" name="deleteImages[]" id="image<%= i %>" value="<%= img.filename %>">
//     </div>
//     <label for="image<%= i %>">Delete?</label>
//     <% }) %>