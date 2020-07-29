var toggleButton = document.querySelector(".toggle-button");
var mobileNav = document.querySelector(".mobile-nav");
var backdrop = document.querySelector(".backdrop");
var profileViewer = document.querySelector(".profile-view");

toggleButton.addEventListener("click", function() {
    console.log("Clicked!")
    mobileNav.style.display = 'block';
    backdrop.style.display = 'block';
});

backdrop.addEventListener("click", function() {
    mobileNav.style.display = 'none';
    backdrop.style.display = 'none';
    profileViewer.style.display = 'none';
});

function profileView() {
    profileViewer.style.display = 'block';
    backdrop.style.display = 'block';
}


