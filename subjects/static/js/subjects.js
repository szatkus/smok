
var csrftoken = getCookie('csrftoken');

// generowanie formularza do edytowania przedmiotow na podstawie modelu
function edit_item(id){
    $.get(editURL, {id: id}, function(data){
        var dataHTML = jQuery.parseHTML(data);
        $("#editForm").append('<div class="inner"></div>');
        
        $.each( dataHTML, function( i, val ) {
            if (val.name == "name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>'); // kazdy atrybut formularza w osobnym divie dla wygodniejszego konfigurowania css w przyszlosci
                $("#formE"+i).append('<label for="id_name">Nazwa:</label>').append(val);
            } else if (val.name == "description") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_description">Opis:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_subject 
    });
    $('#editModal').css('display', 'block');
}

$(document).ready(function() {

    // obsluga formularza do edytowania przedmiotow
    $("form.edit_subject").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newSubject = jQuery.parseJSON(data)[0];
            $('span#resource-name-'+newSubject.pk).text(newSubject.fields.name);
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});
