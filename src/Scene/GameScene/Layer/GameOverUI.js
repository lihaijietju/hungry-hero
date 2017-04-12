/**
 * Created by lihaijie on 17/4/4.
 * 主要为结束layer
 */
var GameOverUI = cc.Layer.extend({
    _distanceText: null,
    _scoreText: null,

    ctor: function () {
        this._super();
        var size = cc.winSize;

        this.layer = new cc.LayerColor(cc.color(0, 0, 0, 200), size.width, size.height);
        this.addChild(this.layer);

        this._initInfoPanel();
        return true;
    },
    _initInfoPanel: function () {
        var size = cc.winSize;
        //this.setColor(cc.color(243, 231, 95));

        //标题
        var title = new cc.LabelTTF("hero was killed", "arial", 25);
        title.x = size.width / 2;
        title.y = size.height - 120;
        this.addChild(title);

        //距离
        var distanceText = new cc.LabelTTF("distance:0000", "arial", 25);
        distanceText.x = size.width / 2;
        distanceText.y = size.height - 220;
        this.addChild(distanceText);
        this._distanceText = distanceText;

        //分数
        var scoreText = new cc.LabelTTF("score:0000", "arial", 25);
        scoreText.x = size.width / 2;
        scoreText.y = size.height - 270;
        this.addChild(scoreText);
        this._scoreText = scoreText;

        //三个按钮
        var replayBtn = new cc.MenuItemImage("#gameOver_playAgainButton.png", "#gameOver_playAgainButton.png", this._replay, this);
        var menuBtn = new cc.MenuItemImage("#gameOver_mainButton.png", "#gameOver_mainButton.png", this._mainMenu, this);
        var aboutBtn = new cc.MenuItemImage("#gameOver_aboutButton.png", "#gameOver_aboutButton.png", this._about, this);

        var menu = new cc.Menu(replayBtn, menuBtn, aboutBtn);
        menu.alignItemsVertically();
        this.addChild(menu);
        menu.y = size.height / 2 - 100;

    },
    init: function () {
        this._distanceText.setString("DISTANCE:" + parseInt(Game.user.distance));
        this._scoreText.setString("SCORE:" + parseInt(Game.user.score));
    },
    _replay: function () {
        cc.director.runScene(new GameScene());
    },
    _mainMenu: function () {
        cc.director.runScene(new MenuScene());
    },
    _about: function () {
        cc.director.runScene(new AboutScene());
    }
});
