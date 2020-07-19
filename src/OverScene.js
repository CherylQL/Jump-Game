
(function(ns){

var OverScene = ns.OverScene = Hilo.Class.create({
    Extends: Hilo.Container,
    constructor: function(properties){
        OverScene.superclass.constructor.call(this, properties);
        this.init(properties);
    },

    init: function(properties){
        var board = new Hilo.Bitmap({
            id: 'success',
            width: this.width,
            height:this.height/5,
            image: properties.success,
        });

        var board2 = new Hilo.Bitmap({
            id: 'fail',
            width: this.width,
            height:this.height/5,
            image: properties.fail,
        });

        var startBtn = new Hilo.Bitmap({
            id: 'start',
            image: properties.again,
            width: this.width/2,
            height: this.height/8,
        });

        var continueBtn = new Hilo.Bitmap({
            id: 'continue',
            image: properties.continue,
            width: this.width/2,
            height: this.height/8,
        });

        var gradeBtn = new Hilo.Bitmap({
            id: 'grade',
            image: properties.image1,
            rect: [590, 176, 290, 176]
        });

        var scoreLabel = new Hilo.BitmapText({
            id: 'score',
            glyphs: properties.numberGlyphs,
            scaleX: 1.5,
            scaleY: 1.5,
            letterSpacing: 4,
            text: 0
        });

        var bestLabel = new Hilo.BitmapText({
            id: 'best',
            glyphs: properties.numberGlyphs,
            scaleX: 0.5,
            scaleY: 0.5,
            letterSpacing: 4
        });

        var whiteMask = new Hilo.View({
            id: 'mask',
            width: this.width,
            height: this.height,
            alpha: 0,
            background: '#fff'
        });

        board.x = this.width - board.width >> 1;
        board.y = this.height/2 - board.height;
        board2.x = this.width - board2.width >> 1;
        board2.y = this.height/2 - board2.height;
        // gameover.x = this.width - gameover.width >> 1;
        // gameover.y = board.y - gameover.height - 20;
        startBtn.x = this.width/2-startBtn.width/2;
        startBtn.y = board.y + board.height + 160>> 0;
        continueBtn.x = startBtn.x;
        continueBtn.y = startBtn.y+180;
        gradeBtn.x = startBtn.x;
        gradeBtn.y = startBtn.y+320;
        scoreLabel.x = this.width/2 - scoreLabel.width;
        scoreLabel.y = board.y - 190;
        // bestLabel.x = scoreLabel.x;
        // bestLabel.y = scoreLabel.y + 105;
        
        this.addChild(board, board2, startBtn, gradeBtn,continueBtn, scoreLabel, bestLabel, whiteMask);
    },

    show: function(score, bestScore){
        this.visible = true;
        this.getChildById('score').setText(score);
        this.getChildById('best').setText(bestScore);
        this.getChildById('mask').alpha = 1;

        // Hilo.Tween.to(this.getChildById('gameover'), {alpha:1}, {duration:100});
        if(score>=10)
            Hilo.Tween.to(this.getChildById('success'), {alpha:1, y:this.getChildById('success').y-150}, {duration:200, delay:200});
        else
            Hilo.Tween.to(this.getChildById('fail'), {alpha:1, y:this.getChildById('fail').y-150}, {duration:200, delay:200});
        Hilo.Tween.to(this.getChildById('score'), {alpha:1, y:this.getChildById('score').y-150}, {duration:200, delay:200});
        Hilo.Tween.to(this.getChildById('best'), {alpha:0, y:this.getChildById('best').y-150}, {duration:200, delay:200});
        Hilo.Tween.to(this.getChildById('start'), {alpha:1}, {duration:100, delay:600});
        Hilo.Tween.to(this.getChildById('continue'), {alpha:0}, {duration:100, delay:600});
        Hilo.Tween.to(this.getChildById('grade'), {alpha:0}, {duration:100, delay:600});
        Hilo.Tween.to(this.getChildById('mask'), {alpha:0}, {duration:400});
    },

    hide : function(){
        this.visible = false;
        // this.getChildById('gameover').alpha = 0;
        this.getChildById('success').alpha = 0;
        this.getChildById('fail').alpha = 0;
        this.getChildById('score').alpha = 0;
        this.getChildById('best').alpha = 0;
        this.getChildById('start').alpha = 0;
        this.getChildById('continue').alpha = 0;
        this.getChildById('grade').alpha = 0;
        this.getChildById('success').y += 150;
        this.getChildById('fail').y += 150;
        this.getChildById('score').y += 200;
        this.getChildById('best').y += 150;
    }
});

})(window.game);