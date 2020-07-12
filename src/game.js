(function() {

    window.onload = function() {
        game.init();
    }

    var game = window.game = {
        width: 0,
        height: 0,

        count:0,

        asset: null,
        stage: null,
        ticker: null,
        state: null,
        score: 0,

        bg: null,
        ground: null,
        bird: null,
        step:null,
        gameReadyScene: null,
        gameOverScene: null,
        click:0,

        init: function() {
            this.asset = new game.Asset();
            this.asset.on('complete', function(e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },

        initStage: function() {
            var newwidth = document.documentElement.clientWidth
            var newheight = document.documentElement.clientHeight
            var DPR = window.devicePixelRatio
            // this.stage.resize(newwidth*DPR,newheight*DPR,true)
            this.width = Math.min(newwidth, 1242) * 2;
            this.height = Math.min(newheight, 2881) * 2;
            // this.width = newwidth * DPR
            // this.height = newheight * DPR
            this.scale = 0.5;

            //舞台画布
            var renderType = location.search.indexOf('dom') != -1 ? 'dom' : 'canvas';
            

            //舞台
            this.stage = new Hilo.Stage({
                renderType: renderType,
                width: this.width,
                height: this.height,
                scaleX: this.scale,
                scaleY: this.scale
            });

            // this.stage.resize(height,width,true)
            document.body.appendChild(this.stage.canvas);

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start(true);

            //绑定交互事件
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_END, true);
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            this.stage.on(Hilo.event.POINTER_MOVE, this.onMouseMove.bind(this));
            this.stage.on(Hilo.event.POINTER_END, this.onMouseUp.bind(this));



            //Space键控制
            if (document.addEventListener) {
                document.addEventListener('keydown', function(e) {
                    if (e.keyCode === 32) this.onUserInput(e);
                }.bind(this));
            } else {
                document.attachEvent('onkeydown', function(e) {
                    if (e.keyCode === 32) this.onUserInput(e);
                }.bind(this));
            }

            //舞台更新
            this.stage.onUpdate = this.onUpdate.bind(this);

            //初始化
            this.initBackground();
            this.initScenes();
            console.log(this.gameReadyScene)
            // this.initHoldbacks();
            this.initBird();
            this.initSteps();
            this.initCurrentScore();

            //准备游戏
            this.gameReady();
        },

        initBackground: function() {
            //背景
            var bgWidth = this.width * this.scale;
            var bgHeight = this.height * this.scale;

            var bgOffset = 1300;
            var bgImg = this.asset.bg;
            this.bg = new Hilo.Bitmap({
                id: 'bg',
                image: bgImg,
                scaleX: this.width / bgImg.width,
                scaleY: (this.height+2*bgOffset) / bgImg.height
            }).addTo(this.stage);

            // console.log(this.state)
            // if(this.state !== 'over'){
            //     Hilo.Tween.to(this.bg, {
            //     y: -bgOffset * this.bg.scaleY
            // }, {
            //     duration: 1116,
            //     loop: true
            // });
            // }

            //地面
            var groundImg = this.asset.ground;
            var groundOffset = 60;

            this.ground = new Hilo.Bitmap({
                id: 'ground',
                image: groundImg,
                scaleX: (this.width + groundOffset * 2) / groundImg.width,
            }).addTo(this.stage);

            //设置地面的y轴坐标
            this.ground.y = this.height - this.ground.height ;

        },

        initCurrentScore: function() {
            //当前分数
            this.currentScore = new Hilo.BitmapText({
                id: 'score',
                glyphs: this.asset.numberGlyphs,
                textAlign: 'center'
            }).addTo(this.stage);

            //设置当前分数的位置
            this.currentScore.x = this.width - this.currentScore.width >> 1;
            this.currentScore.y = 130;
        },

        initBird: function() {
            this.bird = new game.Bird({
                id: 'bird',
                atlas: this.asset.birdAtlas,
                startX: 100,
                startY:this.ground.y ,
                groundY: this.ground.y
            }).addTo(this.stage, this.ground.depth - 1);
        },

        // initHoldbacks: function() {
        //     this.holdbacks = new game.Holdbacks({
        //                 id: 'holdback',
        //                 width: this.width,
        //                 height: this.height,
        //                 image:this.asset.holdback,
        //                 startX: 0,
        //                 groundY: this.ground.y
        //             }).addTo(this.stage,this.ground.depth - 1);

        //             // console.log(this.holdbacks)
        //             // console.log(this.bird)
        // },
        initSteps: function() {
            this.step = new game.Steps({
                id: 'step',
                width: this.width,
                // height: this.stage.height,
                image:this.asset.step,
                startY:this.height/2,
            }).addTo(this.stage, this.ground.depth - 1);
            // console.log(this.stage)
            // console.log(this.step)
            // console.log(this.bird)
            // console.log(this.ground)
        },

        initScenes: function() {
            //准备场景
            var readyImg = this.Asset.ready
            this.gameReadyScene = new Hilo.Bitmap({
                id: 'readyScene',
                image: this.asset.ready,
                close: this.asset.close,
                width: this.width,
                height: this.height,
            }).addTo(this.stage);
            

            //结束场景
            this.gameOverScene = new game.OverScene({
                id: 'overScene',
                width: this.width,
                height: this.height,
                image1: this.asset.over,
                success:this.asset.success,
                fail:this.asset.fail,
                continue:this.asset.continue,
                again:this.asset.again,
                numberGlyphs: this.asset.numberGlyphs,
                visible: false
            }).addTo(this.stage);
            // this.stage.resize(height,width,true)

            //绑定开始按钮事件
            this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function(e) {
                e.stopImmediatePropagation && e.stopImmediatePropagation();
                this.gameReady();
            }.bind(this));
        },

        onUserInput: function(e) {
            // console.log(e)
            e.preventDefault()
            if (this.state !== 'over' && !this.gameOverScene.contains(e.eventTarget) && e.type == 'touchstart') {
                // if(this.click===0){
                //     this.bird.startFly();
                //     this.click = 1
                //     console.log(this.click)
                // }
                //启动游戏场景
                if (this.state !== 'playing'){
                    this.bird.startFly();
                    this.gameStart();
                }
                this.click = 1
                //控制小鸟往上飞
                console.log(this.click)

            }
            // if(e.type =="mousemove"){
            //     this.bird.x = e.stageX;
            // }

        },

        onMouseMove:function(e){
            e.preventDefault()
            // console.log("birdx",this.bird.x,"width",this.width)
            if(this.click === 1){
                // console.log(e)
                // this.bird.x = e.stageX;
                Hilo.Tween.to(this.bird,{
                    x:e.stageX
                })
            }
            if(this.bird.x>=this.width-this.bird.width){
                Hilo.Tween.to(this.bird,{
                    x:this.width*2/3
                })
            }
            if(this.bird.x<=0){
                Hilo.Tween.to(this.bird,{
                    x:this.width/3
                })
            }
        },
        onMouseUp:function(e){
            this.click = 0
        },
        onUpdate: function(delta) {
            var stepSpacingY = 340;
            var stepHeight = 91+stepSpacingY;
            var bgOffset = 1300
            if (this.state === 'ready') {
                return;
            }

            if(this.count>=99){
                this.bird.isDead = true
            }
            // console.log(this.ground)
            // console.log(this.bird)
            if( this.ground.y<this.stage.height+200||this.count<=1){
                Hilo.Tween.to(this.ground,{
                    y : (this.height - this.ground.height - 160)-(this.bird.y-this.bird.startY),
                });
                // this.bird.groundY = this.ground.y-100
            }else{
                this.ground.y =10000
                this.bird.groundY = this.ground.y
            }

            for(var i = 0;i < this.step.children.length;i++){
  
                Hilo.Tween.to(this.step.children[i],{
                    y :(1.3*this.step.children[i].startY)-(this.bird.y-this.bird.startY)-240
                });

            }

            if(this.bird.onRising === 1){
                this.isUp = true;
            }else{
                this.isUp = false;
            }
            

            var newheight = document.documentElement.clientHeight
            var DPR = window.devicePixelRatio

            var gap_Y = newheight/DPR

            var gravity = 10 / 1000 * 0.3;
            if (this.bird.isDead) {
                this.gameOver();
            }

            else {
                //碰撞检测
                // console.log(this.bird.onRising)
                if (this.step.checkCollision(this.bird)&&this.bird.onRising===0&&this.bird.y>=2*this.bird.height) {
                    // console.log("isup")
                    this.isUp = true;
                    this.bird.startFly();

                    for(var i = 0;i < this.step.children.length;i++){

                        if(this.bird.y<=this.step.children[i].y+5){
                            if(i>=this.count)
                                this.count = i+1
                            // console.log(this.count)
                            this.currentScore.setText(this.count);
                        }
                    }
                    for(var i = 0;i < this.step.children.length;i++){
                        Hilo.Tween.to(this.step.children[i],{
                            startY :this.step.children[i].startY-(this.step.children[this.count-1].startY-this.step.children[0].saveY)
                        });
                    }
                    if(this.bird.y<0){
                        
                        Hilo.Tween.to(this.bird,{
                            y:this.step.children[0].saveY-300
                        })
                        this.bird.distance = 0
                    }
                }
                
            }
        },

        gameReady: function() {
            //初始化
            this.initBackground();
            this.initScenes();
            // this.initHoldbacks();
            this.initBird();
            this.initSteps();
            this.initCurrentScore();
            this.gameOverScene.hide();
            this.state = 'ready';
            this.count = 0;
            this.currentScore.visible = true;
            this.currentScore.setText(this.count);
            this.gameReadyScene.visible = true;
            this.step.reset();
            this.bird.getReady();
            this.currentScore.visible = false;
            // this.ground.y = this.height - this.ground.height;
        },

        gameStart: function() {
            this.state = 'playing';
            this.currentScore.visible = true;
            this.gameReadyScene.visible = false;
            // this.holdbacks.startMove();
        },

        gameOver: function() {
            
            if (this.state !== 'over') {
                console.log("over")
                //设置当前状态为结束over
                this.state = 'over';
                //停止障碍的移动
                // this.holdbacks.stopMove();
                //小鸟跳转到第一帧并暂停
                this.bird.goto(0, true);
                this.ground.y = this.height - this.ground.height;
                //隐藏屏幕中间显示的分数
                this.currentScore.visible = false;
                //重置step位置
                this.step.reset();
                //显示结束场景
                this.gameOverScene.show(this.calcScore(), this.saveBestScore());
            }
        },

        
        calcScore: function() {
            // var count = this.holdbacks.calcPassThrough(this.bird.x)
            return this.count;
        },

        saveBestScore: function() {
            var score = this.count,
                best = 0;
            console.log(this.count)
            if (Hilo.browser.supportStorage) {
                best = parseInt(localStorage.getItem('hilo-flappy-best-score')) || 0;
            }
            if (score >= best) {
                best = score;
                localStorage.setItem('hilo-flappy-best-score', score);
            }
            return best;
        }
    };

})();