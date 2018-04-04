function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}

window.onload = init;
var context;
var bufferLoader;
var source;
 
function init() {
  context = new webkitAudioContext();
  bufferLoader = new BufferLoader(context,['./BigBrother.mp3' ],function(){console.log("finish load.");});
  bufferLoader.load();
}

// function playBass() {
//     var startTime = context.currentTime + 0.100;
//     source  = playSound(bufferLoader.bufferList[0],startTime);
// }
 
// function stopBass() {
//     source.noteOff(0);
// }
 
function playSound(buffer,time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(context.destination);
    source.noteOn(time);
    return source;
}

document.getElementById("playButton").onclick = function() {
	
};
