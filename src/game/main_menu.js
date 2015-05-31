game.module('game.main_menu')
.body(function() {
    game.addAsset('game_name.png');

    game.createScene('MainMenu', {
        init: function() {
            var logo = new game.Sprite('game_name.png');
            logo.addTo(this.stage);

            this.rgbfilter = new game.PIXI.RGBSplitFilter();
            this.pixelatefilter = new game.PIXI.PixelateFilter();
            this.stage.filters = [this.rgbfilter, this.pixelatefilter];

            var text = new game.PIXI.Text('Press SPACE key to play', { font: '60px ibmfont', fill: '#f0a', align: 'center'});
            text.position = {x: game.system.width - text.width - 200, y: game.system.height - text.height - 100};
            this.stage.addChild(text);

            var bg = new game.Sprite('background.png');
            bg.zIndex = 100;
            bg.addTo(this.stage);
            game.sortZIndex();
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
