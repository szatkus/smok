function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// funkcje do alfabetycznego sortowania elementow li dodawanych do ul/ol 
function asc_sort(a, b){
    return ($(b).text()) < ($(a).text()) ? 1 : -1;    
}
function sortAlpha(a,b){  
    return a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase() ? 1 : -1;  
}

function closeDeleteModal(){
    $('#deleteModal').css('display', 'none');
    $('#subjectName').text('');
    $('.inner').remove();
}

$(document).ready(function() {

    $("span.list-element").click( function(event) {
        $( this ).parent().toggleClass( "checked" );
      }
    );

    $("#closeAddModal").click(function(){
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

    $("#closeEditModal").click(function(){
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});