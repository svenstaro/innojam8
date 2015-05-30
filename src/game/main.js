game.module(
    'game.main'
)
.require('plugins.box2d')
.require('game.game_over')
.require('game.main_menu')
.require('game.worldsphere')
.require('game.sphere_fragment')
.require('game.player')
.body(function() {
    game.addAsset('logo.png');
    game.addAsset('background.png');

    game.createScene('Main', {
        backgroundColor: 0x111111,

        init: function() {
            score = 0;
            highscore = game.storage.get('highscore');
            if (typeof(highscore) == 'undefined') {
                highscore = 0;
                game.storage.set('highscore', highscore);
            }

            var gravity = new game.Box2D.Vec2(0, 100 * game.Box2D.SCALE);// gravity pull x, y
            this.Box2Dworld = new game.Box2D.World(gravity, true);

            this.player = new game.Player(game.system.width/2, 100);

            this.sphere = new game.WorldSphere(game.system.width/2, game.system.height/2 + 600, 500);

            this.scoreText = new game.PIXI.Text(score, {font: '20px Arial', fill: '#f0a'});
            this.scoreText.position = {x: 10, y: 10};
            this.stage.addChild(this.scoreText);

            var bg = new game.Sprite('background.png')
            bg.zIndex = 100;
            this.stage.addChildAt(bg, this.stage.children.length -1);

            this.updateLayersOrder();
        },

        updateLayersOrder: function() {
            this.stage.children.sort(function(a,b) {
                a.zIndex = a.zIndex || 0;
                b.zIndex = b.zIndex || 0;
                return b.zIndex - a.zIndex;
            });
        },

        update: function() {
            this._super();

            score += game.system.delta;
            this.scoreText.setText(Math.floor(score * 100)/100);

            //The following code is needed to update the time in the box2d world.
            //The values below are fine as default values, feel free to look up more info in the reference.
            this.Box2Dworld.Step(
                game.system.delta, //time elapsed
                6,  //world Velocity Iterations
                6   //world Position Iterations             
            );
            //The world has been updated. Now get rid of forces that had been set during the previous cicle.
            this.Box2Dworld.ClearForces();

            if (this.player.sprite.position.y > game.system.height) {
                this.gameOver();
            }
        },

        gameOver: function() {
            score = Math.floor(score*100)/100
            if (score > highscore) {
                highscore = score;
                game.storage.set('highscore', score);
            }
            game.system.pause();
            game.system.setScene('GameOver', false);
        },

        keydown: function(key) {
            if (key === 'SPACE') {
                // Space key down
            }
        },

        keyup: function(key) {
            if (key === 'SPACE') {
                this.gameOver();
                // Space key up
            }
        }

    });

});
