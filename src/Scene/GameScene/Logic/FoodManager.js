/**
 * Created by lihaijie on 17/4/4.
 * 处理食物逻辑
 */

var FoodManager = cc.Class.extend({
    _container: null,
    _gameScene: null,
    //储存食物的数组
    _itemToAnimate: null,

    ctor: function (gameScene) {
        this._container = gameScene.itemBatchLayer;
        this._gameScene = gameScene;
        this._itemsToAnimate = new Array();
    },

    init: function () {
        //清除场景所有食物
        this.removeAll();

        Game.user.coffee = Game.user.mushroom = 0;

        //初始化生成食物排列方式相关变量
        this._pattern = 1;//食物排列方式，1为水平，2为垂直，3为之字形，4为随机，10位蘑菇，11位咖啡
        this._patternPosY = cc.winSize.height - GameConstants.GAME_AREA_TOP_BOTTOM;//当前食物y坐标
        this._patternStep = 15;//每个食物的垂直距离
        this._patternDirection = 1;//当前食物排列的方向，用于之字形排列
        this._patternGap = 20;//当前食物组中每个食物的水平距离
        this._patternGapCount = 0;//当前食物的累计水平距离，如果达到patternGap则生成一个新的食物

        this._patternChangeDistance = 100;//当前食物组的水平跨度，随超人飞行逐渐减小，为0则切换到新的食物组
        this._patternLength = 50;//垂直排列时候长度
        this._patternOnce = true;

    },

    removeAll: function () {
        if (this._itemsToAnimate.length > 0) {
            for (var i = 0; i < this._itemsToAnimate.length; i++) {
                var item = this._itemsToAnimate[i];
                this._itemsToAnimate.splice(i, 1);
                cc.pool.putInPool(item);
                this._container.removeChild(item);
            }
        }
    },
    update: function (hero, elapsed) {
        this._setFoodPattern(elapsed);
        this._createFoodPattern(elapsed);
        this._animateFoodItems(hero, elapsed);
    },
    _setFoodPattern: function (elapsed) {
        if (this._patternChangeDistance > 0) {
            //如果不到切换食物组的时候，则减少距离
            this._patternChangeDistance -= Game.user.heroSpeed * elapsed;
        } else {

            //产生食物类型，加上蘑菇和咖啡10,11
            if (Math.random() < 0.7) {
                this._pattern = Math.ceil(Math.random() * 4);
            } else {
                this._pattern = Math.ceil(Math.random() * 2) + 9;
            }

            //判断当前食物组类型，并进行相应初始化处理
            if (this._pattern == 1) {
                // Vertical Pattern
                this._patternStep = 15;
                this._patternChangeDistance = Math.random() * 500 + 500;
            }
            else if (this._pattern == 2) {
                // Horizontal Pattern
                this._patternOnce = true;
                this._patternStep = 40;
                this._patternChangeDistance = this._patternGap * Math.random() * 3 + 5;
            }
            else if (this._pattern == 3) {
                // ZigZag Pattern
                this._patternStep = Math.round(Math.random() * 2 + 2) * 10;
                if (Math.random() > 0.5) {
                    this._patternDirection *= -1;
                }
                this._patternChangeDistance = Math.random() * 800 + 800;
            }
            else if (this._pattern == 4) {
                // Random Pattern
                this._patternStep = Math.round(Math.random() * 3 + 2) * 50;
                this._patternChangeDistance = Math.random() * 400 + 400;
            }
            else {
                this._patternChangeDistance = 0;
            }
        }
    },
    _createFoodPattern: function (elapsed) {
        if (this._patternGapCount < this._patternGap) {
            this._patternGapCount += Game.user.heroSpeed * elapsed;
        }
        else if (this._pattern != 0) {
            this._patternGapCount = 0;

            var size = cc.winSize;
            var item = null;

            //将食物y坐标定位到屏幕中
            var patternY = Math.floor(Math.random() * (size.height - 2 * GameConstants.GAME_AREA_TOP_BOTTOM)) + GameConstants.GAME_AREA_TOP_BOTTOM;

            switch (this._pattern) {
                case 1:
                    if (Math.random() > 0.9) {
                        //初始化食物坐标随机，但是不超过场景范围
                        this._patternPosY = patternY
                    }

                    item = Item.create(Math.ceil(Math.random() * 5));
                    item.x = size.width + item.width;
                    item.y = this._patternPosY;

                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 1);
                    break;

                case 2:
                    if (this._patternOnce == true) {
                        this._patternOnce = false;
                        this._patternPosY = patternY;
                        this._patternLength = (Math.random() * 0.4 + 0.4) * size.height;
                    }

                    this._patternPosYstart = this._patternPosY;

                    //循环创建垂直方向食物
                    while (this._patternPosYstart + this._patternStep < this._patternPosY + this._patternLength &&
                    this._patternPosYstart + this._patternStep < size.height * 0.8) {
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = size.width + item.width;
                        item.y = this._patternPosYstart;

                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                        this._patternPosYstart += this._patternStep;
                    }
                    break;

                case 3:
                    if (this._patternDirection == 1 && this._patternPosY < GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = -1;
                    }
                    else if (this._patternDirection == -1 && this._patternPosY > size.height - GameConstants.GAME_AREA_TOP_BOTTOM) {
                        this._patternDirection = 1;
                    }

                    if (this._patternPosY <= size.height - GameConstants.GAME_AREA_TOP_BOTTOM && this._patternPosY >= GameConstants.GAME_AREA_TOP_BOTTOM) {
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = size.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                        this._patternPosY += this._patternStep * this._patternDirection;
                    }
                    else {
                        this._patternPosY = size.height - GameConstants.GAME_AREA_TOP_BOTTOM;
                    }

                    break;

                case 4:
                    if (Math.random() > 0.5) {
                        // Choose a random starting position along the screen.
                        this._patternPosY = patternY;
                        item = Item.create(Math.ceil(Math.random() * 5));
                        item.x = size.width + item.width;
                        item.y = this._patternPosY;
                        this._itemsToAnimate.push(item);
                        this._container.addChild(item, 1);
                    }
                    break;

                case 10:
                    // Coffee, this item gives you extra speed for a while, and lets you break through obstacles.

                    // Set a new random position for the item, making sure it's not too close to the edges of the screen.
                    this._patternPosY = patternY;
                    item = Item.create(GameConstants.ITEM_TYPE_COFFEE);
                    item.x = size.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 5);
                    break;

                case 11:
                    // Mushroom, this item makes all the food items fly towards the hero for a while.

                    // Set a new random position for the food item, making sure it's not too close to the edges of the screen.
                    this._patternPosY = patternY;
                    item = Item.create(GameConstants.ITEM_TYPE_MUSHROOM);
                    item.x = size.width + item.width;
                    item.y = this._patternPosY;
                    this._itemsToAnimate.push(item);
                    this._container.addChild(item, 1);
                    break;

            }
        }
    },
    _animateFoodItems: function (hero, elapsed) {
        var item;

        for (var i = 0; i < this._itemsToAnimate.length; i++) {
            item = this._itemsToAnimate[i];

            if (item) {
                //如果蘑菇存在，则食物向hero靠拢
                if (Game.user.mushroom > 0 && item.type <= GameConstants.ITEM_TYPE_5) {
                    item.x -= (item.x - hero.x) * 0.2;
                    item.y -= (item.y - hero.y) * 0.2;
                } else {
                    item.x -= Game.user.heroSpeed * elapsed;

                }

                //如果食物超出屏幕或者游戏结束，食物放入缓存池，删除layer上面食物
                if (item.x < -80 || Game.gameState == GameConstants.GAME_STATE_OVER) {
                    this._itemsToAnimate.splice(i, 1);
                    cc.pool.putInPool(item);
                    this._container.removeChild(item);
                    continue;
                } else {

                    //进行碰撞检测
                    var heroItem_xDist = item.x - hero.x;
                    var heroItem_yDist = item.y - hero.y;

                    var heroItem_sqDist = heroItem_xDist * heroItem_xDist + heroItem_yDist * heroItem_yDist;
                    if (heroItem_sqDist < 5000) {
                        //检测到碰撞
                        if (item.type <= GameConstants.ITEM_TYPE_5) {
                            Game.user.score += item.type;
                            Sound.playEat();
                        } else if (item.type == GameConstants.ITEM_TYPE_COFFEE) {
                            Game.user.score += 1;
                            Game.user.coffee = 5;
                            Sound.playCoffee();
                            this._gameScene.showCoffeeEffect();
                        } else if (item.type == GameConstants.ITEM_TYPE_MUSHROOM) {
                            Game.user.score += 1;
                            Game.user.mushroom = 4;
                            Sound.playMushroom();
                        }
                        //吃掉食物
                        this._itemsToAnimate.splice(i, 1);
                        cc.pool.putInPool(item);
                        this._container.removeChild(item);
                    }
                }
            }
        }
    }

})
