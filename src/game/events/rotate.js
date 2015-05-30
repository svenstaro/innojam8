game.module('game.events.rotate')
.body(function() {
    game.createClass('Rotate', {
        init: function(difficulty) {
            var maxRotation = 1 + difficulty / 10;
            game.scene.sphere.rotate(Math.random()*maxRotation - (maxRotation/2));
        }
    });
});