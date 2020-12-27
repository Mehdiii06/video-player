// ------------- Select elements -------------- //

//---- Video -----
const video = document.getElementById('video');
const videoContainer = document.getElementById('video-container');

//---- Video Controls -----
const videoControls = document.getElementById('video-controls');

//---- Input File -----
const FileBtn = document.getElementById("file");

//---- Play/Pause -----
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');

//---- Time -----
const timeElapsed = document.getElementById('time-elapsed');
const duration = document.getElementById('duration');

//---- Progress Bar -----
const progressBar = document.getElementById('progress-bar');
const seek = document.getElementById('seek');
const seekTooltip = document.getElementById('seek-tooltip');

//---- Volume -----
const volumeButton = document.getElementById('volume-button');
const volumeIcons = document.querySelectorAll('.volume-button use');
const volumeMute = document.querySelector('use[href="#volume-mute"]');
const volumeLow = document.querySelector('use[href="#volume-low"]');
const volumeHigh = document.querySelector('use[href="#volume-high"]');
const volume = document.getElementById('volume');

//---- Full-Screen Button -----
const fullscreenButton = document.getElementById('fullscreen-button');
const fullscreenIcons = fullscreenButton.querySelectorAll('use');

//---- Pip Button -----
const pipButton = document.getElementById('pip-button')

// -----------------------------------------------
// -----------------------------------------------


//-------------- video Works -------------
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
  video.controls = false
  videoControls.classList.remove('hidden');
}
//----------------------------------------


//---------- initialize Video -----------
function initializeVideo() {
  const videoDuration = Math.round(video.duration);
  seek.setAttribute('max', videoDuration);
  progressBar.setAttribute('max', videoDuration);
  const time = formatTime(videoDuration);
  duration.innerText = `${time.minutes}:${time.seconds}`;
  duration.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
//--------------------------------------


//--------- keyboard Shortcuts -----------
function keyboardShortcuts(event) {
  const { key } = event;
  switch(key) {
    case 'p':
      togglePlay();
      animatePlayback();
      if (video.paused) {
        showControls();
      } else {
        setTimeout(() => {
          hideControls();
        }, 2000);
      }
      break;
    case 'm':
      toggleMute();
      break;
    case 'f':
      toggleFullScreen();
      break;
    case 'u':
      togglePip();
      break;
  }
}
//----------------------------------------


//------------- Play/Pause ---------------
function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

function togglePause() {
  if (video.play) {
    video.pause();
  } else {
    video.play();
  }
}
//---------------------------------------


//---------- Time converter -------------
function formatTime(timeInSeconds) {
  const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);

  return {
    minutes: result.substr(3, 2),
    seconds: result.substr(6, 2),
  };
};
//--------------------------------------


//------------ Time Elapsed -------------
function updateTimeElapsed() {
  const time = formatTime(Math.round(video.currentTime));
  timeElapsed.innerText = `${time.minutes}:${time.seconds}`;
  timeElapsed.setAttribute('datetime', `${time.minutes}m ${time.seconds}s`)
}
//--------------------------------------


//-------- update Progress Bar ----------
function updateProgress() {
  seek.value = Math.floor(video.currentTime);
  progressBar.value = Math.floor(video.currentTime);
}
//---------------------------------------


//---------- update Seek Tool tip ------------
function updateSeekTooltip(event) {
  const skipTo = Math.round((event.offsetX / event.target.clientWidth) * parseInt(event.target.getAttribute('max'), 10));
  seek.setAttribute('data-seek', skipTo)
  const t = formatTime(skipTo);
  seekTooltip.textContent = `${t.minutes}:${t.seconds}`;
  const rect = video.getBoundingClientRect();
  seekTooltip.style.left = `${event.pageX - rect.left}px`;
}
//--------------------------------------------


// ------ skipAhead progress bar -------
function skipAhead(event) {
  const skipTo = event.target.dataset.seek
    ? event.target.dataset.seek
    : event.target.value;
  video.currentTime = skipTo;
  progressBar.value = skipTo;
  seek.value = skipTo;
}
// --------------------------------------


//------------ updateVolume -------------
function updateVolume() {
  if (video.muted) {
    video.muted = false;
  }
  video.volume = volume.value;
}
//--------------------------------------


