game.module('game.main_menu')
.body(function() {
    game.addAsset('game_name.png');

    game.createScene('MainMenu', {
        init: function() {
            var logo = new game.Sprite('game_name.png');
            logo.addTo(this.stage);

            var text = new game.PIXI.Text('Press any key to play', { font: '40px Arial', fill: '#f0a', align: 'center'});
            text.position = {x: game.system.width - text.width - 100, y: game.system.height - text.height - 100};
            this.stage.addChild(text);

            var bg = new game.Sprite('background.png');
            bg.zIndex = 100;
            bg.addTo(this.stage);
            game.sortZIndex();
        },
        keyup: function() {
            game.system.setScene('Main');
        }
    });
});