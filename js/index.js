const $toggle = document.querySelector('.toggle');
const $topmain = document.querySelector('.topmain');
const $navigation = document.querySelector('.navigation');
const $modal__loader = document.querySelector('.modal__loader');

const $modal = document.querySelector('.modal');
const $modal__content = document.querySelector('.modal__content');
const $modalHead = document.getElementById('modalHead');
const $modalBody = document.getElementById('modalBody');
const $lblModalTitle = document.getElementById('lblModalTitle')
const $btnModalClose = document.getElementById('btnModalClose');

$btnModalClose.addEventListener('click', () => { $modal.classList.add('display__none'); })

$toggle.addEventListener('click', () => {
    $navigation.classList.toggle('active');
    $topmain.classList.toggle('active');
})

function switchLoader(_sw) {
    if (_sw) $modal__loader.classList.remove('display__none')
    else $modal__loader.classList.add('display__none')
}

function clearModalContentClass() {
    $modal__content.classList.remove('modal__content-200');
    $modal__content.classList.remove('modal__content-300');
    $modal__content.classList.remove('modal__content-400');
    $modal__content.classList.remove('modal__content-500');
    $modal__content.classList.remove('modal__content-600');

    $modal__content.classList.remove('modal__contentWidth-40perc');
    $modal__content.classList.remove('modal__contentWidth-60perc');
}

window.addEventListener('hashchange', () => router(window.location.hash));

(function () {
    console.log(window.location.hash)
    router(window.location.hash);

})();
