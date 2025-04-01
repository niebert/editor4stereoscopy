function download_blob (pFilename,pDataURL) {
  if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    window.open(pDataURL);
  } else {
    var blob = this.dataURLToBlob(pDataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = pFilename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }
}

function fromDataURL(canvas, pDataURL, options, callback) {
    var ctx;
    var imagePNG;
    if (!canvas) {
      console.warn("fromDataURL(canvas,pDataURL,options,callback) canvas does not exist!");
      return ;
    } else {
      ctx = canvas.getContext('2d');
      if (!ctx) {
        console.warn("fromDataURL(canvas,pDataURL,options,callback) canvas does not have a 2D context!");
        return ;
      }
    }
    options = options || {};
    var image = new Image();
    var ratio = options.ratio || 1; //window.devicePidownload_blobxelRatio || 1;
    var width = options.width || canvas.width / ratio;
    var height = options.height || canvas.height / ratio;
    width  = Math.floor(width);
    height = Math.floor(height);
    image.onload = function () {
        ctx.drawImage(image, 0, 0, width, height);
        imagePNG = canvas.toDataURL('image/png');
        if (callback) {
            callback(imagePNG);
        };
    };
    image.onerror = function (error) {
        if (callback) {
            console.error("Load Error - fromDataURL(canvas,pDataURL,...) - " +  error);
        }
    };
    image.src = pDataURL
};

function download_text_filesaver(pFilename,pContent) {
  console.log("save4blob.js:56 - download_text_filesaver('"+pFilename+"',pContent)");
  //alert("src/editor5_load_save.js:796 - download_text_filesaver('"+pFilename+"',pContent)");
  var file = new File([pContent], {type: "text/plain;charset=utf-8"});
  window.saveAs(file,pFilename);
};

function download_text(pFilename,pData) {
  if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    window.open(pData);
  } else {
    if (window.saveAs) {
      //alert("pData="+pData)
      this.download_text_filesaver(pFilename,pData);
    } else {
      var a = document.createElement("a");
      a.download = pFilename;
      a.style = "display: none";
      var t = new Blob([pData], {
          type: "text/plain"
        });
      a.href = window.URL.createObjectURL(t);
      //document.body.appendChild(a);
      a.click();
    }
  }
}
