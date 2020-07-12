
(function(ns){

var ReadyScene = ns.ReadyScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        ReadyScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        //准备Get Ready!
        var getready = new Hilo.Bitmap({
            image: properties.image
        });

        var close = new Hilo.Bitmap({
            image:properties.close
        })

        
        //确定getready的位置
        getready.x = 0
        getready.y = 0
        close.x = 5
        close.y = 5


        this.addChild(getready,close);
    }
});

})(window.game);