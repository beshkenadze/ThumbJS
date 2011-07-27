var ThumbJS = function(callaback) {
    var _this = this;
    _this.thumbs = new Array();

    _this.appendImage = function(image) {
        _this.thumbs.push(image);
        if (_this.sizes.length == 1) {
            if (callaback) {
                callaback(_this.thumbs);
            }
        }
    }
    _this.appendFile = function(fileList) {
        if (fileList.length > 0) {
            if (fileList[0]['type'].indexOf('image') >= 0) {
                var image = new Image();
                var k = 0;
                var reader = new FileReader();
                reader.onload = function() {
                    var imageData = this.result;
                    image.setAttribute('src', imageData);
                    image.setAttribute('class', 'orign');
                    image.onload = function() {
                        _this.appendImage(image);
                        _this.prepareImage(image);
                    }

                };
                reader.readAsDataURL(fileList[0]);
            };
        }

    }
    _this.prepareImage = function(image) {
        if (_this.sizes.length > 0) {
            if (_this.sizes[0] > image.width) {
                _this.sizes.shift(0);
                _this.prepareImage(image);
                return;
            }
            _this.resize(image.src, _this.sizes[0], 0,
            function(data) {
                _this.sizes.shift(0);
                var resizeImage = new Image();
                resizeImage.onload = function() {
                    _this.appendImage(resizeImage);
                    _this.prepareImage(resizeImage);
                }
                resizeImage.setAttribute('src', data);
            });
        }
    }
    _this.resize = function(dataImage, w, h, callback) {
        var maxWidth = w;
        var maxHeight = h;
        var img = new Image();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d");
        var canvasCopy = document.createElement("canvas");
        var copyContext = canvasCopy.getContext("2d");

        img.onload = function()
        {
            var ratio = 1;

            if (img.width > maxWidth)
            ratio = maxWidth / img.width;
            else if (img.height > maxHeight)
            ratio = maxHeight / img.height;

            canvasCopy.width = img.width;
            canvasCopy.height = img.height;
            copyContext.drawImage(img, 0, 0);

            canvas.width = img.width * ratio;
            canvas.height = img.height * ratio;
            ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);
            callback(canvas.toDataURL());
        };
        img.src = dataImage;
    }
    _this.onDrop = function(e) {
        e.target.style.background = '#dcdcdc';
        setTimeout(function() {
            e.target.style.background = '#fff';
        },
        10);
        e.target.removeAttribute('class');
        e.stopPropagation();
        e.preventDefault();

        var dt = e.dataTransfer;
        var files = dt.files;

        _this.appendFile(files);

    }
    _this.onDragenter = function(e) {
        e.target.setAttribute('class', 'enter');
        e.stopPropagation();
        e.preventDefault();
    }

    _this.onDragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
    }
    _this.init = function(fileInput, dropzone, sizes) {
        _this.fileInput = fileInput;
        _this.dropzone = dropzone;
        _this.sizes = sizes;

        _this.fileInput.addEventListener("change",
        function() {
            _this.appendFile(this.files)
        },
        false);
        _this.dropzone.addEventListener("dragenter", _this.onDragenter, false);
        _this.dropzone.addEventListener("dragover", _this.onDragover, false);
        _this.dropzone.addEventListener("drop", _this.onDrop, false);
    };
}

