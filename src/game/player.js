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
                { reel: "moveAnim_right", anim: spritesheet.anim(2, 8) },
                { reel: "moveAnim_left", anim: spritesheet.anim(1, 2) },
                { reel: "moveAnim_up", anim: spritesheet.anim(2, 4) },
            ];

            for (var i = this.animReels.length - 1; i >= 0; i--) {
                this.animReels[i].anim.animationSpeed = 0.8;
                this.animReels[i].anim.play();
                this.animReels[i].anim.addTo(game.scene.stage);
                this.animReels[i].anim.visible = false;
            };

            this.setAnim("idleAnim_right");
            // ----- Animation reels

            // Player properties
            this.speed = 600;
            this.numberOfContacts = 0;

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
                w / 2 * game.Box2D.SCALE,
                h / 2 * game.Box2D.SCALE
            );
            fixtureDef.density = 250;     // density has influence on collisions
            fixtureDef.friction = 0;  // A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0; // => Bounciness (range: 0-1).

            this.player_fixture = this.body.CreateFixture(fixtureDef);
            this.player_fixture.SetUserData("PlayerMainFixture");

            var sensorFixtureDef = new game.Box2D.FixtureDef;
            sensorFixtureDef.shape = new game.Box2D.CircleShape(w / 2 * game.Box2D.SCALE);
            sensorFixtureDef.density = 100;
            sensorFixtureDef.friction = 0.8;
            sensorFixtureDef.restitution = 0;
            this.sensor_fixture = this.body.CreateFixture(sensorFixtureDef);
            this.sensor_fixture.SetUserData("PlayerSensor");
            this.sensor_fixture.GetShape().SetLocalPosition(new game.Box2D.Vec2(0, h / 2 * game.Box2D.SCALE));

            this.body.SetUserData(this);

            this.sensorContactListener = new game.Box2D.ContactListener();
            game.scene.Box2Dworld.SetContactListener(this.sensorContactListener);
            var that = this;
            this.sensorContactListener.BeginContact = function(contact) {
                var player = getObjectFromFixture("PlayerSensor", contact);
                if (player != null) {
                    that.numberOfContacts++;
                    if (game.keyboard.down('SPACE') || game.keyboard.down('W') || game.keyboard.down('UP')) {
                        that.jump();
                    }
                }
            };
            this.sensorContactListener.EndContact = function(contact) {
                var player = getObjectFromFixture("PlayerSensor", contact);
                if (player != null) {
                    that.numberOfContacts--;
                }
            };
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
                this.setAnim("idleAnim_right");
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
                if (this.body.GetLinearVelocity().y < -5) {
                    this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -5));
                }
            }
        },

        jump: function() {
            this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -14));
        }
    });

    function getObjectFromFixture(userData, contact) {
        var userdata_fixtureA = contact.GetFixtureA().GetUserData();
        var userdata_fixtureB = contact.GetFixtureB().GetUserData();

        var fixture = null;

        if (userdata_fixtureA === userData) {
            fixture = contact.GetFixtureA();
        } else if (userdata_fixtureB === userData) {
            fixture = contact.GetFixtureB();
        }
        if (fixture != null) {
            return fixture.GetBody().GetUserData();
        }
        return null;
    };
});
