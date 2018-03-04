cc.Class({
    extends: cc.Component,

    properties: {

        //点击飞行的声音
        flyAudio: {
            url: cc.AudioClip,
            default: null
        },

        gravity: 5, //重力大小
        flySpeed: 2, //重力和飞行的中间影响值
        power: 5, //飞行的力量
    },

    //下坠
    flyDown: function() {
        var down = cc.moveBy(this.flySpeed, cc.p(0, -this.gravity)).easing(cc.easeCubicActionOut());
        this.node.runAction(down);
    },

    //上升
    flyUp: function() {
        var up = cc.moveBy(this.flySpeed, cc.p(0, 50 * this.power)).easing(cc.easeCubicActionOut());
        this.node.runAction(up);
    },

    //点击向上飞起
    setInputControl: function() {
        var self = this;

        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touches, event) {
                cc.audioEngine.play(self.flyAudio, false, 1);
                self.flyUp();
                return true;
            },
            onTouchMoved: function() {},
            onTouchEnded: function() {}
        }

        //获取监听对象
        this.touchListener = cc.eventManager.addListener(listener, self.node);
    },

    // use this for initialization
    onLoad: function() {
        //获取碰撞检测系统
        var manager = cc.director.getCollisionManager();

        // 开启碰撞检测系统
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;


        this.touchListener;

        this.collision = false;

        this.setInputControl();
    },

    //检测是否发生碰撞
    onCollisionEnter: function() {
        this.collision = true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function(dt) {
        this.flyDown();
    },
});