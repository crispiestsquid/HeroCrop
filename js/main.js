window.onload = init;

// declare global variables
var c;

function init() {

    c = new Croppie(document.getElementById('croppie'), {
        viewport: { width: 300, height: 300 },
        boundary: { width: 700, height: 500 },
        showZoomer: true,
        enableOrientation: true
    });

    // initialize variables
    var fileInput = document.getElementById('imageupload');
    var cropBtn = document.getElementById('crop');
    var haveCropped = false;
    var uploadBtn = document.getElementById('upload');
    var fileName;
    var base64Image;
    var copyBtn = document.getElementById('copy');

    // add on change listener to the file input
    fileInput.addEventListener('change', function () {
        fileName = handleFiles(this.files);
    });

    // add crop button click handler
    cropBtn.addEventListener('click', function () {
        cropImage(fileName, function(resp, _newFileName) {
            var img = document.getElementById('preview');
            base64Image = resp;
            img.src = resp;
            haveCropped = true;
            fileName = _newFileName;
        });
    });

    // add upload button click handler
    uploadBtn.addEventListener('click', function () {
        if (haveCropped) {
            upload(fileName, base64Image);
        }
    });

    copyBtn.addEventListener('click', function () {
        var linkInput = document.getElementById('imagelink');
        linkInput.select();
        linkInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
    });
}

function handleFiles(files) {
    var file = files[0];

    if (file.type.includes('image')) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            c.bind({
                url: reader.result,
            });
        }
    }

    return file.name;
}

function cropImage(_fileName, callback) {
    var ext = _fileName.split('.')[1];
    var newFileName = _fileName.split('.')[0] + '_300x300.' + ext;
    if (ext === 'jpg') {
        ext = 'jpeg';
    }

    c.result({
        type: 'base64',
        format: ext,
    }).then(function(resp) {
        callback(resp, newFileName);
    });
}

function upload(_fileName, _base64Image) {
    var encodedImage = encodeURIComponent(_base64Image);
    var data = 'fileName=' + _fileName + '&base64Image=' + encodedImage;

    var icon = document.getElementById('upload').firstChild;
    var text = icon.nextSibling;
    var button = icon.parentElement;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState < 4) {
            icon.classList.remove('fa-upload');
            icon.classList.add('fa-spinner');
            text.textContent = ' Waiting...';
            button.classList.remove('btn-success');
            button.classList.add('btn-secondary');
            button.disabled = true;
        }else if (xhr.readyState === 4) {
            //alert(xhr.responseText);
            icon.classList.add('fa-upload');
            icon.classList.remove('fa-spinner');
            text.textContent = ' Upload';
            button.classList.add('btn-success');
            button.classList.remove('btn-secondary');
            button.disabled = false;
            document.getElementById('imagelink').value = xhr.responseText;

            $('#linkModal').modal('show');
        }
    }
    xhr.open('POST', '../php/upload.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}