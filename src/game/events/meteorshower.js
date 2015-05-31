game.module('game.events.meteorshower')
.require('game.meteor')
.require('game.meteor_warning')
.body(function() {
    game.createClass('Meteorshower', {
        counter: 0,

        init: function(difficulty) {
            this.difficulty = difficulty;
            this.waveSize = Math.round(this.difficulty * Math.random());
            this.spawnMeteor();
        },

        spawnMeteor: function() {
            if (this.counter < this.waveSize) {
                if (!(game.scene.name === 'Main')) {
                    return;
                }
                
                var x;
                var y = -200 + Math.random()*600;
                if (Math.random() > 0.5) {
                    x = -100;
                } else {
                    x = game.system.width + 100;
                }

                var targetPosition = game.scene.player.sprite.position;
                targetPosition.x += Math.random()*200/(this.difficulty);
                targetPosition.y += Math.random()*200/(this.difficulty);
                var speedFactor = 1 + this.difficulty * Math.random();
                var velocity = {
                    x: (targetPosition.x - x) * speedFactor,
                    y: (targetPosition.y - y) * speedFactor
                }
                var size = 40 + Math.random()*60;
                
                new game.MeteorWarning(x, y, size, velocity);

                this.counter++;

                var that = this;
                setTimeout(function() {
                    setTimeout(function() {
                        that.spawnMeteor();
                    }, 1000);
                    new game.Meteor(x, y, size, velocity);
                }, 2000);
            }
        }
    });
});
