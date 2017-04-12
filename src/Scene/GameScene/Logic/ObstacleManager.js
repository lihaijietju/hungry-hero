/**
 * Created by lihaijie on 17/4/4.
 * 处理障碍物逻辑
 */

var ObstacleManager = cc.Class.extend({
    _container: null,
    _gameScene: null,
    //储存障碍物的数组
    _obstacleToAnimate: null,
    _obstacleGapCount: 0,

    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._obstacleToAnimate = new Array();
    },

    init: function () {
        //清除场景所有障碍物
        this.removeAll();
        Game.user.hitObstacle = 0;
    },

    removeAll: function () {
        if (this._obstacleToAnimate.length > 0) {
            for (var i = 0; i < this._obstacleToAnimate.length; i++) {
                var item = this._obstacleToAnimate[i];
                this._obstacleToAnimate.splice(i, 1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },
    update: function (hero, elapsed) {
        if (this._obstacleGapCount < GameConstants.OBSTACLE_GAP) {
            this._obstacleGapCount += Game.user.heroSpeed * elapsed;
        } else if (this._obstacleGapCount != 0) {
            this._obstacleGapCount = 0;
            this._createObstacle(Math.ceil(Math.random() * 4));
        }
        this._animateObstacleItems(hero, elapsed);
    },
    _createObstacle: function (type) {
        var size = cc.winSize;
        var x = size.width;
        var y = 0;

        var position = null;

        if (size.height / (parseInt(Math.random() * 10 + 1)) < GameConstants.GAME_AREA_TOP_BOTTOM) {
            y = (size.height / parseInt((Math.random() * 10 + 1))) + GameConstants.GAME_AREA_TOP_BOTTOM;
        }

        if (size.height / (parseInt(Math.random() * 10 + 1)) >= (size.height - GameConstants.GAME_AREA_TOP_BOTTOM)) {
            y = (size.height / parseInt((Math.random() * 10 + 1))) - GameConstants.GAME_AREA_TOP_BOTTOM;
        }
        if (y < GameConstants.GAME_AREA_TOP_BOTTOM) {
            y = size.height / 2;
        }
        var obstacle = Obstacle.create(type, GameConstants.OBSTACLE_SPEED);
        obstacle.x = x + obstacle.width / 2;
        obstacle.y = y;
        obstacle.alreadyHit = false;
        this._obstacleToAnimate.push(obstacle);
        this._container.addChild(obstacle);
    },
    _animateObstacleItems: function (hero, elapsed) {
        var item;

        for (var i = 0; i < this._obstacleToAnimate.length; i++) {
            item = this._obstacleToAnimate[i];

            if (item) {
                item.x -= (Game.user.heroSpeed + item.speed) * elapsed;
                if (item.x < -item.width || Game.gameState == GameConstants.GAME_STATE_OVER) {
                    this._obstacleToAnimate.splice(i, 1);
                    cc.pool.putInPool(item);
                    this._container.removeChild(item);
                    continue;
                } else {

                    //进行碰撞检测
                    var heroItem_xDist = item.x - hero.x;
                    var heroItem_yDist = item.y - hero.y;

                    var heroItem_sqDist = heroItem_xDist * heroItem_xDist + heroItem_yDist * heroItem_yDist;
                    if (heroItem_sqDist < 5000 && !item.alreadyHit) {
                        item.alreadyHit = true;
                        //检测到碰撞
                        Sound.playHit();
                        if (Game.user.coffee > 0) {
                            Game.user.heroSpeed *= 0.8;
                        }
                        else {
                            Game.user.hitObstacle = 30;
                            // Reduce hero's speed.
                            Game.user.heroSpeed *= 0.5;
                            // Play hurt sound.
                            Sound.playHurt();
                            // Update lives.
                            Game.user.lives--;
                        }
                    }

                    if (Game.user.lives < 1) {
                        Game.user.lives = 0;
                        this._gameScene.endGame();
                    }
                }
            }
        }
    }
})
