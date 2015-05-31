game.module('game.sphere_fragment')
.require('game.b2dvec')
.body(function() {
    game.addAsset('crystal.png');

    game.createClass('SphereFragment', {
        init: function(x, y, width, height, angle) {
            this.sprite = new game.Sprite('crystal.png', x, y, 
                {
                    width: width, 
                    height: height,
                    anchor: {
                        x: 0.5,
                        y: 0
                    }
                });

            game.scene.addObject(this);
            this.sprite.addTo(game.scene.stage);

            //create a body using a body definition
            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = game.b2dvec(x, y);
            bodyDef.angle = angle;
            bodyDef.allowSleep = false;
            bodyDef.type = game.Box2D.Body.b2_kineticBody;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);

            //and the fixture
            var fixtureDef = new game.Box2D.FixtureDef;
            var box2DPoints = [
                game.b2dvec(0, 0),
                game.b2dvec(width/2,height),
                game.b2dvec(-width/2,height)
            ];
            fixtureDef.shape = new game.Box2D.PolygonShape.AsVector(box2DPoints, box2DPoints.length);
            //density has influence on collisions
            fixtureDef.density = 0;       
            //A higher friction makes the body slow down on contact and during movement. (normal range: 0-1). 
            fixtureDef.friction = 0.5;      
            //=Bounciness (range: 0-1).
            fixtureDef.restitution = 0.1;
            var fragment_fixture = this.body.CreateFixture(fixtureDef);
            fragment_fixture.SetUserData("SphereFragment");
        },
        update: function(){
            //The box2D world keeps track of the movement and position of the body.
            //use the update function to get the sprite in the right spot
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);
        }
    });
});
