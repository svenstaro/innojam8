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
.require('game.on_screen')
.body(function() {
    game.addAsset('logo.png');
    game.addAsset('background.png');
    //add animation of the grid
    game.addAsset('Grid_sprite_01.png', 'grid1');
    game.addAsset('Grid_sprite_02.png', 'grid2');
    game.addAudio('THA-zweidecker.ogg', 'music1');
    game.Audio.stopOnSceneChange = false;

    game.createScene('Main', {
        backgroundColor: 0x111111,
        name: 'Main',

        init: function() {
            game.system.antialias = true;

            if (!game.audio.isMusicPlaying()) {
                game.audio.playMusic('music1', true);
            }

            this.rgbfilter = new game.PIXI.RGBSplitFilter();
            this.pixelatefilter = new game.PIXI.PixelateFilter();
            this.stage.filters = [this.rgbfilter, this.pixelatefilter];

            this.gridmovement = new game.Animation([game.getTexture('grid1'), game.getTexture('grid2')]);
            this.gridmovement.animationSpeed = 0.05;
            this.gridmovement.play();
            this.gridmovement.position.set(0, 0);
            this.gridmovement.zIndex = 99;
            game.scene.stage.addChild(this.gridmovement);

            score = 0;
            this.difficulty = 1;
            this.timeInScene = 0;
            // Constants
            game.Box2D.SCALE = 0.01;
            this.gravity = 3000;

            highscore = game.storage.get('highscore');
            if (typeof(highscore) == 'undefined') {
                highscore = 0;
                game.storage.set('highscore', highscore);
            }

            var gravity = new game.Box2D.Vec2(0, this.gravity * game.Box2D.SCALE);// gravity pull x, y
            this.Box2Dworld = new game.Box2D.World(gravity, true);

            this.player = new game.Player(game.system.width/2, 200, 50, 100);

            this.sphere = new game.WorldSphere(game.system.width/2, game.system.height/2 + 400, 400);

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

            var delta = game.system.delta;
            this.timeInScene += delta;
            this.difficulty = Math.floor(this.timeInScene / 10);
            score = Math.floor(this.timeInScene * 100) / 100;

            this.scoreText.setText("Time: " + score);
            this.highscoreText.setText("Highscore: " + Math.floor(highscore * 100)/100);
            this.difficultyText.setText("Difficulty: " + this.difficulty);

            //The following code is needed to update the time in the box2d world.
            //The values below are fine as default values, feel free to look up more info in the reference.
            this.Box2Dworld.Step(
                delta, //time elapsed
                6,  //world Velocity Iterations
                6   //world Position Iterations             
            );
            //The world has been updated. Now get rid of forces that had been set during the previous cicle.
            this.Box2Dworld.ClearForces();

            if (!game.onScreen(this.player.sprite.position)) {
                this.gameOver();
            }

            // Corrupt the screen with increasing difficulty
            this.rgbfilter.blue.x = Math.random() * 10 * this.difficulty;
            this.rgbfilter.blue.y = Math.random() * 1 * this.difficulty;
            this.rgbfilter.red.x = Math.random() * 1 * this.difficulty;
            this.rgbfilter.red.y = Math.random() * 1 * this.difficulty;
            this.rgbfilter.green.x = Math.random() * 1 * this.difficulty;
            this.rgbfilter.green.y = Math.random() * 5 * this.difficulty;

            this.pixelatefilter.size.x = Math.random() * 1 * this.difficulty + 1;
            this.pixelatefilter.size.y = Math.random() * 2 * this.difficulty + 1;
        },

        gameOver: function() {
            if (score > highscore) {
                highscore = this.score;
                game.storage.set('highscore', score);
            }
            game.system.setScene('GameOver', false);
        },

        keydown: function(key) {
            // Pass keydown event to player
            this.player.keydown(key);
            if (key === 'SPACE') {
                
            }
            if (key === 'M') {
                game.audio.toggleMusic();
            }
        },

        keyup: function(key) {
            // Pass keyup event to player
            this.player.keyup(key);
            if (key === 'Q') {
                this.gameOver();
            }
        }

    });

});
