/**
 * Created by lihaijie on 17/4/4.
 * 游戏主场景
 */
var GameScene = cc.Scene.extend({
    _background: null,
    _gameSceneUI: null,
    _hero: null,
    _touchY: null,
    _gameOverLayer: null,
    itemBatchLayer: null,
    _foodManager: null,
    _obstacleManager: null,

    ctor: function () {
        this._super();

    },
    onEnter: function () {
        this._super();
        var size = cc.winSize;

        var layer = new cc.Layer();
        this.addChild(layer);

        //加载背景图片
        this._background = new GameBackground();
        layer.addChild(this._background);

        //加载顶层ui
        this._gameSceneUI = new GameSceneUI();
        layer.addChild(this._gameSceneUI);

        //加载英雄
        this._hero = new Hero();
        layer.addChild(this._hero);

        //跟踪鼠标事件
        if ("touches" in cc.sys.capabilities) {
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                onTouchesMoved: this._onTouchMoved.bind(this)
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseMove: this._onMouseMove.bind(this)
            }, this);
        }

        //食物层
        this.itemBatchLayer = new cc.SpriteBatchNode("res/imgs/texture.png");
        this.addChild(this.itemBatchLayer);


        this._foodManager = new FoodManager(this);
        this._obstacleManager = new ObstacleManager(this);

        var test = Obstacle.create(1, 300);

        this.init();

    },
    init: function () {
        this.scheduleUpdate();
        var size = cc.winSize;

        //数据初始化
        Game.user.lives = GameConstants.HERO_LIVES;
        Game.user.score = Game.user.distance = 0;
        Game.gameState = GameConstants.GAME_STATE_IDLE;

        //英雄位置被初始化
        this._hero.x = -size.width / 2;
        this._hero.y = size.height / 2;

        this._touchY = size.height / 2;
        Game.user.heroSpeed = this._background.speed = 0;

        this._foodManager.init();
        this._obstacleManager.init();

        this.stopCoffeeEffect();
    },
    _onTouchMoved: function (touches, event) {
        if (Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = touches[0].getLocation().y;
    },

    _onMouseMove: function (event) {
        if (Game.gameState != GameConstants.GAME_STATE_OVER)
            this._touchY = event.getLocationY();
    },

    //调整hero姿势
    _handleHeroPose: function () {
        var winSize = cc.director.getWinSize();

        // Rotate this._hero based on mouse position.
        if (Math.abs(-(this._hero.y - this._touchY) * 0.2) < 30) {
            this._hero.setRotation((this._hero.y - this._touchY) * 0.2);
        }

        // 让hero不会超出屏幕
        if (this._hero.y < this._hero.height * 0.5) {
            this._hero.y = this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
        if (this._hero.y > winSize.height - this._hero.height * 0.5) {
            this._hero.y = winSize.height - this._hero.height * 0.5;
            this._hero.setRotation(0);
        }
    },

    update: function (elapsed) {
        var size = cc.winSize;
        switch (Game.gameState) {
            //起飞阶段
            case GameConstants.GAME_STATE_IDLE:
                if (this._hero.x < size.width / 4) {
                    this._hero.x += (size.width / 4 + 10 - this._hero.x) * 0.05;
                    Game.user.heroSpeed += (GameConstants.HERO_MIN_SPEED - Game.user.heroSpeed) * 0.05;
                    this._background.speed = Game.user.heroSpeed * elapsed;
                } else {
                    Game.gameState = GameConstants.GAME_STATE_FLYING;
                    this._hero.state = GameConstants.HERO_STATE_FLYING;
                }
                this._gameSceneUI.update();
                this._handleHeroPose();
                this._hero.y -= (this._hero.y - this._touchY) * 0.1;
                break;

            //飞行阶段
            case GameConstants.GAME_STATE_FLYING:
                if (Game.user.coffee > 0) {
                    Game.user.heroSpeed += (GameConstants.HERO_MAX_SPEED - Game.user.heroSpeed) * 0.2;
                } else {
                    this.stopCoffeeEffect();
                }

                if (Game.user.hitObstacle <= 0) {
                    this._hero.state = GameConstants.GAME_STATE_FLYING;

                    if (Game.user.heroSpeed > GameConstants.HERO_MIM_SPEED + 100) {
                        this._hero.toggleSpeed(true);
                    } else {
                        this._hero.toggleSpeed(false);
                    }
                    this._handleHeroPose();
                } else {
                    if (Game.user.coffee <= 0) {
                        if (this._hero.state != GameConstants.HERO_STATE_HIT) {
                            this._hero.state = GameConstants.HERO_STATE_HIT
                        }
                        this._hero.y -= (this._hero.y - size.height / 2) * 0.1;
                        if (this._hero.y >= size.height / 2) {
                            this._hero.rotation -= Game.user.hitObstacle * 2;
                        } else {
                            this._hero.rotation += Game.user.hitObstacle * 2;
                        }
                    }
                    Game.user.hitObstacle--;
                }

                //蘑菇咖啡逐渐减少
                if (Game.user.mushroom > 0) {
                    Game.user.mushroom -= elapsed;
                }
                if (Game.user.coffee > 0) {
                    Game.user.coffee -= elapsed;
                }
                this._foodManager.update(this._hero, elapsed);
                this._obstacleManager.update(this._hero, elapsed);

                Game.user.heroSpeed -= (Game.user.heroSpeed - GameConstants.HERO_MIN_SPEED) * 0.01;
                this._background.speed = Game.user.heroSpeed * elapsed;
                Game.user.distance += (Game.user.heroSpeed * elapsed) * 0.1;
                this._gameSceneUI.update();

                this._hero.y -= (this._hero.y - this._touchY) * 0.1;
                break;
            case GameConstants.GAME_STATE_OVER:
                this._foodManager.removeAll();
                this._obstacleManager.removeAll();

                // Spin the hero.
                this._hero.setRotation(30);

                // Make the hero fall.

                // If hero is still on screen, push him down and outside the screen. Also decrease his speed.
                // Checked for +width below because width is > height. Just a safe value.
                if (this._hero.y > -this._hero.height / 2) {
                    Game.user.heroSpeed -= Game.user.heroSpeed * elapsed;
                    this._hero.y -= size.height * elapsed;
                }
                else {
                    // Once he moves out, reset speed to 0.
                    Game.user.heroSpeed = 0;

                    // Stop game tick.
                    this.unscheduleUpdate();

                    // Game over.
                    this._gameOver();
                }

                // Set the background's speed based on hero's speed.
                this._background.speed = Game.user.heroSpeed * elapsed;
                break;
        }
        if (this._coffeeEffect) {
            this._coffeeEffect.x = this._hero.x + this._hero.width / 4;
            this._coffeeEffect.y = this._hero.y;
        }
    },
    endGame: function () {
        Game.gameState = GameConstants.GAME_STATE_OVER;
    },
    _gameOver: function () {
        this._gameOverUI = new GameOverUI(this);
        this.addChild(this._gameOverUI);
        this.stopCoffeeEffect();
        this._gameOverUI.setVisible(true);
        this._gameOverUI.init();
        Sound.playLose();
    },
    showCoffeeEffect: function () {
        if (this._coffeeEffect)
            return;
        this._coffeeEffect = new cc.ParticleSystem("res/particles/coffee.plist");
        this.addChild(this._coffeeEffect);
        this._coffeeEffect.x = this._hero.x + this._hero.width / 4;

        this._coffeeEffect.y = this._hero.y;
    },

    stopCoffeeEffect: function () {
        if (this._coffeeEffect) {
            this._coffeeEffect.stopSystem();
            this.removeChild(this._coffeeEffect);
            this._coffeeEffect = null;
        }
    },

});
