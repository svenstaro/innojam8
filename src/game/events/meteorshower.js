game.module('game.events.meteorshower')
.require('game.meteor')
.body(function() {
    game.createClass('Meteorshower', {
        counter: 0,

        init: function(waveSize) {
            this.waveSize = waveSize;
            this.spawnMeteor();
        },
        spawnMeteor: function() {
            var x = Math.random()*game.system.width;
            var y = -100;

            var targetPosition = game.scene.player.sprite.position;
            targetPosition.x += Math.random()*20;
            targetPosition.y += Math.random()*20;
            var velocity = {
                x: (targetPosition.x - x)*2,
                y: (targetPosition.y - y)*2
            }
            var size = 40 + Math.random()*60;

            new game.Meteor(x, y, size, velocity);
            this.counter++;

            if (this.counter < this.waveSize) {
                var that = this;

                setTimeout(function() {
                    that.spawnMeteor();
                }, 1000);
            }
        }
    });
});
