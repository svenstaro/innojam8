game.module('game.sphere_fragment')
.body(function() {
    game.addAsset('sphere_fragment.png');

    game.createClass('SphereFragment', {
        init: function() {
            this.sprite = new game.Sprite('sphere_fragment.png', game.system.width/2, game.system.height/2, 
                {
                    width: 200, 
                    height: 300,
                    anchor: {
                        x: 0.5,
                        y: 0.5
                    }
                });
            game.scene.addObject(this);
            this.sprite.addTo(game.scene.stage);

            //create a body using a body definition
            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = new game.Box2D.Vec2(
                (this.sprite.position.x + this.sprite.width) / 2 * game.Box2D.SCALE,
                (this.sprite.position.y + 600 + this.sprite.height) / 2 * game.Box2D.SCALE
            ); 
            bodyDef.type = game.Box2D.Body.b2_staticBody;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);

            //and the fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                this.sprite.width / 2 * game.Box2D.SCALE,
                this.sprite.height / 2 * game.Box2D.SCALE
            );
            //density has influence on collisions
            fixtureDef.density = 0;       
            //A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.friction = 0.5;      
            //=Bounciness (range: 0-1).
            fixtureDef.restitution = 0.1;   
            this.body.CreateFixture(fixtureDef);
        },
        update: function(){
            //The box2D world keeps track of the movement and position of the body.
            //use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);
        },
        coordinate: function(x, y){
            return new game.Box2D.Vec2(Math.round((x-this.sprite.width/2) * game.Box2D.SCALE), 
                Math.round((y-this.sprite.height/2) * game.Box2D.SCALE));
        }
    });
});