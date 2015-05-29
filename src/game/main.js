game.module(
    'game.main'
)
.require('plugins.box2d')
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

            this.entities = game.pool.create('MainPool');
            // game.pool.put('MainPool', meinobject);
        },

        update: function() {
            // Check if key is currently down
            if (game.keyboard.down('SPACE')) {
                // Space is down
            }
            this._super();
            this.player.update();
        },

        keydown: function(key) {
            this.player.keydown(key);
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
