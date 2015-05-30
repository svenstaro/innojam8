game.module('game.game_over')
.body(function() {
    game.createScene('GameOver', {
        init: function() {
            var text = new game.PIXI.Text('Game Over.\n\nYour time: '+score+'\nBest time: '+highscore+'\n\nPress any key to play again!', { font: '40px Arial', fill: '#f0a', align: 'center'});
            text.position = {x: (game.system.width - text.width)/2, y: (game.system.height - text.height)/2};
            this.stage.addChild(text);
        },
        keyup: function() {
            game.system.setScene('Main');
        }
    });
});