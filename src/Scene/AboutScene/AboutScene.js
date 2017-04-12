/**
 * Created by lihaijie on 17/4/4.
 */
var AboutScene = cc.Scene.extend({
    ctor: function () {
        this._super();
        var layer = new cc.Layer();
        this.addChild(layer);

        var size = cc.winSize;
        var bgWelcome = new cc.Sprite("res/imgs/bgWelcome.jpg");
        bgWelcome.x = size.width / 2;
        bgWelcome.y = size.height / 2;
        layer.addChild(bgWelcome);

        var aboutText = "这是一个十分好玩的游戏\n\n" + "这是一个十分好玩的游戏\n\n" + "这是一个十分好玩的游戏\n\n" + "这是一个十分好玩的游戏\n\n" + "这是一个十分好玩的游戏\n\n";
        var helloLabel = new cc.LabelTTF(aboutText, "Arial", 18);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 80;
        layer.addChild(helloLabel);

        var backButton = new cc.MenuItemImage("#about_backButton.png", "#about_backButton.png", this._back);
        backButton.x = 150;
        backButton.y = -70;
        var menu = new cc.Menu(backButton);
        layer.addChild(menu);
        return true;
    },
    _back: function () {
        Sound.playCoffee();
        cc.director.runScene(new MenuScene());
    }
});
