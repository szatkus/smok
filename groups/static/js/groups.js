
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
                $('.groupName').text(val.value);
            } else if (val.name == "group_profile") {
                $(".inner").append('<div class="form-group" id="formE'+i+'"></div>');
                $("#formE"+i).append('<label for="id_roup_profile">Opis:</label>').append(val);
            } else {
                $(".inner").append(val);
            }
        });
        $(".inner").append('<input type="hidden" name="id" value="'+id+'" />'); // potrzebny dla POST request w form.edit_subject 
    });
    $('#editModal').css('display', 'block');
}

function delete_item(id, name){
    $('.groupName').text(name);
    $("#deleteModalBody").append('<div class="inner"><button class="confirm" onClick="deleteGroup('+id+');">Tak</button></div>');
    $('#deleteModal').css('display', 'block');
}

function deleteGroup(id){
    closeDeleteModal();
    $.post(deleteURL, 
        {
            id: id,
            csrfmiddlewaretoken: csrftoken
        }, function(){
            $('#'+id).remove();
            if ($('#list li').length == 0) {
                $("#list").append('<p id="noResources">Brak zapisanych klas.</p>');
            }
        });
}

$(document).ready(function() {
    // generowanie formularza do dodawania klas na podstawie modelu
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
                } else if (val.name == "group_profile") {
                    $(".inner").append('<div class="form-group" id="form'+i+'"></div>');
                    $("#form"+i).append('<label for="id_group_profile">Profil:</label>').append(val);
                } else {
                    $(".inner").append(val);
                }
            });
        });
        $('#addModal').css('display', 'block');
    });

    // obsluga formularza do dodawania group
    $("form.add_group").submit(function(event) {
        $.post(addURL, $(this).serialize(), function(data){
            var newGroup = jQuery.parseJSON(data)[0];
            var newLi = $('<li id ="'+newGroup.pk+'"><span id ="resource-name-'+newGroup.pk+'" class="list-element">' +newGroup.fields.name +'</span><span class="edit" onclick="edit_item('+newGroup.pk+');">&#x2702;</span><span id ="resource-delete-'+newGroup.pk+'" class="close" onclick="delete_item('+newGroup.pk+', \''+newGroup.fields.name+'\');">×</span></li>').hide();
            
            //TODO: sort() nie dziala, nowe elementy sa dodawane na koncu ul#list
            $("#list").add(newLi.fadeIn(800)).sort(asc_sort).appendTo('#list');
            //$("#list").add(newLi.fadeIn(800)).sort(sortAlpha).appendTo('#list');
            
            $('li#'+newGroup.pk).on('click', 'span.list-element', function() {
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

	    // obsluga formularza do edytowania grup
    $("form.edit_group").submit(function(event) {
        $.post(editURL, $(this).serialize(), function(data){
            var newSubject = jQuery.parseJSON(data)[0];
            $('span#resource-name-'+newGroup.pk).text(newGroup.fields.name);
            $('span#resource-delete-'+newGroup.pk).attr("onclick",'delete_item('+newGroup.pk+', \''+newGroup.fields.name+'\');');
        });
        event.preventDefault();
        $('#editModal').css('display', 'none');
        $('.inner').remove();
    });


});