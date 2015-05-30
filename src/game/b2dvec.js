game.module('game.b2dvec')
.body(function() {
    game.b2dvec = function(x, y) {
        return new game.Box2D.Vec2(x * game.Box2D.SCALE, y * game.Box2D.SCALE);
    };
});
