game.module('game.player')
.require('game.b2dvec')
.body(function(){ 
    game.createClass('Player', {
        init: function(x, y, w, h) {
            this.sprite = new game.Sprite('movement.png', x, y, {
                width: w, 
                height: h,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            });

            // Animation reels -----
            // Create spritesheet
            var spritesheet = new game.SpriteSheet('movement.png', 200, 400);

            this.animReels = [
                { reel: "idleAnim_right", anim: spritesheet.anim(1, 2) },
                { reel: "idleAnim_left", anim: spritesheet.anim(1, 3) },
                { reel: "moveAnim_right", anim: spritesheet.anim(2, 7) },
                { reel: "moveAnim_left", anim: spritesheet.anim(2, 0) },
                { reel: "moveAnim_up", anim: spritesheet.anim(2, 4) },
            ];

            for (var i = this.animReels.length - 1; i >= 0; i--) {
                var curAnim = this.animReels[i].anim;
                curAnim.animationSpeed = 0.8;
                curAnim.play();
                curAnim.addTo(game.scene.stage);
                curAnim.visible = false;
                curAnim.scale.set((w / 200), (h / 400));
            };

            this.setAnim("moveAnim_right");
            // ----- Animation reels

            // Player properties
            this.speed = 900;
            this.numberOfContacts = 0;
            this.isGrounded = false;

            game.scene.addObject(this);

            // Create box2d body
            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = new game.Box2D.Vec2(
                x * game.Box2D.SCALE,
                y * game.Box2D.SCALE
            ); 
            
            bodyDef.type = game.Box2D.Body.b2_dynamicBody;
            bodyDef.allowSleep = false;
            bodyDef.fixedRotation = true;

            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
            
            // Create box2d fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                w * game.Box2D.SCALE,
                (h-w/2) * game.Box2D.SCALE
            );
            fixtureDef.density = 70;     // density has influence on collisions
            fixtureDef.friction = 0.5;  // A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0; // => Bounciness (range: 0-1).

            this.player_fixture = this.body.CreateFixture(fixtureDef);
            this.player_fixture.SetUserData("PlayerMainFixture");

            var sensorFixtureDef = new game.Box2D.FixtureDef;
            sensorFixtureDef.shape = new game.Box2D.CircleShape(w * 1.1 * game.Box2D.SCALE);
            sensorFixtureDef.density = 100;
            sensorFixtureDef.friction = 0.8;
            sensorFixtureDef.restitution = 0;
            this.sensor_fixture = this.body.CreateFixture(sensorFixtureDef);
            this.sensor_fixture.SetUserData("PlayerSensor");
            this.sensor_fixture.GetShape().SetLocalPosition(new game.Box2D.Vec2(0, (h - w) * game.Box2D.SCALE));

            this.body.SetUserData(this);
        },

        update: function() {
            // The box2D world keeps track of the movement and position of the body.
            // use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);

            for (var i = this.animReels.length - 1; i >= 0; i--) {
                this.animReels[i].anim.position.x = p.x / game.Box2D.SCALE;
                this.animReels[i].anim.position.y = p.y / game.Box2D.SCALE;
                this.animReels[i].anim.rotation = this.body.GetAngle().round(2);
            };

            var vel = this.body.GetLinearVelocity();
            var pos = this.body.GetPosition();     

            if(game.keyboard.down("RIGHT") || game.keyboard.down("D")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
                this.setAnim("moveAnim_right");
            }
            else if(game.keyboard.down("LEFT") || game.keyboard.down("A")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(-this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
                this.setAnim("moveAnim_left");
            }
            else {
                this.body.SetLinearVelocity(new game.Box2D.Vec2(vel.x * 0.8, vel.y));
                if (this.isGrounded) {
                    this.setAnim("idleAnim_right");
                } else {
                    this.setAnim("moveAnim_up");
                }
            }

            this.body.ApplyForce(new game.Box2D.Vec2(0, game.scene.gravity), this.body.GetWorldCenter());
        },

        setAnim: function(animName) {
            if (this.anim != null) {
                this.anim.visible = false;
            }
            for (var i = this.animReels.length - 1; i >= 0; i--) {
                if (this.animReels[i].reel === animName) {
                    this.anim = this.animReels[i].anim;
                    this.anim.visible = true;
                    break;
                }
            };
        },
        
        keydown: function(key) {
            if (key === "SPACE" || key === "W" || key === "UP") {
                if (this.numberOfContacts > 0) {
                    this.jump();
                }
            }
        },

        keyup: function(key) {
            if (key === "SPACE" || key === "W" || key === "UP") {
                if (this.body.GetLinearVelocity().y < -4) {
                    this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -4));
                }
            }
        },

        jump: function() {
            this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -18));
        }
    });
});
