
(function(ns){

var Bird = ns.Bird = Hilo.Class.create({
    Extends: Hilo.Sprite,
    constructor: function(properties){
        Bird.superclass.constructor.call(this, properties);
        var newheight = document.documentElement.clientHeight
        var DPR = window.devicePixelRatio

        var gap_Y = newheight/DPR
        this.addFrame(properties.atlas.getSprite('bird'));
        this.interval = 4;
        this.pivotX = 43;
        this.pivotY = 30;

        this.gravity = 10 / 1000 * 0.3;
        this.flyHeight = gap_Y*1.4
        this.initVelocity = Math.sqrt( 2*this.flyHeight * this.gravity);
        this.ordinaryground = this.groundY
    },

    startX: 0, //小鸟的起始x坐标
    startY: 0, //小鸟的起始y坐标
    groundY: 0, //地面的坐标
    gravity: 0, //重力加速度
    flyHeight: 0, //小鸟每次往上飞的高度
    initVelocity: 0, //小鸟往上飞的初速度

    isDead: true, //小鸟是否已死亡
    isUp: false, //小鸟是在往上飞阶段，还是下落阶段
    flyStartY: 0, //小鸟往上飞的起始y轴坐标
    flyStartTime: 0, //小鸟飞行起始时间
    ordinaryground:0,
    onRising:0,

    getReady: function(){
        //设置起始坐标
        this.x = this.startX;
        this.y = this.startY;

        this.rotation = 0;
        this.interval = 6;
        this.play();
        // this.tween = Hilo.Tween.to(this, {y:this.y + 10, rotation:-8}, {duration:400, reverse:true, loop:true});
    },

    startFly: function(){
        this.isDead = false;
        this.flyStartY = this.y;
        this.flyStartTime = +new Date();
        if(this.tween) this.tween.stop();
    },

    setx: function(x){
        this.x = x;
    },

    onUpdate: function(){
        if(this.isDead) return;
        var newheight = document.documentElement.clientHeight
        //飞行时间
        var time = (+new Date()) - this.flyStartTime;
        //飞行距离
        var distance = this.initVelocity * time - 0.5 * this.gravity * time * time;
        
        //y轴坐标
        var y = this.flyStartY - distance;
        // console.log(this.initVelocity/this.gravity)

        if(this.initVelocity-this.gravity*time<=0){
            this.onRising = 0;
        }else{
            this.onRising = 1;
        }
        if(this.groundY<newheight+1000){
            if(y <= this.groundY){
                //小鸟未落地
                this.y = y;
            }else{
                    this.y =this.groundY;
                    // this.tween = Hilo.Tween.to(this, {rotation:-20}, {duration:200});
                    // this.isUp = true;
                    this.startFly();
                // console.log(this.initVelocity)
                // this.isUp = true
            }
        }else{
            if(y < this.startY*1.2){
                //小鸟未落地
                this.y = y;
                if(distance > 0 && !this.isUp){
                    //往上飞时，角度上仰20度
                    this.isUp = true;
                }else if(distance < 0 && this.isUp){
                    //往下跌落时，角度往下90度
                    // this.tween = Hilo.Tween.to(this, {rotation:90}, {duration:this.groundY - this.y});
                    this.isUp = false;
                }
            }else{
                this.y = this.groundY;
                this.isDead = true;
            }
        }
        
        // else{
        //     //小鸟已经落地，即死亡
        //     this.y = this.groundY;
        //     this.isDead = true;
        // }
    }
});

})(window.game);