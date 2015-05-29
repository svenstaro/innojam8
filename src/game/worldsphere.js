game.module('game.worldsphere').body(function(){ 
    game.createClass('WorldSphere', {
        init: function(x, y, radius) {
            this.position = {x: x, y: y};
            this.radius = radius;

            var graphics = new game.Graphics();
            graphics.lineStyle(2, 0xFF0000);
            graphics.beginFill(0xDD3333);
            graphics.drawCircle(x, y, radius);
            graphics.endFill();
            game.scene.stage.addChild(graphics);
        },

        update: function() {
        }
    });
});