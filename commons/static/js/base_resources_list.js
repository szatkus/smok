window.addEventListener('load', function () {
    // Add a "checked" symbol when clicking on a list item
    var list = document.querySelector('ul#list');
    list.addEventListener('click', function(ev) {
      if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
      }
    }, false);
});
