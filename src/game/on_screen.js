game.module('game.on_screen')
.body(function() {
    game.onScreen = function(x, y) {
        if (typeof(x) == 'object') {
            y = x.y;
            x = x.x;
        }

        return y < game.system.height + 300 && 
                x < game.system.width + 300 && 
                x > -300;
    }
});