game.module(
    'game.main'
)
.body(function() {
    game.addAsset('logo.png');

    game.createClass('WorldSphere', {
        init: function(x, y, radius) {
            this.position = {x: x, y: y};
            this.radius = radius;

            var graphics = new game.Graphics()
            graphics.lineStyle(2, 0xFF0000);
            graphics.beginFill(0xDD3333);
            graphics.drawCircle(x, y, radius);
            graphics.endFill();
            game.scene.stage.addChild(graphics);
        },

        update: function() {
        }
    });

    game.createScene('Main', {
        backgroundColor: 0xb9bec7,

        init: function() {
            var worldsphere = new game.WorldSphere(100, 100, 50);

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
