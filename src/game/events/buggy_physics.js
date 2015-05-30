game.module('game.events.buggy_physics')
.body(function() {
    var changePosition = function(body, change) {
        return function() {
            var oldPosition = body.GetPosition();
            var newPosition = new game.Box2D.Vec2(
                oldPosition.x + change.x, 
                oldPosition.y + change.y);
            body.SetPosition(newPosition);
        };
    };

    var random = function(min, max, difficulty) {
        return (min + Math.random() * difficulty) - (max - min);
    }

    game.createClass('BuggyPhysics', {
        init: function(difficulty) {
            for (var i = game.scene.Box2Dworld.m_bodyList; i; i = i.m_next) {
                if (Math.random() < 0.1) {
                    var body = i;
                    var change = {
                        x: random(5, 100, difficulty) * game.Box2D.SCALE,
                        y: random(5, 100, difficulty) * game.Box2D.SCALE
                    };
                    changePosition(body, change)();                    
                    
                    var undoChange = {
                        x: -change.x,
                        y: -change.y
                    };
                    setTimeout(changePosition(body, undoChange), 50 + Math.random()*difficulty*100);
                }
            }
        }
    });
});