const $toggle = document.querySelector('.toggle');
const $topmain = document.querySelector('.topmain');
const $navigation = document.querySelector('.navigation');

$toggle.addEventListener('click', () => {
    $navigation.classList.toggle('active');
    $topmain.classList.toggle('active');
})

window.addEventListener('hashchange', () => router(window.location.hash));

(function () {
    console.log(window.location.hash)
    router(window.location.hash);

})();
