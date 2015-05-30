game.module('game.worldsphere')
.require('game.sphere_fragment')
.body(function(){ 
    game.createClass('WorldSphere', {
        init: function(x, y, radius) {
            this.position = {x: x, y: y};
            this.radius = radius;

            var fragmentWidth = 2 * radius  * (Math.sqrt(2) - 1);
            var fragmentHeight = radius

            for (var i = 0; i < 8; i++) {
                var angle = i*(Math.PI/4);
                new game.SphereFragment(x, y, fragmentWidth, fragmentHeight, angle - Math.PI/2);
            }
        },

        update: function() {
        }
    });
});