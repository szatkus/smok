
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
    // generowanie formularza do dodawania przedmiotow na podstawie modelu
    // moglby byc tworzony od razu podczas renderowania subjects.html z  {%for field in form %}, jesli zostawimy 2 osobne modale dla dodawania i usuwania przedmiotow,
    // zamiast polaczyc je w jeden
    $("span#newItem").click(function(){
        $.get(addURL, function(data){
            var dataHTML = jQuery.parseHTML(data);
            $("#addForm").append('<div class="inner"></div>');
            $.each( dataHTML, function( i, val ) {
                if (val.name == "name") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                } else if (val.name == "description") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_description">Opis:</label>').append(val);
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania przedmiototow
    $("form.add_subject").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            var newSubject = jQuery.parseJSON(data)[0];
            var newLi = $('<li id ="'+newSubject.pk+'"><span id ="resource-name-'+newSubject.pk+'" class="list-element">' +newSubject.fields.name +'</span><span class="edit" onclick="edit_item('+newSubject.pk+');">&#x2702;</span><span class="close" onclick="delete_item('+newSubject.pk+');">×</span></li>').hide();
            
            //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
            $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
            //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');
            
            $('li#'+newSubject.pk).on('click', 'span.list-element', function() {
                $( this ).parent().toggleClass( "checked" );
            });
        });
        event.preventDefault();
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

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
