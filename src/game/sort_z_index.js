game.module('game.sort_z_index')
.body(function() {
    game.sortZIndex = function() {    
        game.scene.stage.children.sort(function(a,b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex;
        });
    };
});