
var csrftoken = getCookie('csrftoken');

// generowanie formularza do edytowania sal na podstawie modelu
function edit_item(id){
    $.get(editURL, {id: id}, function(data){
        var dataHTML = jQuery.parseHTML(data);
        $("#editForm").append('<div class="inner"></div>');
        $.each( dataHTML, function( i, val ) {
            if (val.name == "name") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>'); // kazdy atrybut formularza w osobnym divie dla wygodniejszego konfigurowania css w przyszlosci
                $("#formE"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                $('.subjectName').text(val.value);
            } else if (val.name == "building") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_building">Budynek:</label>').append(val);
            } else if (val.name == "seats") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_seats">Liczba miejsc:</label>').append(val);
            } else if (val.name == "subjects") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_subjects">Przedmiot:</label>').append(val);				
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_classroom
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.classroomName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteClassroom('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function deleteClassroom(id){
    closeDeleteModal();
    $.post(deleteURL, 
        {
            id: id,
            csrfmiddlewaretoken: csrftoken
        }, function(){
            $('#'+id).remove();
            if ($('#list li').length == 0) {
                $("#list").append('<p id="noResources">Brak zapisanych sal.</p>');
            }
        });
}

$(document).ready(function() {
    // generowanie formularza do dodawania sal na podstawie modelu
    // moglby byc tworzony od razu podczas renderowania groups.html z  {%for field in form %}, jesli zostawimy 2 osobne modale dla dodawania i usuwania przedmiotow,
    // zamiast polaczyc je w jeden
    $("span#newItem").click(function(){
        $.get(addURL, function(data){
            var dataHTML = jQuery.parseHTML(data);
            $("#addForm").append('<div class="inner"></div>');
            $.each( dataHTML, function( i, val ) {
                if (val.name == "name") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_name">Nazwa:</label>').append(val);
                } else if (val.name == "building") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_building">Budynek:</label>').append(val);
                } else if (val.name == "seats") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_seats">Liczba miejsc:</label>').append(val);
                } else if (val.name == "subjects") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_subjects">Przedmiot:</label>').append(val);					
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania sal
    $("form.add_classroom").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            var newGroup = jQuery.parseJSON(data)[0];
            var newLi = $('<li id ="'+newClassroom.pk+'"><span id ="resource-name-'+newClassroom.pk+'" class="list-element">' +newClassroom.fields.name +'</span><span class="edit" onclick="edit_item('+newClassroom.pk+');">&#x1f589;</span><span id ="resource-delete-'+newClassroom.pk+'" class="close" onclick="delete_item('+newClassroom.pk+', \''+newClassroom.fields.name+'\');">×</span></li>').hide();
            
            //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
            $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
            //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');
            
            $('li#'+newClassroom.pk).on('click', 'span.list-element', function() {
                $( this ).parent().toggleClass( "checked" );
            });
            if ($('#list li').length != 0) {
                $('p#noResources').remove();
            }
        });
        event.preventDefault();
        $('#addModal').css('display', 'none');
        $('.inner').remove();
    });

	    // obsluga formularza do edytowania sal
    $("form.edit_classroom").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newSubject = jQuery.parseJSON(data)[0];
            $('span#resource-name-'+newClassroom.pk).text(newClassroom.fields.name);
            $('span#resource-delete-'+newClassroom.pk).attr("onclick",'delete_item('+newClassroom.pk+', \''+newClassroom.fields.name+'\');');
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });


});
