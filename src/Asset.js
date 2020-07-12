
(function(ns){

var Asset = ns.Asset = Hilo.Class.create({
    Mixes: Hilo.EventMixin,

    queue: null,
    bg: null,
    ground: null,
    ready: null,
    over: null,
    numberGlyphs: null,
    birdAtlas: null,
    holdback: null,
    close:null,
    again:null,
    continue:null,
    finish:null,
    score_1:null,
    score_2:null,
    score_3:null,
    score_4:null,
    score_5:null,
    score_6:null,
    score_7:null,
    score_8:null,
    score_9:null,
    score_0:null,
    ZJUer_1:null,
    ZJUer_2:null,
    ZJUer_3:null,

    load: function(){
        var resources = [
            {id:'bg', src:'images/bg.png'},
            {id:'ground', src:'images/ground.png'},
            {id:'ready', src:'images/ready.png'},
            {id:'over', src:'images/over.png'},
            {id:'number', src:'images/number.png'},
            {id:'bird', src:'images/bird.png'},
            {id:'holdback', src:'images/holdback.png'},
            {id:'steps',src:'images/step.png'},
            {id:'finish',src:'images/finish.png'},
            {id:'again',src:'images/again.png'},
            {id:'continue',src:'images/continue.png'},
            {id:'close', src:'images/close.png'},
            {id:'0',src:'images/0.png'},
            {id:'1',src:'images/1.png'},
            {id:'2',src:'images/2.png'},
            {id:'3',src:'images/3.png'},
            {id:'4',src:'images/4.png'},
            {id:'5',src:'images/5.png'},
            {id:'6',src:'images/6.png'},
            {id:'7',src:'images/7.png'},
            {id:'8',src:'images/8.png'},
            {id:'9',src:'images/9.png'},
            {id:'ZJUer',src:'images/ZJUer1.png'},
            {id:'success',src:'images/success.png'},
            {id:'fail',src:'images/fail.png'},

        ];

        this.queue = new Hilo.LoadQueue();
        this.queue.add(resources);
        this.queue.on('complete', this.onComplete.bind(this));
        this.queue.start();
    },

    onComplete: function(e){
        this.bg = this.queue.get('bg').content;
        this.ground = this.queue.get('ground').content;
        this.ready = this.queue.get('ready').content;
        this.over = this.queue.get('over').content;
        this.holdback = this.queue.get('holdback').content;
        this.finish = this.queue.get('finish').content;
        this.step = this.queue.get('steps').content;
        this.continue = this.queue.get('continue').content;
        this.again = this.queue.get('again').content;
        this.success = this.queue.get('success').content;
        this.fail = this.queue.get('fail').content;
        this.close = this.queue.get('close').content;
        this.score_0 = this.queue.get('0').content;
        this.score_1 = this.queue.get('1').content;
        this.score_2 = this.queue.get('2').content;
        this.score_3 = this.queue.get('3').content;
        this.score_4 = this.queue.get('4').content;
        this.score_5 = this.queue.get('5').content;
        this.score_6 = this.queue.get('6').content;
        this.score_7 = this.queue.get('7').content;
        this.score_8 = this.queue.get('8').content;
        this.score_9 = this.queue.get('9').content;


        this.birdAtlas = new Hilo.TextureAtlas({
            image: this.queue.get('ZJUer').content,
            frames: [
                [0, 0, 250, 220],
                [240, 0, 250, 220],
                [500, 0, 250, 220]
            ],
            sprites: {
                bird: [0, 1, 2]
            }
        });

        var number = this.queue.get('number').content;
        this.numberGlyphs = {
            0: {image:this.score_0, rect:[0,0,65,80]},
            1: {image:this.score_1,rect:[0,0,65,80]},
            2: {image:this.score_2,rect:[0,0,65,80]},
            3: {image:this.score_3,rect:[0,0,65,80]},
            4: {image:this.score_4,rect:[0,0,65,80]},
            5: {image:this.score_5,rect:[0,0,65,80]},
            6: {image:this.score_6,rect:[0,0,65,80]},
            7: {image:this.score_7,rect:[0,0,65,80]},
            8: {image:this.score_8,rect:[0,0,65,80]},
            9: {image:this.score_9,rect:[0,0,65,80]},
        };

        this.queue.off('complete');
        this.fire('complete');
    }
});

})(window.game);