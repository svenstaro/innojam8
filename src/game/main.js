game.module(
    'game.main'
)
.body(function() {

    game.addAsset('logo.png');

    game.createScene('Main', {
        backgroundColor: 0xb9bec7,

        init: function() {
            var logo = new game.Sprite('logo.png').center().addTo(this.stage);
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
        },

        update: function() {
            // Check if key is currently down
            if (game.keyboard.down('SPACE')) {
                // Space is down
            }
            this._super();
        }
    });

});
