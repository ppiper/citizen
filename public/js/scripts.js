function confirmation() {
  if (confirm("Voulez-vous réellement supprimer cet élément?")) {
    $('#annonce-form').submit();
  }
}

function readURL(input) {

  if (input.files) {
    var files = input.files;
    for (var i = 0; i < files.length; i++) {
      if (files[i].type.indexOf("image") !== -1) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $('#preview').append("<div class=\"img-thumbnail\"><img src=\"" + e
            .target
            .result +
            "\" class=\"img-responsive\"></div>");
        }
        reader.readAsDataURL(files[i]);
      }
    }
  }
}

$('.join-button').click(function() {
  var id = $(this).attr('data-project');
  $.post('/project/' + id + '/join', function(data) {
    console.log(data);
  });
});

$('#btnUpload').click(function() {
  $('#photos').trigger('click');
});

$("#photos").change(function() {
  readURL(this);
});

$("#btn-edit").click(function() {
  $('#edition').removeAttr('disabled');
  $("#btn-submit").show();
  $("#btn-edit").hide();
});

// MODAL LOGIN
$('#form-register').submit(function(e) {
  var form = $(this);
  //console.log(form.serialize());
  $.post({
    url: '/register',
    data: form.serialize()
  }).done(function(data) {
    $(location).attr('href', '/');
  })
  .fail(function(err) {
    console.log("Impossible d'enregistrer le nouvel utilisateur");
    alert("Cet email est déja utilisé.");
  });;
  return false;
});

// MODAL REGISTER
$('#form-login').submit(function(e) {
  var form = $(this);
  //console.log(form.serialize());
  $.post({
    url: '/login',
    data: form.serialize()
  }).done(function(data) {
    $(location).attr('href', '/');
  })
  .fail(function(err) {
    console.log("erreur de connexion");
    alert("Veuillez vérifier vos identifiants !");
  });
  return false;
});
