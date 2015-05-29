game.module('game.player').body(function(){ 
    game.createClass('Player', {
        init: function(x, y) {
            this.position = {x: x, y: y};
            this.size = 1;

            var graphics = new game.Graphics();
            graphics.lineStyle(2, 0xFF0000);
            graphics.beginFill(0xDD3333);
            graphics.drawRect(x, y, 25*this.size, 50*this.size);
            graphics.endFill();
            game.scene.stage.addChild(graphics);
        },

        update: function() {
        }
    });
});