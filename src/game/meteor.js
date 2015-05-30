game.module('game.meteor')
.require('game.b2dvec')
.body(function() {
    game.addAsset('meteor.png');

    game.createClass('Meteor', {
        init: function(x, y, size, velocity) {
            this.sprite = new game.Sprite('meteor.png', x, y, {width: size, height: size, anchor: {x: 0.5, y: 0.5}});
            this.sprite.addTo(game.scene.stage);
            game.scene.addObject(this);

            var bodyDef = new game.Box2D.BodyDef();
            bodyDef.position = game.b2dvec(this.sprite.position.x, this.sprite.position.y);
            bodyDef.type = game.Box2D.Body.b2_dynamicBody;
            this.body = game.scene.Box2Dworld.CreateBody(bodyDef);

            var fixtureDef = new game.Box2D.FixtureDef;
            fixtureDef.shape = new game.Box2D.PolygonShape.AsBox(
                this.sprite.width / 2 * game.Box2D.SCALE,
                this.sprite.height / 2 * game.Box2D.SCALE
            );
            fixtureDef.density = size;
            fixtureDef.friction = 0.1;
            fixtureDef.restitution = 0;
            this.body.CreateFixture(fixtureDef);
            this.body.SetLinearVelocity(game.b2dvec(velocity.x, velocity.y));
        },
        update: function() {
            var p = this.body.GetPosition();
            this.sprite.position.x = p.x / game.Box2D.SCALE;
            this.sprite.position.y = p.y / game.Box2D.SCALE;
            this.sprite.rotation = this.body.GetAngle().round(2);
        }
    });
});