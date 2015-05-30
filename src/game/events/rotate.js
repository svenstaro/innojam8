game.module('game.events.rotate')
.body(function() {
    game.createClass('Rotate', {
        init: function() {
            game.scene.sphere.rotate(1);
        }
    });
});