/**
 * Created by lihaijie on 17/4/4.
 */
var TestLayer = cc.Layer.extend({


    speed: 5,

    ctor: function () {
        this._super();
        var img=new cc.Sprite("#fly_0002.png");
        var size=cc.winSize;
        img.x=size.width/2;
        img.y=size.height/2;
        this.addChild(img);
        return true;
    }
});