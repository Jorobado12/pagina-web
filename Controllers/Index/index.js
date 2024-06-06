$(document).ready(function() {
    var lastScrollTop = 0;
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        if (scrollTop > lastScrollTop) {
            // Scrolling down
            $('.header').css('top', '-100px'); // Adjust this value as needed
        } else {
            // Scrolling up
            $('.header').css('top', '0');
        }
        lastScrollTop = scrollTop;
    });
});