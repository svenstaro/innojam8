game.module(
    'game.main'
)
.require('game.game_over')
.require('game.worldsphere')
.require('game.player')
.body(function() {
    game.addAsset('logo.png');

    game.createScene('Main', {
        backgroundColor: 0xb9bec7,

        init: function() {
            this.worldsphere = new game.WorldSphere(100, 100, 50);
            this.player = new game.Player(500, 500);

            // Create physics world
            this.world = new game.World();

            // Create new body
            var body = new game.Body();

            // Set body position
            body.position.x = 200;
            body.position.y = 200;

            // Set body mass, so it will fall
            body.mass = 1;

            // Create new shape with size of 100px x 100px
            var shape = new game.Rectangle(100, 100);

            // Add shape to body
            body.addShape(shape);

            // Add body to world
            this.world.addBody(body);

            this.entities = game.pool.create('MainPool');
            // game.pool.put('MainPool', meinobject);
        },

        update: function() {
            // Check if key is currently down
            if (game.keyboard.down('SPACE')) {
                // Space is down
            }
            this._super();
        },

        keydown: function(key) {
            if (key === 'SPACE') {
                // Space key down
            }
        },

        keyup: function(key) {
            if (key === 'SPACE') {
                // Space key up
            }
        }
    });

});