//-------------Volume Icon -------------
function updateVolumeIcon() {
  volumeIcons.forEach(icon => {
    icon.classList.add('hidden');
  });

  volumeButton.setAttribute('data-title', 'Mute (m)')

  if (video.muted || video.volume === 0) {
    volumeMute.classList.remove('hidden');
    volumeButton.setAttribute('data-title', 'Unmute (m)')
  } else if (video.volume > 0 && video.volume <= 0.5) {
    volumeLow.classList.remove('hidden');
  } else {
    volumeHigh.classList.remove('hidden');
  }
}
//---------------------------------------


//------------ mutes/nmutes -------------
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    volume.setAttribute('data-volume', volume.value);
    volume.value = 0;
  } else {
    volume.value = volume.dataset.volume;
  }
}
//---------------------------------------


//------------- Animation ---------------
function animatePlayback() {
    playbackAnimation.animate([
      {
        opacity: 1,
        transform: "scale(1)",
      },
      {
        opacity: 0,
        transform: "scale(1.3)",
      }
    ], {
      duration: 500,
    });
}
//--------------------------------------


//------------ FullScreen --------------
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
}
//---------------------------------------

//---------- Fullscreen icon ------------
function updateFullscreenButton() {
  fullscreenIcons.forEach(icon => icon.classList.toggle('hidden'));

  if (document.fullscreenElement) {
    fullscreenButton.setAttribute('data-title', 'Exit full screen (f)')
  } else {
    fullscreenButton.setAttribute('data-title', 'Full screen (f)')
  }
}
//---------------------------------------


//-------- Picture-in-Picture -----------
async function togglePip() {
  try {
    if (video !== document.pictureInPictureElement) {
      pipButton.disabled = true;
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error(error)
  } finally {
    pipButton.disabled = false;
  }
}
//----------------------------------------


//------------- hide Controls -------------
function hideControls() {
  if (video.paused) {
    return;
  }

  videoControls.classList.add('hide');
}

function showControls() {
  videoControls.classList.remove('hide');
}
//----------------------------------------


//-------------- Input File ---------------
FileBtn.addEventListener("change", function() {
  if (FileBtn.value) {
    customTxt.innerHTML = FileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  }
});
//-----------------------------------------


//--------------------------------------------
/*
(function localFileVideoPlayer() {
  'use strict'
  var URL = window.URL || window.webkitURL
  var displayMessage = function (message, isError) {
    var element = document.querySelector('#message')
    element.innerHTML = message
    element.className = isError ? 'error' : 'info'
  }
  var playSelectedFile = function (event) {
    var file = this.files[0]
    var type = file.type
    var videoNode = document.querySelector('video')
    var canPlay = videoNode.canPlayType(type)
    if (canPlay === '') canPlay = 'no'
    var message = 'Can play type "' + type + '": ' + canPlay
    var isError = canPlay === 'no'
    displayMessage(message, isError)

    if (isError) {
      return
    }

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL
  }
  var inputNode = document.querySelector('.inputURL')
  inputNode.addEventListener('change', playSelectedFile, false)
})()
*/
//--------------------------------------------



// ------------- Add eventlisteners -------------- //

//---- Play/Pause -----
playButton.addEventListener('click', togglePlay);
pauseButton.addEventListener('click', togglePause);

//---- Video -----
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('volumechange', updateVolumeIcon);
video.addEventListener('click', togglePlay);
video.addEventListener('click', animatePlayback);
video.addEventListener('mouseenter', showControls);
video.addEventListener('mouseleave', hideControls);

//---- Video Controls -----
videoControls.addEventListener('mouseenter', showControls);
videoControls.addEventListener('mouseleave', hideControls);

//---- Progress Bar -----
seek.addEventListener('mousemove', updateSeekTooltip);
seek.addEventListener('input', skipAhead);

//---- Volume -----
volume.addEventListener('input', updateVolume);
volumeButton.addEventListener('click', toggleMute);

//---- Full-Screen -----
fullscreenButton.addEventListener('click', toggleFullScreen);
videoContainer.addEventListener('fullscreenchange', updateFullscreenButton);

//---- Picture-in-Picture -----
pipButton.addEventListener('click', togglePip);
document.addEventListener('DOMContentLoaded', () => {
  if (!('pictureInPictureEnabled' in document)) {
    pipButton.classList.add('hidden');
  }
});
document.addEventListener('keyup', keyboardShortcuts);
// ----------------------------------------------- //