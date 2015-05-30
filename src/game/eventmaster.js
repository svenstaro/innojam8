game.module('game.eventmaster')
.require('game.events.meteorshower')
.require('game.events.rotate')
.body(function() {
    game.createClass('EventMaster', {
        events: [],
        timeSinceLastEvent: 0,

        init: function() {
            
        },

        update: function() {
            delta = game.system.delta;
            console.log(delta);
        }
    });
});
