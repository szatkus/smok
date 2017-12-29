
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
                $('.subjectName').text(val.value);
            } else if (val.name == "code") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_code">Kod:</label>').append(val);
            } else if (val.name == "description") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_description">Opis:</label>').append(val);
            } else if (val.name == "special_classroom_req") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_special_classroom_req">Wymaga dedykowanej sali:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_subject 
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.subjectName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteSubject('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function deleteSubject(id){
    closeDeleteModal();
    $.post(deleteURL, 
        {
            id: id,
            csrfmiddlewaretoken: csrftoken
        }, function(){
            $('#'+id).remove();
            if ($('#list li').length == 0) {
                $("#list").append('<p id="noResources">Brak zapisanych przedmiotów.</p>');
            }
        });
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
                } else if (val.name == "code") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_code">Kod:</label>').append(val);
                } else if (val.name == "description") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_description">Opis:</label>').append(val);
                } else if (val.name == "special_classroom_req") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_special_classroom_req">Wymaga dedykowanej sali:</label>').append(val);
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

            if (data === 'FAILED') {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else {
                var newSubject = jQuery.parseJSON(data)[0];
                console.log(newSubject);
                var dedicatedClassroom = (newSubject.fields.special_classroom_req === true) ? 'Tak' :'-';
                var newLi = $('<li id ="'+newSubject.pk+'"><span id ="resource-name-'+newSubject.pk+'" class="row-content">' +newSubject.fields.name +'</span><span id ="resource-code-'+newSubject.pk+'" class="row-content">' +newSubject.fields.code +'</span> <span id="resource-dedicated-'+newSubject.pk+'" class="row-content">'+dedicatedClassroom+'</span> <span class="edit" onclick="edit_item('+newSubject.pk+');">&#x1f589;</span><span id ="resource-delete-'+newSubject.pk+'" class="close" onclick="delete_item('+newSubject.pk+', \''+newSubject.fields.name + ' (' + newSubject.fields.code + ')' + '\');">&#x232b;</span></li>').hide();

                //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
                $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
                //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');

                $('li#'+newSubject.pk).on('click', 'span.list-element', function() {
                    $( this ).parent().toggleClass( "checked" );
                });
                if ($('#list li').length != 0) {
                    $('p#noResources').remove();
                }
            }
        });
        event.preventDefault();
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

    // obsluga formularza do edytowania przedmiotow
    $("form.edit_subject").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            if (data === 'FAILED') {
                $('#successModal').css('display', 'block').delay(3000).fadeOut('slow');
            } else {
                var newSubject = jQuery.parseJSON(data)[0];
                var dedicatedClassroom = (newSubject.fields.special_classroom_req === true) ? 'Tak' :'-';

                $('span#resource-name-'+newSubject.pk).text(newSubject.fields.name);
                $('span#resource-code-'+newSubject.pk).text(newSubject.fields.code);
                $('span#resource-dedicated-'+newSubject.pk).text(dedicatedClassroom);
                $('span#resource-delete-'+newSubject.pk).attr("onclick",'delete_item('+newSubject.pk+', \''+newSubject.fields.name+ ' (' + newSubject.fields.code + ')' +'\');');
            }
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });

});
