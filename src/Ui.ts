
import {Master} from 'tone';

// UI
 var muteButton, 
    infoButton,
    intro,
    startButton;

 var isIntroClosed = false,
   onStartedListeners = [];

export function addOnStartedListener(listener) {
    onStartedListeners.push(listener);
};


 var numItemsLoading = 0;

export function incrementLoadingItems() {
    numItemsLoading++;
};

export function decrementLoadingItems() {
    if (--numItemsLoading == 0) {
    document.body.className = document.body.className.replace('loading', 'loaded');
    startButton.disabled = false;
    startButton.innerText = "Begin";
    }
};


window.addEventListener('DOMContentLoaded', function() {
    muteButton = document.getElementById('muteButton');
    muteButton.addEventListener('click', function (ev) {
      var isMuted = Master.mute = !Master.mute;
      if (isMuted) {
        document.body.className += ' muted';
      } else {
        document.body.className = document.body.className.replace(' muted', '');
      }
    });
   
    var infoButton = document.getElementById('infoButton');
    infoButton.addEventListener('click', function (ev) {
      document.body.className += ' about';
    });



    intro = document.getElementById('intro'),
    startButton = document.getElementById('startButton');
    startButton.addEventListener('click', function(ev) {
        intro.className += ' closed';
        setTimeout(function () { intro.style.display = 'none'; }, 350);
    
        isIntroClosed = true;
    
        setTimeout(function() {
            onStartedListeners.forEach(function(listener) {
            listener();
            });
            onStartedListeners = null;
        }, 100);
    });

    startButton.disabled = true;
    startButton.innerText = "Loading...";
});