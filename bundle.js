const Qrcode = window.qrcode;
const arweave = Arweave.init();
const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");
const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

let scanning = false;

qrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    outputData.innerText = `${res.slice(0,5)}...${res.slice(-5, -1)}`;
    window.item_id = res;
    scanning = false;

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
return res1};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    qrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}

async function readFqr() {
  let detected_fqr = window.item_id;
  console.log(111, detected_fqr)
  let verifiedWalletsArray = [];
  const verification_address = 'MtgIRVxVRaooHlL3vHE4Bu875vtnDelgJzwrZ7WnDyo';
  const res = await arweave.wallets.getLastTransactionID(verification_address);
  let wallets = await arweave.transactions.getData(res, {decode:true, string:true})
  // array of verified generators addresses
  verifiedWalletsArray = wallets.split(' ');

  try {
    const tx = await arweave.transactions.get(detected_fqr)
    console.log(tx);
    if ( (verifiedWalletsArray.find(owner => owner === tx['owner'])) ) {
              window.open(`https://arweave.net/${detected_fqr}`)
            } else {alert('invalid transaction ID')}
            
  } catch(err) {
    alert("FQR not detected")
  }
  

}
