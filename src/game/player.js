game.module('game.player').body(function(){ 
    game.createClass('Player', {
        init: function(x, y) {
            this.position = {x: x, y: y};
            this.size = 1;
            this.body = new game.Body();
            this.body.mass = 1;
            this.shape = new game.Rectangle(25*this.size, 50*this.size);
            this.body.addShape(this.shape);
            game.scene.world.addBody(this.body);

            this.graphics = new game.Graphics();
            game.scene.stage.addChild(this.graphics);
        },

        update: function() {
            // console.log('player x: ' + this.position.x + ', player y: ' + this.position.y);
            this.graphics.lineStyle(2, 0xFF0000);
            this.graphics.beginFill(0xDD3333);
            this.graphics.drawRect(this.position.x, this.position.y, 25*this.size, 50*this.size);
            this.graphics.endFill();
        },

        keydown: function(key) {
            if (key === 'D') {
                
            } else if (key === 'A') {
                
            }
        }
    });
});