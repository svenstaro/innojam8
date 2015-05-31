game.module('game.events.extend')
.body(function() {
    game.createClass('Extend', {
        init: function(difficulty) {
            game.scene.sphere.extend();
        }
    });
});