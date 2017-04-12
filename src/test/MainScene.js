var MainScene = cc.Scene.extend({

    ctor : function(){
        this._super();
    },
    onEnter : function () {
        this._super();
        this.layer=new TestLayer();
        this.addChild(this.layer);
    }
});