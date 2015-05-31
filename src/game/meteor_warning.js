game.module('game.meteor_warning')
.require('game.b2dvec')
.body(function() {
    // game.addAsset('meteor.png');

    game.createClass('MeteorWarning', {
        init: function(x, y, size, velocity) {
            this.sprite = new game.Sprite('meteor.png', x, y, {width: size, height: size, anchor: {x: 0.5, y: 0.5}});
            this.sprite.addTo(game.scene.stage);
            game.scene.addObject(this);
            this.velocity = velocity;
            this.size = size;

            this.blinkTime = 3000;
            this.blinkInterval = this.blinkTime / 10;
            this.blinkIntervalElapsed = 0;
            this.getEdgePos();
            console.log(this);
        },

        update: function() {
            this.blinkTime -= 1000 * game.system.delta;
            this.blinkIntervalElapsed += 1000 * game.system.delta;

            if (this.blinkTime <= 0) {
                this.sprite.remove();
                game.scene.removeObject(this);
            }
            // if (this.blinkIntervalElapsed >= this.blinkInterval) {
            //     this.blinkIntervalElapsed = 0;
            //     this.sprite.visible = !this.sprite.visible;
            // }
        },

        getEdgePos: function() {
            var pos = this.sprite.position;
            var fraction = 0;

            // if (pos.x < 0 && pos.y > 0) {
            //     fraction = pos.x / this.velocity.x;
            //     pos.y = this.velocity.y * fraction;
            // } else if (pos.x > game.system.width && pos.y > 0) {
            //     fraction = (pos.x - game.system.width) / this.velocity.x;
            //     pos.y = this.velocity.y * fraction;
            // } else if (pos.y < 0 && pos.x > 0 && pos.x < game.system.width) {
            //     fraction = pos.y / this.velocity.y;
            //     pos.x = this.velocity.x * fraction;
            // }

            if (pos.x < 0) {
                pos.x = 0;
            } else if (pos.x + this.size > game.system.width) {
                pos.x = game.system.width - this.size;
            }
            if (pos.y < 0) {
                pos.y = 0;
            }

            this.sprite.position.x = pos.x;
            this.sprite.position.y = pos.y;
        }
    });
});