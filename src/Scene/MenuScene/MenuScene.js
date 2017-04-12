/**
 * Created by lihaijie on 17/4/4.
 * 游戏菜单场景
 */
var MenuScene = cc.Scene.extend({
    _hero: null,
    _playBtn: null,
    _aboutBtn: null,

    ctor: function () {
        this._super();


        this.layer = new cc.Layer();
        this.addChild(this.layer);

        var size = cc.winSize;

        //加载背景图片
        var bgWelcome = new cc.Sprite("res/imgs/bgWelcome.jpg");
        bgWelcome.x = size.width / 2;
        bgWelcome.y = size.height / 2;
        this.layer.addChild(bgWelcome);

        var title = new cc.Sprite("#welcome_title.png");
        title.x = 800;
        title.y = 555;
        this.layer.addChild(title);

        this._hero = new cc.Sprite("#welcome_hero.png");
        this._hero.x = -size.width / 2;
        this._hero.y = 400;
        this.layer.addChild(this._hero);
        var move = cc.moveTo(2, cc.p(size.width / 2 - 200, this._hero.y)).easing(cc.easeOut(2));
        this._hero.runAction(move);
        this.scheduleUpdate();


        this._playBtn = new cc.MenuItemImage("#welcome_playButton.png", "#welcome_playButton.png", this._play);
        this._playBtn.x = 700;
        this._playBtn.y = 350;

        this._aboutBtn = new cc.MenuItemImage("#welcome_aboutButton.png", "#welcome_aboutButton.png", this._about, this);
        this._aboutBtn.x = 500;
        this._aboutBtn.y = 250;


        this._soundOn = new cc.MenuItemImage("#soundOn0002.png", "#soundOn0002.png", this.stopSound.bind(this));

        this._soundOn.x = 45;
        this._soundOn.y = size.height - 45;
        cc.audioEngine.playMusic("res/sounds/bgWelcome.mp3", true);

        //静音
        this._soundOff = new cc.MenuItemImage("#soundOff.png", "#soundOff.png", this.playSound.bind(this));
        this._soundOff.x = 45;
        this._soundOff.y = size.height - 45;

        this.menu = new cc.Menu(this._playBtn, this._aboutBtn, this._soundOn, this._soundOff);
        if (Sound.silence) {
            this._soundOn.runAction(cc.hide())
        } else {
            this._soundOff.runAction(cc.hide())
        }

        this.layer.addChild(this.menu);
        this.menu.x = this.menu.y = 0;
    },
    update: function () {
        var currentDate = new Date();
        this._hero.y = 400 + (Math.cos(currentDate.getTime() * 0.002)) * 25;
        this._playBtn.y = 350 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
        this._aboutBtn.y = 250 + (Math.cos(currentDate.getTime() * 0.002)) * 10;
    },
    stopSound: function () {
        Sound.stop();
        this._soundOn.runAction(cc.hide());
        this._soundOff.runAction(cc.show());
    },
    playSound: function () {
        Sound.playMenuBgMusic();
        this._soundOn.runAction(cc.show());
        this._soundOff.runAction(cc.hide());
    },
    _about: function () {
        cc.director.runScene(new AboutScene());
    },
    _play: function () {
        cc.director.runScene(new GameScene());
    }
});
