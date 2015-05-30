game.module('game.eventmaster')
.require('game.events.meteorshower')
.require('game.events.rotate')
.require('game.events.buggy_physics')
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
                var events = [game.Meteorshower, game.Rotate, game.BuggyPhysics];
                var event_type = Math.floor(Math.random() * events.length);

                new events[event_type](game.scene.difficulty); 
            }
        },
    });
});
