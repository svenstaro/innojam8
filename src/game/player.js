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
            this.speed = 100;
            game.scene.addObject(this);
            this.sprite.addTo(game.scene.stage);

            //create a body using a body definition
            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = new game.Box2D.Vec2(
                this.sprite.position.x * game.Box2D.SCALE,
                this.sprite.position.y * game.Box2D.SCALE
            ); 
            bodyDef.type = game.Box2D.Body.b2_dynamicBody;
            bodyDef.allowSleep = false;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);
            //and the fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                this.sprite.width / 2 * game.Box2D.SCALE,
                this.sprite.height / 2 * game.Box2D.SCALE
            );
            fixtureDef.density = 4;       //density has influence on collisions
            fixtureDef.friction = 0.5;      //A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.restitution = 0;   //=Bounciness (range: 0-1).
            this.body.CreateFixture(fixtureDef);
        },

        update: function() {
            //The box2D world keeps track of the movement and position of the body.
            //use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);

            if(game.keyboard.down("UP")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, -this.speed * game.Box2D.SCALE));
            }
            if(game.keyboard.down("DOWN")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.body.GetLinearVelocity().x, this.speed * game.Box2D.SCALE));
            }
            if(game.keyboard.down("LEFT")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(-this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
            }
            if(game.keyboard.down("RIGHT")){
                this.body.SetLinearVelocity(new game.Box2D.Vec2(this.speed * game.Box2D.SCALE, this.body.GetLinearVelocity().y));
            }
        },
        coordinate: function(x, y){
            return game.b2dvec(Math.round(x-this.sprite.width/2), Math.round(y-this.sprite.height/2));
        }
    });
});