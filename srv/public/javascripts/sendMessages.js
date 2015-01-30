setInterval(function() {
    var data = escapeHtml('id=' + window.clientId);
    $.ajax({
        type: "POST",
        url: "/testChat",
        data: data,
        success: function(msg) {
        }
    });
}, 5000);

var input = document.getElementById('input');

input.onkeypress = function(event) {
    if (event.keyIdentifier === "Enter") {
        var data = 'id=' + escapeHtml(window.clientId) + '&msg=' + escapeHtml(input.value);
        $.ajax({
            type: "POST",
            url: "/testChat",
            data: data,
            success: function(msg) {
                console.log(msg);
            }
        });

        input.value = '';
    }
};

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '#largert;',
    '>': '#greatert;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}