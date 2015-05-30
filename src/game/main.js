game.module(
    'game.main'
)
.require('plugins.box2d')
.require('game.game_over')
.require('game.main_menu')
.require('game.worldsphere')
.require('game.sphere_fragment')
.require('game.player')
.require('game.eventmaster')
.require('game.sort_z_index')
.require('game.events.meteorshower')
.require('game.events.rotate')
.body(function() {
    game.addAsset('logo.png');
    game.addAsset('background.png');
    //add animation of the grid
    game.addAsset('Grid_sprite_01.png', 'grid1');
    game.addAsset('Grid_sprite_02.png', 'grid2');

    game.createScene('Main', {
        backgroundColor: 0x111111,
        name: 'Main',

        init: function() {
            this.gridmovement = new game.Animation([game.getTexture('grid1'), game.getTexture('grid2')]);
            this.gridmovement.animationSpeed = 0.05;
            this.gridmovement.play();
            this.gridmovement.position.set(0, 0);
            game.scene.stage.addChild(this.gridmovement);

            score = 0;
            this.difficulty = 0;
            // Constants
            game.Box2D.SCALE = 0.01;
            this.gravity = 1000;

            highscore = game.storage.get('highscore');
            if (typeof(highscore) == 'undefined') {
                highscore = 0;
                game.storage.set('highscore', highscore);
            }

            var gravity = new game.Box2D.Vec2(0, this.gravity * game.Box2D.SCALE);// gravity pull x, y
            this.Box2Dworld = new game.Box2D.World(gravity, true);

            this.player = new game.Player(game.system.width/2, 200, 50, 100);

            this.sphere = new game.WorldSphere(game.system.width/2, game.system.height/2 + 300, 400);

            this.scoreText = new game.PIXI.Text(score, {font: '40px Arial', fill: '#f0a'});
            this.scoreText.position = {x: 10, y: 10};
            this.stage.addChild(this.scoreText);

            this.highscoreText = new game.PIXI.Text(score, {font: '40px Arial', fill: '#f0a'});
            this.highscoreText.position = {x: 10, y: 50};
            this.stage.addChild(this.highscoreText);

            this.difficultyText = new game.PIXI.Text(this.difficulty, {font: '40px Arial', fill: '#f0a'});
            this.difficultyText.position = {x: game.system.width - 300, y: 10};
            this.stage.addChild(this.difficultyText);

            var bg = new game.Sprite('background.png')
            bg.zIndex = 100;
            this.stage.addChild(bg);

            this.eventmaster = new game.EventMaster();

            game.scene.addObject(this.eventmaster);
            game.sortZIndex();
        },

        update: function() {
            this._super();

            score += game.system.delta;
            this.difficulty = Math.floor(game.system.timer.time() / 5000);

            this.scoreText.setText("Time: " + Math.floor(score * 100)/100);
            this.highscoreText.setText("Highscore: " + Math.floor(highscore * 100)/100);
            this.difficultyText.setText("Difficulty: " + this.difficulty);

            //The following code is needed to update the time in the box2d world.
            //The values below are fine as default values, feel free to look up more info in the reference.
            this.Box2Dworld.Step(
                game.system.delta, //time elapsed
                6,  //world Velocity Iterations
                6   //world Position Iterations             
            );
            //The world has been updated. Now get rid of forces that had been set during the previous cicle.
            this.Box2Dworld.ClearForces();

            if (this.player.sprite.position.y > game.system.height + 100
                || this.player.sprite.position.y < -100
                || this.player.sprite.position.x > game.system.width + 100
                || this.player.sprite.position.x < -100) {
                this.gameOver();
            }
        },

        gameOver: function() {
            score = Math.floor(score*100)/100
            if (score > highscore) {
                highscore = this.score;
                game.storage.set('highscore', score);
            }
            game.system.pause();
            game.system.setScene('GameOver', false);
        },

        keydown: function(key) {
            if (key === 'SPACE') {
                
            }
        },

        keyup: function(key) {
            if (key === 'Q') {
                this.gameOver();
            }
        }

    });

});
