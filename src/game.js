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
        button_y:0,

        init: function() {
            this.asset = new game.Asset();
            this.asset.on('complete', function(e) {
                this.asset.off('complete');
                this.initStage();
            }.bind(this));
            this.asset.load();
        },

        initStage: function() {
            this.width = Math.min(innerWidth, 450) * 2;
            this.height = Math.min(innerHeight, 750) * 2;
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
            document.body.appendChild(this.stage.canvas);

            //启动计时器
            this.ticker = new Hilo.Ticker(60);
            this.ticker.addTick(Hilo.Tween);
            this.ticker.addTick(this.stage);
            this.ticker.start(true);

            //绑定交互事件
            this.stage.enableDOMEvent(Hilo.event.POINTER_START, true);
            this.stage.enableDOMEvent(Hilo.event.POINTER_MOVE, true);
            this.stage.on(Hilo.event.POINTER_START, this.onUserInput.bind(this));
            this.stage.on(Hilo.event.POINTER_MOVE, this.onUserInput.bind(this));

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

            var bgOffset = 200;
            var bgImg = this.asset.bg;
            this.bg = new Hilo.Bitmap({
                id: 'bg',
                image: bgImg,
                scaleX: this.width / bgImg.width,
                scaleY: (this.height-bgOffset) / bgImg.height
            }).addTo(this.stage);


            //地面
            var groundImg = this.asset.ground;
            var groundOffset = 60;
            this.ground = new Hilo.Bitmap({
                id: 'ground',
                image: groundImg,
                scaleX: (this.width + groundOffset * 2) / groundImg.width
            }).addTo(this.stage);

            //设置地面的y轴坐标
            this.ground.y = this.height - this.ground.height;

            //移动地面
            // Hilo.Tween.to(this.ground, {
            //     x: -groundOffset * this.ground.scaleX,
            // }, {
            //     duration: 400,
            //     loop: true
            // });


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
            this.currentScore.y = 180;
        },

        initBird: function() {
            this.bird = new game.Bird({
                id: 'bird',
                atlas: this.asset.birdAtlas,
                startX: 100,
                startY:this.ground.y - 40,
                groundY: this.ground.y - 12
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
                image:this.asset.step,
                startY:400,
            }).addTo(this.stage, this.ground.depth - 1);
            console.log(this.step)
            console.log(this.bird)
            console.log(this.ground)
        },

        initScenes: function() {
            //准备场景
            this.gameReadyScene = new game.ReadyScene({
                id: 'readyScene',
                width: this.width,
                height: this.height,
                image: this.asset.ready
            }).addTo(this.stage);

            //结束场景
            this.gameOverScene = new game.OverScene({
                id: 'overScene',
                width: this.width,
                height: this.height,
                image: this.asset.over,
                numberGlyphs: this.asset.numberGlyphs,
                visible: false
            }).addTo(this.stage);

            //绑定开始按钮事件
            this.gameOverScene.getChildById('start').on(Hilo.event.POINTER_START, function(e) {
                e.stopImmediatePropagation && e.stopImmediatePropagation();
                this.gameReady();
            }.bind(this));
        },

        onUserInput: function(e) {
            // console.log(e)
            if (this.state !== 'over' && !this.gameOverScene.contains(e.eventTarget) && e.type == 'mousedown') {
                //启动游戏场景
                if (this.state !== 'playing') this.gameStart();
                //控制小鸟往上飞
                if(this.count==0)
                    this.bird.startFly();

            }
            else if(e.type =="mousemove"){
                this.bird.x = e.stageX;
            }

        },

        onUpdate: function(delta) {
            var stepSpacingY = 340;
            var stepHeight = 91+stepSpacingY;
            if (this.state === 'ready') {
                return;
            }

            if( this.ground.y<1400){
                Hilo.Tween.to(this.ground,{
                    y : (this.height - this.ground.height-270)-(this.bird.y-this.bird.startY)+100,
                });
                this.bird.groundY = this.ground.y
            }else{
                this.ground.y = 2000
                this.bird.groundY = this.ground.y
            }

            for(var i = 0;i < this.step.children.length;i++){
  
                    Hilo.Tween.to(this.step.children[i],{
                        y :(1.3*this.step.children[i].startY)-(this.bird.y-this.bird.startY)-240
                    });

            }

            if (this.bird.isDead) {
                this.gameOver();
            }

            else {
                //碰撞检测
                if (this.step.checkCollision(this.bird)) {
                    // console.log(this.step.checkCollision(this.bird))
                    this.tween = Hilo.Tween.to(this, {rotation:-20}, {duration:200});
                    this.isUp = true;
                    this.bird.y -=16
                    this.bird.startFly();

                    for(var i = 0;i < this.step.children.length;i++){

                        if(this.bird.y<=this.step.children[i].y+5){
                            if(i>=this.count)
                                this.count = i+1
                            this.currentScore.setText(this.count+1);
                        }
                    }
                    for(var i = 0;i < this.step.children.length;i++){
                        Hilo.Tween.to(this.step.children[i],{
                            startY :this.step.children[i].startY-(this.step.children[this.count].startY-this.step.children[0].saveY)
                        });
                    }
                    
                }
            }
        },

        gameReady: function() {
            this.gameOverScene.hide();
            this.state = 'ready';
            this.count = 0;
            this.currentScore.visible = true;
            this.currentScore.setText(this.count);
            this.gameReadyScene.visible = true;
            this.step.reset();
            this.bird.getReady();
            this.ground.y = this.height - this.ground.height;
        },

        gameStart: function() {
            this.state = 'playing';
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
            return this.count+1;
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