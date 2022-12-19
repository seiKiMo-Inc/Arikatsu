updateList = function () {
    var input = document.getElementById('file-upload');
    var output = document.getElementById('file-list');

    output.innerHTML = '<ul>';
    for (var i = 0; i < input.files.length; ++i) {
        output.innerHTML += '<li>' + input.files.item(i).name + '</li>';
    }
    output.innerHTML += '</ul>';
}

alertEmptyList = function () {
    var input = document.getElementById('file-upload');

    if (input.files.length == 0) {
        alert("Please select at least one file to upload.");
    }
}