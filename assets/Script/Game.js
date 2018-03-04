var Bird = require('Bird');
cc.Class({
    extends: cc.Component,

    properties: {

        //管道对象
        pipeUp: {
            default: null,
            type: cc.Prefab
        },

        pipeDown: {
            default: null,
            type: cc.Prefab
        },

        //小鸟对象
        bird: {
            default: null,
            type: Bird
        },

        //地板对象
        ground: {
            default: null,
            type: cc.Node
        },

        //管道数组
        pipePrefabs: {
            default: [],
            type: [cc.Prefab]
        },

        //结束面板对象
        overPanel: {
            default: null,
            type: cc.Node
        },

        //重新开始按钮
        againBtn: {
            default: null,
            type: cc.Node
        },

        //菜单的按钮
        menuBtn: {
            default: null,
            type: cc.Node
        },

        //分数对象
        score: {
            default: null,
            type: cc.Label
        },

        //最高分数对象
        bestScore: {
            default: null,
            type: cc.Label
        },

        //金币对象
        moneyScore: {
            default: null,
            type: cc.Label
        },

        //游戏暂停按钮
        gameStop: {
            default: null,
            type: cc.Node
        },

        //游戏恢复按钮
        gameStart: {
            default: null,
            type: cc.Node
        },


        pipeMaxInterval: 50, //管道的最大间距
        pipeMinInterval: 20, //管道的最小间距
        pipeDistance: 100, //一对管道之间的距离

    },

    //生成管道
    spawnNewPipe: function() {
        //生成两个新的管道对象
        var newPipUp = cc.instantiate(this.pipePrefabs[0]);
        var newPipDown = cc.instantiate(this.pipePrefabs[1]);

        //添加标识
        newPipDown.mark = true;

        //生成一个管道的y轴随机数
        var randY = cc.random0To1() * (this.node.height / 2);

        //将生成的管道放入数组
        this.pipes.push(newPipUp);
        this.pipes.push(newPipDown);

        //管道的对数加一
        this.pipCount++;

        //设置出现的位置
        newPipUp.setPosition(this.setPipePosition(1, randY));
        newPipDown.setPosition(this.setPipePosition(0, randY));

        //添加到游戏中
        this.node.insertChild(newPipUp, 1);
        this.node.insertChild(newPipDown, 1);



    },

    //设置管道位置
    setPipePosition: function(dire, randY) {
        var PosX = 0;
        var PosY = 0;

        //随机生成上下管道的间距
        var pipeInterval = (cc.random0To1() * (this.pipeMaxInterval - this.pipeMinInterval)) + this.pipeMinInterval;

        if (dire) {
            //下边的管道
            PosY = -randY;
        } else {
            //上边的管道
            PosY = this.pipeHeight - randY + pipeInterval;
        }

        PosX = this.pipeDistance + this.sceneWidth;

        return cc.p(PosX, PosY);
    },

    // use this for initialization
    onLoad: function() {

        var self = this;

        //管道的高度
        this.pipeHeight = this.pipeUp.data.height;
        //获取管道的宽度
        this.pipeWidth = this.pipeUp.data.width;
        //获取屏幕一半的宽度
        this.sceneWidth = this.node.width / 2;
        //获取屏幕一半的高度
        this.sceneHeight = this.node.height / 2;
        //管道的对数
        this.pipCount = 0;
        //数组初始化
        this.pipes = [];
        //地板的高度
        this.groundTop = this.ground.y + this.ground.height / 2;
        //小鸟的高度
        this.birdHeight = this.bird.node.height;
        //分数
        this.count = 0;
        //金币
        this.money = 0;
        //判断是否结束
        this.over = false;
        //预加载返回到开始界面的场景
        cc.director.preloadScene('main');
        //获取角色的编码，替换角色
        var portrar = cc.sys.localStorage.getItem('portrartNum');
        portrar ? portrar : portrar = 0;

        //获取主角的动画对象
        var birdAnim = this.bird.getComponent(cc.Animation);

        //根据获取到的主角编号执行对应的动画
        switch (portrar) {
            case '1':
                //蓝鸟
                birdAnim.play('blue_bird_anim');
                break;
            case '2':
                //红鸟
                birdAnim.play('red_bird_anim');
                break;
            case '3':
                //石像鬼
                birdAnim.play('ghost_anim');
                break;
            case '4':
                //绿龙
                birdAnim.play('dragon_anim');
                break;
            default:
                //黄鸟
                birdAnim.play('flyBird_anim');
                break;
        }


        //暂停就游戏
        this.gameStop.on('touchstart', function() {
            self.gameStop.opacity = 0;
            self.gameStart.opacity = 255;

            cc.director.pause();
        });

        //恢复游戏
        this.gameStart.on('touchstart', function() {
            //恢复游戏
            cc.director.resume();

            self.gameStop.opacity = 255;
            self.gameStart.opacity = 0;

        })

        this.againBtn.on('touchstart', function() {
            //重新开始游戏
            cc.director.loadScene('game');
        });

        this.menuBtn.on('touchstart', function() {
            //返回主界面
            cc.director.loadScene('main');
        });


        //定时生成管道
        this.schedule(this.spawnNewPipe, 3);

    },


    gameOver: function() {
        //获取以前的金钱数量
        var money = parseInt(cc.sys.localStorage.getItem('money'));
        //获取最高分
        var bestScore = cc.sys.localStorage.getItem('bestScore');
        //排行榜的数组
        var rankArr = cc.sys.localStorage.getItem('rankArr');
        //计算本次结束的金钱数量
        this.money = Math.floor(this.count / 2);

        rankArr ? rankArr = rankArr.split(',') : rankArr = [];
        money ? money += this.money : money = this.money;
        bestScore = bestScore || 0;

        //停止定时器
        this.unschedule(this.spawnNewPipe, this);
        //初始化数组
        this.pipes = [];
        //取消事件绑定
        cc.eventManager.removeListener(this.bird.touchListener);
        this.gameStop.pauseSystemEvents(true);
        this.gameStart.pauseSystemEvents(true);

        //显示分数
        this.score.string = this.count;
        //显示金币数
        this.moneyScore.string = this.money;
        //显示最高分
        this.bestScore.string = bestScore;

        //播放动画事件
        var panelAnim = this.overPanel.getComponent(cc.Animation);
        var againAnim = this.againBtn.getComponent(cc.Animation);
        var menuAnim = this.menuBtn.getComponent(cc.Animation);

        panelAnim.play('panelScale_anim');
        againAnim.play('button_skew1_anim');
        menuAnim.play('button_skew2_anim');

        for (var i = 0; i < 5; i++) {
            rankArr[i] = rankArr[i] || 0;

            //判断当前分数是否大于排行榜里的任意值
            if (this.count > rankArr[i]) {

                rankArr.splice(i, 0, this.count);

                //判断数组的长度大于5就删除数组的最后一位
                if (rankArr.length > 5) {
                    rankArr.pop();
                }
                break;
            }
        }


        //储存金钱数量
        cc.sys.localStorage.setItem('money', Math.floor(money));

        //储存排行榜的记录
        cc.sys.localStorage.setItem('rankArr', rankArr.toString());

        if (bestScore) {
            //判断当前分数是否大于最高分
            if (bestScore < this.count) {
                //存储最高分数
                cc.sys.localStorage.setItem('bestScore', this.count);
            }
        } else {
            cc.sys.localStorage.setItem('bestScore', this.count);
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function(dt) {

        for (var index = 0; index < this.pipes.length; index++) {
            this.pipes[index].x -= 1;

            //超出屏幕范围清除元素
            if (this.pipes[index].x < -(this.pipeWidth + this.sceneWidth)) {
                this.node.removeChild(this.pipes[index]);
                this.pipes.shift();
            }

            //判断小鸟是否穿过管道
            if (this.bird.node.x > this.pipes[index].x && this.pipes[index].mark) {
                this.pipes[index].mark = false;
                this.count++;
            }

            //判断小鸟是否碰撞到管道上
            if (this.bird.collision) {
                this.over = true;
                this.gameOver();
            }

        }

        //判断小鸟是否超出屏幕以及接触地面
        if ((this.bird.node.y > this.sceneHeight ||
                this.bird.node.y < this.groundTop) &&
            !this.over) {
            this.over = true;
            this.gameOver();
        }


    },
});