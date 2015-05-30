game.module('game.player')
.require('game.b2dvec')
.body(function(){ 
    game.createClass('Player', {
        init: function(x, y, width) {
            this.sprite = new game.Sprite('logo.png', x, y, {
                width: width, 
                height: width*2,
                anchor: {
                    x: 0.5,
                    y: 0.5
                }
            });

            // Player properties
            this.speed = 100;

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
            fixtureDef.density = 4;       //density has influence on collisions
            fixtureDef.friction = 0.5;      //A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0;   //=Bounciness (range: 0-1).
            this.body.CreateFixture(fixtureDef);

            fixtureDef.density = 0.1;   // density has influence on collisions
            fixtureDef.friction = 0.5;  // A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0; // == Bounciness (range: 0-1).
            var player_fixture = this.body.CreateFixture(fixtureDef);
            player_fixture.SetUserData("PlayerMainFixture");

            var sensorFixtureDef = new game.Box2D.FixtureDef;

            sensorFixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                (this.sprite.width / 2) * game.Box2D.SCALE,
                this.sprite.height / 10 * game.Box2D.SCALE
            );
            for (var i = sensorFixtureDef.shape.m_vertices.length - 1; i >= 0; i--) {
                sensorFixtureDef.shape.m_vertices[i].y += fixtureDef.shape.m_vertices[3].y;
            };
            sensorFixtureDef.isSensor = true;
            sensorFixtureDef.density = 0.001;
            sensorFixtureDef.friction = 0;
            sensorFixtureDef.restitution = 0;
            var sensor_fixture = this.body.CreateFixture(sensorFixtureDef);
            sensor_fixture.SetUserData("PlayerSensor");
        },

        update: function() {
            //The box2D world keeps track of the movement and position of the body.
            //use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);

            if(game.keyboard.down("RIGHT") || game.keyboard.down("D")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
                // this.body.
            }
            else if(game.keyboard.down("LEFT") || game.keyboard.down("A")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(-this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
            }
            else {
                this.body.SetLinearVelocity(new game.Box2D.Vec2(0, this.body.GetLinearVelocity().y));
            }

            if (game.keyboard.down("SPACE") || game.keyboard.down("W") || game.keyboard.down("UP")) {
                if (this.isSensorContacting()) {
                    this.jump();
                }
            }
            else if(this.body.GetLinearVelocity().y < 0) {
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, 0));
            }
        },

        coordinate: function(x, y) {
            return game.b2dvec(Math.round(x-this.sprite.width/2), Math.round(y-this.sprite.height/2));
        },

        jump: function() {
            this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -100));
        },

        isSensorContacting: function() {
            var playerContact = this.body.GetContactList();

            for (var c = game.scene.Box2Dworld.GetContactList(); c ; c = c.GetNext())
            {
                if (c.GetFixtureA().GetUserData() == "PlayerSensor" || c.GetFixtureB().GetUserData() == "PlayerSensor") {
                    console.log(c);
                    return true;
                }
            }
            return false;
        }
    });
});