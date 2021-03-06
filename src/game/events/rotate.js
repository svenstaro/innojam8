game.module('game.events.rotate')
.body(function() {
    game.createClass('Rotate', {
        init: function(difficulty) {
            var maxRotation = 3 + difficulty;
            game.scene.sphere.rotate(Math.random()*maxRotation - (maxRotation/2));
        }
    });
});