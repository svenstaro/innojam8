game.module('game.events.meteorshower')
.require('game.meteor')
.body(function() {
    game.createClass('Meteorshower', {
        counter: 0,

        init: function(difficulty) {
            this.difficulty = difficulty + 1;
            this.waveSize = Math.round(this.difficulty * Math.random() * 3);
            this.spawnMeteor();
        },

        spawnMeteor: function() {
            if (this.counter < this.waveSize) {
                if (!(game.scene.name === 'Main')) {
                    return;
                }
                
                var x = Math.random()*game.system.width;
                var y = -100;

                var targetPosition = game.scene.player.sprite.position;
                targetPosition.x += Math.random()*40/this.difficulty;
                targetPosition.y += Math.random()*40/this.difficulty;
                var velocity = {
                    x: (targetPosition.x - x),
                    y: (targetPosition.y - y)
                }
                var size = 40 + Math.random()*60;

                new game.Meteor(x, y, size, velocity);
                this.counter++;

                var that = this;

                setTimeout(function() {
                    that.spawnMeteor();
                }, 1000);
            }
        }
    });
});
