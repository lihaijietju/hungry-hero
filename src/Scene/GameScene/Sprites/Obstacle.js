/**
 * Created by lihaijie on 17/4/4.
 * 障碍物对象
 */
var Obstacle = cc.Sprite.extend({
        alreadyHit: false,
        ctor: function (type, speed) {
            this._super();
            this.reuse(type, speed);
            return true;
        }
        ,
        reuse: function (type, speed) {
            this.setSpriteFrame("obstacle" + type + ".png");
            this.speed = speed;
            this.type = type;
        }
        ,
        unuse: function () {
            this.stopAllActions();
            this.setRotation(0);
        }
        ,
    })
    ;

Obstacle.create = function (type, speed) {
    if (cc.pool.hasObject(Obstacle)) {
        return cc.pool.getFromPool(Obstacle, type, speed);
    } else {
        return new Obstacle(type, speed);
    }
}
