document.addEventListener("DOMContentLoaded", function() {
    var preloader = document.querySelector(".preloader");
    var content = document.querySelector(".content");

    if (preloader) { // Verificar si se encontraron los elementos
        setTimeout(function() {
            preloader.classList.add("fadeOut");
            setTimeout(function() {
                preloader.style.display = "none";
            }, 500);
        }, 2000);
    } else {
        console.error("No se encontraron elementos con las clases '.preloader' o '.content'.");
    }
});
