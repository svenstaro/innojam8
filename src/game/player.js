game.module('game.player')
.require('game.b2dvec')
.body(function(){ 
    game.createClass('Player', {
        init: function(x, y, w, h) {
            this.sprite = new game.Sprite('logo.png', x, y, {
                width: w, 
                height: h,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            });

            // Player properties
            this.speed = 300;
            this.isGrounded = false;
            this.groundedExpireTime = 0;

            game.scene.addObject(this);
            this.sprite.addTo(game.scene.stage);

            // Create box2d body
            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = new game.Box2D.Vec2(
                this.sprite.position.x * game.Box2D.SCALE,
                this.sprite.position.y * game.Box2D.SCALE
            ); 
            
            bodyDef.type = game.Box2D.Body.b2_dynamicBody;
            bodyDef.allowSleep = false;
            bodyDef.fixedRotation = true;

            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
            
            // Create box2d fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                this.sprite.width / 2 * game.Box2D.SCALE,
                this.sprite.height / 2 * game.Box2D.SCALE
            );
            fixtureDef.density = 300;     // density has influence on collisions
            fixtureDef.friction = 0;  // A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0; // => Bounciness (range: 0-1).

            this.player_fixture = this.body.CreateFixture(fixtureDef);
            this.player_fixture.SetUserData("PlayerMainFixture");

            var sensorFixtureDef = new game.Box2D.FixtureDef;
            sensorFixtureDef.shape = new game.Box2D.CircleShape(this.sprite.width / 2 * game.Box2D.SCALE);
            // sensorFixtureDef.isSensor = true;
            sensorFixtureDef.density = 300;
            sensorFixtureDef.friction = 0.8;
            sensorFixtureDef.restitution = 0;
            this.sensor_fixture = this.body.CreateFixture(sensorFixtureDef);
            this.sensor_fixture.SetUserData("PlayerSensor");
            this.sensor_fixture.GetShape().SetLocalPosition(new game.Box2D.Vec2(0, this.sprite.height / 2 * game.Box2D.SCALE));
        },

        update: function() {
            // The box2D world keeps track of the movement and position of the body.
            // use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);

            var vel = this.body.GetLinearVelocity();
            var pos = this.body.GetPosition();     

            if(game.keyboard.down("RIGHT") || game.keyboard.down("D")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
            }
            else if(game.keyboard.down("LEFT") || game.keyboard.down("A")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(-this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
            }
            else {
                this.body.SetLinearVelocity(new game.Box2D.Vec2(vel.x * 0.8, vel.y));
            }

            this.groundedExpireTime -= 1000 * game.system.delta;

            this.isGrounded = this.isSensorContacting();
            if (game.keyboard.down("SPACE") || game.keyboard.down("W") || game.keyboard.down("UP")) {
                if (this.isGrounded && this.groundedExpireTime <= 0) {
                    this.body.ApplyImpulse(new game.Box2D.Vec2(0, -500), this.body.GetLocalCenter());
                    this.isGrounded = false;
                    this.groundedExpireTime = 100;
                }
            }
            // else if(this.body.GetLinearVelocity().y < 0) {
            //     this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, 0));
            // }
        },

        isSensorContacting: function() {
            var playerContact = this.body.GetContactList();

            for (var c = game.scene.Box2Dworld.GetContactList(); c ; c = c.GetNext())
            {
                if (c.GetFixtureA().GetUserData() == "PlayerSensor" || c.GetFixtureB().GetUserData() == "PlayerSensor") {
                // if ((c.GetFixtureA().GetUserData() == "PlayerSensor" && c.GetFixtureB().GetUserData() == "SphereFragment") || 
                //     (c.GetFixtureB().GetUserData() == "PlayerSensor" && c.GetFixtureB().GetUserData() == "SphereFragment")) {
                //     console.log(c);
                    return true;
                }
            }
            return false;
        }
    });
});