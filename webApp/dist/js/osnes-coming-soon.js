$(document).ready(function () {

  var pitches = [
    'Wirelessly sync your mobile device to your computer and use it as a game controller',
    'Play all your favorite retro games',
    'Use your own ROMS or get them free',
    'Supports SNES, NES, Gameboy, Gameboy Color and Gameboy Advance',
    'OSnes. Get it.'
  ];

  var index = 0;

  var $pitch = $('#pitch');
  $pitch.hide();
  $pitch.text(pitches[0]);
  $pitch.delay(1000).fadeIn(1000, changePitch);

  function changePitch() {
    index = (index + 1) % pitches.length;
    $pitch.delay(2500).fadeOut(1000, function () {
      $pitch.text(pitches[index]);
      $pitch.fadeIn(1000, changePitch);
    });
  }


});
