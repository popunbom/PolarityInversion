var audioCtx = new AudioContext();
var buffer = null;
// var source = audioCtx.createBufferSource();
var source = null;
var dest = null;
var effectIn  = audioCtx.createChannelSplitter(2);
var effectOut = audioCtx.createChannelMerger(2);
var request = new XMLHttpRequest();
var isPaused = false;
var isInverted = false;
var inverted = null;

window.onload = init;

function init() {
	source = audioCtx.createMediaElementSource(document.querySelector('video'));

	// document.getElementById("pBtn").onclick = function(){
	// 	let btn = document.getElementById("pBtn");
	// 	if (isPaused){
	// 		audioCtx.resume();
	// 		btn.value = "Pause";
	// 	} else {
	// 		audioCtx.suspend();
	// 		btn.value = "Play";
	// 	}
	// 	isPaused = !isPaused
	// }
	document.getElementById("aBtn").onclick = function(){
		let btn = document.getElementById("aBtn");
		if (isInverted){
			btn.value = "Enable";
			// Disconnect
			source.disconnect(effectIn);	
			effectOut.disconnect(audioCtx.destination);
			// Re-Connect
			source.connect(audioCtx.destination);
		} else {
			btn.value = "Disable";
			// Disconnect
			source.disconnect(audioCtx.destination);
			// Re-Connect
			source.connect(effectIn);
			effectOut.connect(audioCtx.destination);
		}
		isInverted = !isInverted
	}
	// request.open('GET', './xxx.m4a', true);
	// request.responseType = 'arraybuffer';
	// request.send();

	createPolarityInvertEffect(-1.0);
	source.connect(audioCtx.destination);
	source.start(0);
}



// 片チャンネルのみの位相(極性)反転
function createPolarityInvertEffect() {
	// src --> splitter
	source.connect(effectIn);
	// 片チャンネル(L-ch)のみ位相反転
	// GainNodeにおいて、gain.value = -1.0で位相反転
	var gNode = audioCtx.createGain();
	// gNode.gain.value = -1;
	gNode.gain.setValueAtTime(-1.0, 0);
	effectIn.connect(gNode, 0);
	// Channel Merge
	   gNode.connect(effectOut, 0, 0);
	effectIn.connect(effectOut, 1, 1);
	return;
}

request.onload = function () {
  var res = request.response;
  audioCtx.decodeAudioData(res, function (audioBuffer) {
    source.buffer = audioBuffer;
  });
};

