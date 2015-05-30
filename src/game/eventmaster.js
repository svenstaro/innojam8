game.module('game.eventmaster')
.require('game.events.meteorshower')
.require('game.events.rotate')
.body(function() {
    game.createClass('EventMaster', {
        events: [],
        timeSinceLastEvent: 0,
        eventLimit: 2,

        init: function() {
            
        },

        update: function() {
            delta = game.system.delta;
            this.timeSinceLastEvent += delta;
            //var event_chance = Math.floor((Math.random() * 10000 * delta - this.timeSinceLastEvent * 100) + 1);
            var event_chance = Math.max(1, Math.floor((Math.random() * 80000 * delta - this.timeSinceLastEvent * 100) + 1));
            if (event_chance === 1 && this.events.length < this.eventLimit) {
                this.timeSinceLastEvent = 0;
                var event_type = Math.floor(Math.random() * 10) + 1;
                if (event_type === 1)
                    new game.Meteorshower(game.scene.difficulty);
                else if (event_type === 2)
                    new game.Rotate(game.scene.difficulty);
            }
        },
    });
});
