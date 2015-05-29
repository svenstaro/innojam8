game.module('game.game_over')
.body(function() {
    game.createScene('GameOver', {
        init: function() {
            var text = new game.PIXI.Text('Game Over!\n You scored 0 points.', { font: '40px Arial', fill: '#f0a', align: 'center'});
            text.position = {x: (game.system.width - text.width)/2, y: (game.system.height - text.height)/2};
            this.stage.addChild(text);
        }
    });
});