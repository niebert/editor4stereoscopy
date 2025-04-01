// (A) INITIALIZE - GET USER PERMISSION TO ACCESS CAMERA
// URL:  https://code-boxx.com/capture-photos-webcam-javascript/
var webcam = {
	"hVid": null ,
	"hSnaps": null
};

function elc(pID) {
	var vNode;
	if (pID) {
		vNode = document.getElementById(pID);
		if (!vNode) {
			console.error("DOM Element ["+pID+"] is not defined");
		}
	} else {
		console.error("CALL: elc(pID) Identificator pID was not defined");
	}
	return vNode;
}

function init_webcam () {
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // (A1) GET HTML ELEMENTS
    webcam.hVid = elc("cam-live"),
    webcam.hSnaps = elc("cam-snaps");

    // (A2-1) "LIVE FEED" WEB CAM TO <VIDEO>
    webcam.hVid.srcObject = stream;

    // (A2-2) ENABLE BUTTONS
    elc("cam-take").disabled = false;
    elc("cam-save").disabled = false;
    elc("cam-upload").disabled = false;
  })
  .catch(err => console.error(err));
}
window.addEventListener("load", init_webcam);


// (B) SNAP VIDEO FRAME TO CANVAS
function snapshot4webcam() {
  // (B1) CREATE NEW CANVAS
  let cv = document.createElement("canvas"),
      cx = cv.getContext("2d");

  // (B2) CAPTURE VIDEO FRAME TO CANVAS
  cv.width = webcam.hVid.videoWidth;
  cv.height = webcam.hVid.videoHeight;
  cx.drawImage(webcam.hVid, 0, 0, webcam.hVid.videoWidth, webcam.hVid.videoHeight);

  // (B3) DONE
  return cv;
}

// (C) PUT SNAPSHOT INTO <DIV> WRAPPER
function take_snapshot (pEye) {
	webcam.hSnaps.appendChild(snapshot4webcam())
}
