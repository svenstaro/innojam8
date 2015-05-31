game.module('game.game_over')
.body(function() {
    game.createScene('GameOver', {
        init: function() {
            var bg = new game.Sprite('background.png');
            bg.addTo(this.stage);

            var logo = new game.Sprite('game_name.png', 20, -20, {width: game.system.width/3, height: game.system.height/3});
            logo.addTo(this.stage);

            this.rgbfilter = new game.PIXI.RGBSplitFilter();
            this.pixelatefilter = new game.PIXI.PixelateFilter();
            this.stage.filters = [this.rgbfilter, this.pixelatefilter];

            var text = new game.PIXI.Text('Game Over\n\nYour time: '+score+'\nBest time: '+highscore+'\n\nPress SPACE to play again', { font: '100px ibmfont', fill: '#f0a', align: 'center'});
            text.position = {x: (game.system.width - text.width)/2, y: (game.system.height - text.height)/2};
            this.stage.addChild(text);
        },

        update: function() {
            this.rgbfilter.blue.x = Math.random() * 10 + 10;
            this.rgbfilter.blue.y = Math.random() * 1 + 10;
            this.rgbfilter.red.x = Math.random() * 3 + 2;
            this.rgbfilter.red.y = Math.random() * 1 + 10;
            this.rgbfilter.green.x = Math.random() * (-5) + 10;
            this.rgbfilter.green.y = Math.random() * 5 + 10;

            this.pixelatefilter.size.x = Math.random() * 4 + 3;
            this.pixelatefilter.size.y = Math.random() * 2 + 3;
        },

        keyup: function(key) {
            if (key == 'SPACE') {
                game.system.setScene('Main');
            }
        }
    });
});
