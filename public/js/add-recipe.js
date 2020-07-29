var ingredientView = document.querySelectorAll(".ing-input");
var addIng = document.querySelector(".add-ing");
var ings = 0;

addIng.addEventListener("click", function() {
    console.log("clicked");
    ings += 5;
    if(ings === 100) {
        addIng.style.display = 'none';
    }
    for(var i=0; i<ings; i++) {
        ingredientView[i].style.display = 'block';
    }
});