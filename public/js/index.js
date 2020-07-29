var imageSliderContainer = document.querySelectorAll(".auto-image-slider__item");

console.log(imageSliderContainer);

var slideIndex = 0;
var timeout;
imageSlider();

function imageSlider() {
    if(slideIndex == imageSliderContainer.length) {
        slideIndex = 0;
    }
    if(slideIndex < 0) {
        slideIndex = imageSliderContainer.length - 1;
    }
    for(var i=0; i<imageSliderContainer.length; i++) {
        imageSliderContainer[i].style.display = 'none';
    }
    imageSliderContainer[slideIndex].style.display = 'block';
    slideIndex++;
    // console.log(Date.now());
    timeout = setTimeout(imageSlider, 3000);
}

function sliderIndexDec() {
    slideIndex -= 2;
    clearTimeout(timeout);
    imageSlider();
}

function sliderIndexInc() {
    clearTimeout(timeout);
    imageSlider();
}

