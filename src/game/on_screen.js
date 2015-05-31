game.module('game.on_screen')
.body(function() {
    game.onScreen = function(x, y) {
        console.log(x);
        if (typeof(x) == 'object') {
            y = x.y;
            x = x.x;
        }

        return y < game.system.height + 100 && 
                y > -300 && 
                x < game.system.width + 100 && 
                x > -100;
    }
});