var MidiPlayer = MidiPlayer;
var loadFile, loadDataUri, Player;
var AudioContext = window.AudioContext || window.webkitAudioContext || false; 
var ac = new AudioContext || new webkitAudioContext;
var eventsDiv = document.getElementById('events');

var changeTempo = function(tempo) {
  Player.tempo = tempo;
}

async function getFileFromUrl(url, name, defaultType = 'image/jpeg'){
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type,
  });
}

Soundfont.instrument(ac, 'https://raw.githubusercontent.com/gleitz/midi-js-soundfonts/gh-pages/MusyngKite/xylophone-mp3.js').then(function (instrument) {
  playSong = async function(url) {
    if (Player) Player.stop()

    const file = await getFileFromUrl(url, 'example-midi');

    var reader = new FileReader();
    if (file) reader.readAsArrayBuffer(file);

    reader.addEventListener('load', function () {
      Player = new MidiPlayer.Player(function(event) {
        if (event.name == 'Note on') {
          instrument.play(event.noteName, ac.currentTime, {gain:event.velocity/100});
        }

        document.getElementById('play-track').max = Player.getSongTime();
        document.getElementById('play-track').value = Player.getSongTime() - Player.getSongTimeRemaining()
        
        document.getElementsByClassName('btn-close')[0].addEventListener('click', function() {
          document.getElementById('play-bar-container').style.visibility = 'hidden';
          Player.stop();
        })
      });

      document.getElementById('play-bar-container').style.visibility = 'visible';
      Player.loadArrayBuffer(reader.result);
      Player.play()
    }, false);
  }
});