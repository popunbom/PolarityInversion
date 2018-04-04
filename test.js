var audioCtx = new AudioContext();
var buffer = null;
var source = audioCtx.createBufferSource();
var request = new XMLHttpRequest();



window.onload = function() {
	
	request.open('GET', './BigBrother.mp3', true);
	request.responseType = 'arraybuffer';
	request.send();
	var abuf = polarityInversion(source);
	// aNodeLch.connect(audioCtx.destination);
	abuf.connect(audioCtx.destination);
	source.start(0);
}

function extractLch(aBufSrcNode) {
	// Splitter から直に ctx.destination に接続すると、
	// モノラル信号にステレオ化が施されてしまう。
	// L-chのみを抽出し、L側だけに出力したい場合は
	// Splitter --Lch--> Merger --> ctx.destination
	// の経路で接続する必要がある。
	var splitter = audioCtx.createChannelSplitter(2);
	var merger = audioCtx.createChannelMerger(2);
	aBufSrcNode.connect(splitter);
	splitter.connect(merger, 0, 0);
	return merger;
}
// 片チャンネルのみの位相(極性)反転
function polarityInversion(aBufSrcNode) {
	// splitter, merger 生成
	var splitter = audioCtx.createChannelSplitter(2);
	var merger = audioCtx.createChannelMerger(2);
	// src --> splitter
	aBufSrcNode.connect(splitter);
	// 片チャンネル(L-ch)のみ位相反転
	// GainNodeにおいて、gain.value = -1.0で位相反転
	var gNode = audioCtx.createGain();
	gNode.gain.value = -1;
	splitter.connect(gNode, 0);
	// Channel Merge
	gNode.connect(merger, 0, 0);
	splitter.connect(merger, 1, 1);
	return merger;
}

request.onload = function () {
  var res = request.response;
  audioCtx.decodeAudioData(res, function (audioBuffer) {
    source.buffer = audioBuffer;
  });
};

