/**
 * Created by lihaijie on 17/4/4.
 * 游戏过程中的ui展示
 */
var GameSceneUI = cc.Layer.extend({
    lifeText: null,
    distanceText: null,
    scoreText: null,
    layer: null,

    ctor: function () {
        this._super();
        if (!Sound.silence) {
            Sound.stop();
            Sound.silence = false;
        }

        this.layer = new cc.Layer();
        this.addChild(this.layer);

        this._initInfoPanel();
        this._addButton();
        return true;
    },
    _initInfoPanel: function () {
        var size = cc.winSize;

        var lifeLabel = new cc.LabelTTF("life", "arial", 25);
        lifeLabel.x = size.width / 4;
        lifeLabel.y = size.height - 25;
        this.layer.addChild(lifeLabel);

        var lifeText = new cc.LabelTTF("1", "arial", 25);
        lifeText.x = size.width / 4;
        lifeText.y = lifeLabel.y - 40;
        this.layer.addChild(lifeText);
        this.lifeText = lifeText;

        var distanceLabel = new cc.LabelTTF("distance", "arial", 25);
        distanceLabel.x = (size.width / 4) * 2;
        distanceLabel.y = size.height - 25;
        this.layer.addChild(distanceLabel);

        var distanceText = new cc.LabelTTF("0", "arial", 25);
        distanceText.x = (size.width / 4) * 2;
        distanceText.y = distanceLabel.y - 40;
        this.layer.addChild(distanceText);
        this.distanceText = distanceText;

        var scoreLabel = new cc.LabelTTF("score", "arial", 25);
        scoreLabel.x = (size.width / 4) * 3;
        scoreLabel.y = size.height - 25;
        this.layer.addChild(scoreLabel);

        var scoreText = new cc.LabelTTF("0", "arial", 25);
        scoreText.x = (size.width / 4) * 3;
        scoreText.y = scoreLabel.y - 40;
        this.layer.addChild(scoreText);
        this.scoreText = scoreText;
    },
    _addButton: function () {
        var size = cc.winSize;
        //音乐
        this._soundOn = new cc.MenuItemImage("#soundOn0002.png", "#soundOn0002.png", this.stopSound.bind(this));
        this._soundOn.x = 45;
        this._soundOn.y = size.height - 45;

        //静音
        this._soundOff = new cc.MenuItemImage("#soundOff.png", "#soundOff.png", this.playSound.bind(this));
        this._soundOff.x = 45;
        this._soundOff.y = size.height - 45;

        //暂停
        this._pauseBtn = new cc.MenuItemImage("#pauseButton.png", "#pauseButton.png", this.pauseResumeGame, this);
        this._pauseBtn.x = 100;
        this._pauseBtn.y = size.height - 45;

        this.menu = new cc.Menu(this._soundOn, this._soundOff, this._pauseBtn);
        this.menu.x = 0;
        this.menu.y = 0;
        this.layer.addChild(this.menu);

        if (Sound.silence) {
            this._soundOn.runAction(cc.hide());
        } else {
            this._soundOff.runAction(cc.hide());
            Sound.playGameBgMusic();
        }
    },
    stopSound: function () {
        Sound.stop();
        this._soundOn.runAction(cc.hide());
        this._soundOff.runAction(cc.show());
    },
    playSound: function () {
        Sound.playGameBgMusic();
        this._soundOn.runAction(cc.show());
        this._soundOff.runAction(cc.hide());
    },
    pauseResumeGame: function () {
        if (cc.director.isPaused()) {
            cc.director.resume()
        } else {
            cc.director.pause();
        }
    },
    update:function() {
        this.lifeText.setString(Game.user.lives.toString());
        this.distanceText.setString(parseInt(Game.user.distance).toString());
        this.scoreText.setString(Game.user.score.toString());
    }
});