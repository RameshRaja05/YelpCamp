const paginate = document.querySelector("#paginate");
const campgroundContainer = document.querySelector("#campgrounds-container");

paginate.addEventListener("click", async function (e) {
  e.preventDefault();
  const res = await fetch(this.href);
  const data = await res.json();
  for (let campground of data.docs) {
    const template = generateCampground(campground);
    campgroundContainer.insertAdjacentHTML("beforeend", template);
  }
  const { nextPage } = data;
  if (nextPage) {
    this.href = this.href.replace(/page=\d+/, `page=${nextPage}`);
  } else {
    //if we got an end of the page we can remove the paginate button
    this.classList.add("disabled");
  }
  campgrounds.features.push(...data.docs);
  map.getSource("campgrounds").setData(campgrounds);
});

const generateCampground = (campground) => {
  const template = `<div class="card mb-3 mt-2">
    <div class="row">
        <div class="col-md-4">
            <img src="${
              campground.images.length
                ? campground.images[0].url
                : "https://res.cloudinary.com/dwed6vcds/image/upload/v1679825043/YelpCamp/esf2xdqcce4jl1vp8dlp.jpg"
            }" alt="" class="img-fluid">
        </div>
        <div class="col-md-8">
            <div class="card-body">
                <h5 class="card-title">
                    ${campground.title}
                </h5>
                <p class="card-text">
                    ${campground.description.substr(0, 150)}
                </p>
                <p class="card-text">
                    <small class="text-muted">
                        ${campground.location}
                    </small>
                </p>
                <a href="/campgrounds/${
                  campground._id
                }" class="btn btn-primary">view</a>
            </div>
        </div>
    
    </div>
    </div>`;
  return template;
};
