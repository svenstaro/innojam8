game.module('game.sphere_fragment')
.require('game.b2dvec')
.body(function() {
    game.addAsset('sphere_fragment.png');

    game.createClass('SphereFragment', {
        init: function(x, y, width, height, angle) {
            this.sprite = new game.Sprite('sphere_fragment.png', x, y, 
                {
                    width: width, 
                    height: height,
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
                (this.sprite.position.y + this.sprite.height) / 2 * game.Box2D.SCALE
            ); 
            bodyDef.angle = angle;
            bodyDef.type = game.Box2D.Body.b2_staticBody;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);

            //and the fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            var box2DPoints = [
                this.coordinate(0, 0),
                this.coordinate(width,0),
                this.coordinate(width/2,height)
            ];
            fixtureDef.shape = new game.Box2D.PolygonShape.AsVector(box2DPoints, box2DPoints.length);
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
            return game.b2dvec(Math.round(x-this.sprite.width/2), 
                Math.round(y-this.sprite.height/2));
        }
    });
});