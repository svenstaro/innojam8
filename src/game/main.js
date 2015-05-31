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
            this.gravity = 6000;

            this.camera = new game.Camera();
            this.camera.addTo(game.scene.stage);
            this.transitionShake = 0;

            this.screenBlend = new game.Graphics();
            this.screenBlend.beginFill(0xFFFFFF, 1);
            this.screenBlend.drawRect(0, 0, game.system.width, game.system.height);
            this.screenBlend.endFill();
            this.screenBlend.zIndex = 20;
            game.scene.stage.addChild(this.screenBlend);

            highscore = game.storage.get('highscore');
            if (typeof(highscore) == 'undefined') {
                highscore = 0;
                game.storage.set('highscore', highscore);
            }

            //var gravity = new game.Box2D.Vec2(0, this.gravity * game.Box2D.SCALE);// gravity pull x, y
            var gravity = new game.Box2D.Vec2(0, 0);
            this.Box2Dworld = new game.Box2D.World(gravity, false);

            this.player = new game.Player(game.system.width/2, 200, 50, 100);

            this.sphere = new game.WorldSphere(game.system.width/2, game.system.height/2 + 400, 400);

            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = game.b2dvec(0, -300);            
            bodyDef.type = game.Box2D.Body.b2_staticBody;

            var wall = game.scene.Box2Dworld.CreateBody(bodyDef);
            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                game.system.width * game.Box2D.SCALE,
                100 * game.Box2D.SCALE
            );
            fixtureDef.density = 250;     // density has influence on collisions
            fixtureDef.friction = 0;  // A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0.5; // => Bounciness (range: 0-1).

            wall.CreateFixture(fixtureDef);

            this.scoreText = new game.PIXI.Text(score, {font: '50px ibmfont', fill: '#f0a'});
            this.scoreText.zIndex = 30;
            this.scoreText.position = {x: 20, y: 10};
            this.stage.addChild(this.scoreText);

            this.highscoreText = new game.PIXI.Text(score, {font: '40px ibmfont', fill: '#f0a'});
            this.highscoreText.zIndex = 30;
            this.highscoreText.position = {x: 20, y: 60};
            this.stage.addChild(this.highscoreText);

            this.difficultyText = new game.PIXI.Text("Stage: " + this.difficulty, {font: '50px ibmfont', fill: '#f0a'});
            this.difficultyText.zIndex = 30;
            this.difficultyText.position = {x: game.system.width - this.difficultyText.width -60, y: 10};
            this.stage.addChild(this.difficultyText);

            this.difficultyTransitionText = new game.PIXI.Text("", {font: '100px ibmfont', fill: '#f0a'});
            this.difficultyTransitionText.position = {x: game.system.width/2 - 400, y: game.system.height/2 - 400};
            this.difficultyTransitionText.zIndex = 10;
            this.stage.addChild(this.difficultyTransitionText);

            var bg = new game.Sprite('background.png')
            bg.zIndex = 100;
            this.stage.addChild(bg);

            this.eventmaster = new game.EventMaster();

            game.scene.addObject(this.eventmaster);

            game.sortZIndex();

            var that = this;
            setTimeout(function() {that.difficultyTransition() }, 1000);
        },

        update: function() {
            this._super();

            var delta = game.system.delta;
            this.timeInScene += delta;
            var new_difficulty = 1 + Math.floor(this.timeInScene / 10);
            if (this.difficulty !== new_difficulty) {
                this.difficulty = new_difficulty;
                this.difficultyTransition();
            }
            score = Math.floor(this.timeInScene * 100) / 100;

            this.scoreText.setText("Time: " + score);
            this.highscoreText.setText("Highscore: " + Math.floor(highscore * 100)/100);
            this.difficultyText.setText("Stage: " + this.difficulty);

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

            var cam_shake = 5 * this.difficulty + this.transitionShake;
            this.camera.offset.x = (game.system.width / 2) + Math.random() * cam_shake - cam_shake / 2;
            this.camera.offset.y = (game.system.height / 2) + Math.random() * cam_shake - cam_shake / 2;
        },

        difficultyTransition: function() {
            this.difficultyTransitionText.setText("New stage " + this.difficulty);
            this.difficultyTransitionText.alpha = 1;
            this.screenBlend.alpha = 1;
            this.transitionShake = 50;

            var tween_text = new game.Tween(this.difficultyTransitionText);
            tween_text.to({'alpha': 0}, 2000);
            tween_text.easing('Exponential.InOut');
            tween_text.delay(1000);
            tween_text.start();

            var tween_shake = new game.Tween(this);
            tween_shake.to({'transitionShake': 0}, 1000);
            tween_shake.easing('Exponential.InOut');
            tween_shake.start();

            var tween_screen = new game.Tween(this.screenBlend);
            tween_screen.to({'alpha': 0}, 3000);
            tween_screen.easing('Quadratic.InOut');
            tween_screen.start();
        },

        gameOver: function() {
            if (score > highscore) {
                highscore = score;
                game.storage.set('highscore', score);
            }
            game.system.setScene('GameOver', false);
        },

        keydown: function(key) {
            // Pass keydown event to player
            this.player.keydown(key);
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
            this.player.keyup(key);
            if (key === 'E') {
                game.system.setScene('MainMenu', false);
            }
        }

    });

});
