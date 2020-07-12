(function(ns){
  var Steps = ns.Steps = Hilo.Class.create({
    Extends: Hilo.Container,

    constructor: function(properties){
     Steps.superclass.constructor.call(this, properties);
      // this.init(properties);
      // console.log(properties)
      // this.addFrame(properties.image.getSprite('number'));
      this.numSteps = 100;
      this.offnumSteps = this.numSteps/2;
      this.stepSpacingX = 340,
      this.stepSpacingY = 340,
      this.stepHeight = 91+this.stepSpacingY,
      this.startY = properties.startY

      this.width = properties.width,
      this.height = this.numSteps*this.stepHeight,

      // this.reset();
      this.createSteps(properties.image);
      this.moveTween = new Hilo.Tween(this, null, {
        onComplete: this.resetSteps.bind(this)
    });
      // console.log(this.numSteps);
    },

    saveY:0,
    startY:0,
    numSteps:0,
    offnumSteps:0,
    stepSpacingY:0,
    stepSpacingX:0,
    stepHeight:0,
    passThrough:0,

    createSteps: function(image){
      // console.log(this)
      for(var i = 0;i<this.numSteps;i++){
        var step = new Hilo.Bitmap({
          id:'step'+i,
          image:image,
          startY:0
          // boundsArea:[
          //   {x:8,y:0},
          //   {x:68,y:0},
          //   {x:8,y:91},
          //   {x:68,y:91},
          // ]
        }).addTo(this)
        // console.log(this)
        this.placeStep(step,i)
        step.startY =  step.y
        step.saveY = step.y
        // step.x = Math.random()*innerWidth+10;
        // step.y = Math.random()*innerHeight;
      }

    },
    placeStep: function(step, index){
      //step在y轴的最上的位置
      var stepMinX =  this.stepSpacingX;
      var stepMinY = step.height;
      
      //下面障碍在y轴的最下的位置
      var stepMaxX = step.width;
      var stepMaxY = 30;

      var newwidth = this.width
      var newheight = document.documentElement.clientHeight
      var DPR = window.devicePixelRatio

      console.log(newwidth)

      var gap_Y = newheight/DPR
      // console.log(gap_Y)
      //在downMinY和downMaxY之间随机位置
      if(index%2==0){
        step.x = newwidth/2* Math.random();
      }else{
        step.x =newwidth-newwidth/2* Math.random()+200;
      }
      step.y = - 1.3*gap_Y*index + this.startY;
  },
  checkCollision: function(bird){

    for(var i = 0, len = this.children.length; i < len; i++){

        if(bird.hitTestObject(this.children[i], true)){
          return true;
        }
    }
    return false;
  },
  resetSteps:function(){
    var total = this.children.length;

    for(var i = this.offnumSteps;i > 0;i--){
      var step = this.getChildAt(total-1);
      this.setChildIndex(step,0);
      this.placeStep(step,this.offnumSteps+i);
    }

    for(var i = 0;i < total-this.offnumSteps;i++){
      var step = this.getChildAt(i);
      step.y = this.stepHeight*(i-0.5) + 80;
    }

    // this.passThrough += this.offnumSteps;

    // this.startMove();
    Hilo.Tween._tweens.push(this.moveTween)
  }, 
  reset: function(){
    var newwidth = document.documentElement.clientWidth
    var newheight = document.documentElement.clientHeight
    var DPR = window.devicePixelRatio
    for(var i = 0;i < this.numSteps;i++){
      var step = this.getChildAt(i)
      if(i%2==0){
        step.x = newwidth/2* Math.random();
      }else{
        step.x =newwidth-newwidth/2* Math.random()+200;
      }
      step.startY = step.saveY
    }
  }
  })
})(window.game);