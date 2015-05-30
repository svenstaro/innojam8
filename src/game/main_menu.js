game.module('game.main_menu')
.body(function() {
    game.createScene('MainMenu', {
        init: function() {
            var text = new game.PIXI.Text('HYPER\nOCTAGON\n\nPress any key to play', { font: '40px Arial', fill: '#f0a', align: 'center'});
            text.position = {x: (game.system.width - text.width)/2, y: (game.system.height - text.height)/2};
            this.stage.addChild(text);
        },
        keyup: function() {
            game.system.setScene('Main');
        }
    });
});