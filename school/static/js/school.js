var csrftoken = getCookie('csrftoken');
// generowanie formularza do edytowania szkoly na podstawie modelu
function edit_item(id){
    $.get(editURL, {id: id}, function(data){
        var dataHTML = jQuery.parseHTML(data);
        $("#editForm").append('<div class="inner"></div>');
        $.each( dataHTML, function( i, val ) {
            if (val.name == "school_name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>'); // kazdy atrybut formularza w osobnym divie dla wygodniejszego konfigurowania css w przyszlosci
                $("#formE"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                $('.schoolName').text(val.value);
            } else if (val.name == "school_address") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_address">Adres:</label>').append(val);
            } else if (val.name == "school_type") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_type">Typ:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); 
    });
    $('#editModal').css('display', 'block');
};

$(document).ready(function() {
$("form.edit_school").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newSchool = jQuery.parseJSON(data)[0];
            $('span#schoolName').text(newSchool.fields.school_name);
            $('span#schoolAddress').text(newSchool.fields.school_address);
            $('span#schoolType').text(newSchool.fields.school_type_name)
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});



