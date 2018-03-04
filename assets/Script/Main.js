var Data = require('data');
cc.Class({
    extends: cc.Component,

    properties: {
        //开始按钮对象
        startBtn: {
            default: null,
            type: cc.Node
        },
        //商店按钮对象
        shopBtn: {
            default: null,
            type: cc.Node
        },
        //商店商品对象
        shopItem: {
            default: null,
            type: cc.Prefab
        },
        //商店的角色初始化按钮
        shopInit: {
            default: null,
            type: cc.Node
        },
        //商店的滚动框对象
        shopContent: {
            default: null,
            type: cc.Node
        },
        //商店对象
        showPlate: {
            default: null,
            type: cc.Node
        },
        //角色的钱
        shopMoney: {
            default: null,
            type: cc.Label
        },
        //排行榜按钮对象
        rankBtn: {
            default: null,
            type: cc.Node
        },
        //排行榜对象
        rank: {
            default: null,
            type: cc.Node
        },
        //排行榜数据
        rankings: {
            default: [],
            type: [cc.Label]
        },
        //商店关闭按钮对象
        shopCloseBtn: {
            default: null,
            type: cc.Node
        },
        //排行榜关闭按钮对象
        rankCloseBtn: {
            default: null,
            type: cc.Node
        },
        //提示框对象
        msgPlate: {
            default: null,
            type: cc.Prefab
        },
    },

    // use this for initialization
    onLoad: function() {

        var self = this;

        //获取金币数值
        this.money = cc.sys.localStorage.getItem('money');
        this.money ? this.money : this.money = 0;

        //获取排行榜的动画对象
        this.rankAnim = self.rank.getComponent(cc.Animation);
        this.plateAnim = self.showPlate.getComponent(cc.Animation);

        //商城是0，排行榜1
        this.closeBool = 0;

        //初始化购买数组
        this.payArr = [];

        //获取已购买的数据
        var pay = cc.sys.localStorage.getItem('payArr');

        //商品的数量
        this.shopItemNum = 0;

        //加载商店里的商品
        for (var i = 0; i < Data.length; i++) {

            //为数组赋值
            pay ? this.payArr = pay.split(',') : this.payArr.push(0);
            //创建商品
            this.spanNewItem();

        }


        //预加载game游戏场景
        cc.director.preloadScene('game');

        //绑定开始事件，跳转到游戏界面
        this.startBtn.on('touchstart', function() {
            //跳转到game游戏场景
            cc.director.loadScene('game');
        });

        //绑定商城事件，跳转到商城界面
        this.shopBtn.on('touchstart', function() {
            //调用动画
            self.plateAnim.play('rank_open_anim');
            self.closeBool = 0;

            //将金币显示在商店的余额中
            self.shopMoney.string = self.money;

            //暂停排行榜事件
            self.rankBtn.pauseSystemEvents(true);
            //暂停开始事件
            self.startBtn.pauseSystemEvents(true);
            //暂停商城事件
            self.shopBtn.pauseSystemEvents(true);
        });

        //绑定排行榜事件，弹出排行榜界面
        this.rankBtn.on('touchstart', function() {
            //调用动画
            self.rankAnim.play('rank_open_anim');
            self.closeBool = 1;

            //获取排行榜的数据
            var rankArr = cc.sys.localStorage.getItem('rankArr');
            rankArr ? rankArr = rankArr.split(',') : rankArr = [];

            //暂停排行榜事件
            self.rankBtn.pauseSystemEvents(true);
            //暂停开始事件
            self.startBtn.pauseSystemEvents(true);
            //暂停商城事件
            self.shopBtn.pauseSystemEvents(true);

            //遍历数组将数据显示在排行版上
            for (var i = 0; i < 5; i++) {
                rankArr[i] = rankArr[i] || 0;
                self.rankings[i].string = rankArr[i];
            }

        });

        //商店初始化按钮
        this.shopInit.on('touchstart', function() {

            //将角色编码设置为0，初始话为最初的角色
            cc.sys.localStorage.setItem('portrartNum', 0);

            self.spanNewMsg('初始化成功');

        });


        //绑定关闭按钮，关闭商店界面
        this.shopCloseBtn.on('touchstart', this.closeFn.bind(this));

        //绑定关闭按钮，关闭排行榜界面
        this.rankCloseBtn.on('touchstart', this.closeFn.bind(this));

    },

    //关闭事件
    closeFn: function() {

        //如果this.closeBool为1就调用排行榜的关闭动画，否则调用商店的关闭动画
        if (this.closeBool) {
            this.rankAnim.play('rank_close_anim');
        } else {
            this.plateAnim.play('rank_close_anim');
        }

        //恢复排行榜事件
        this.rankBtn.resumeSystemEvents(true);
        //恢复开始事件
        this.startBtn.resumeSystemEvents(true);
        //恢复商城事件
        this.shopBtn.resumeSystemEvents(true);
    },

    //生成商店的商品
    spanNewItem: function() {

        //生成一个新的商品对象
        var newItem = cc.instantiate(this.shopItem);

        //将Main的实例传入item组件中
        newItem.getComponent("item").main = this;

        //将新生成的商品添加到商店的滚动框里
        this.shopContent.addChild(newItem);

        this.shopItemNum++;
    },

    //提示框生成
    spanNewMsg: function(msg) {
        msg = msg || '操作成功';

        //生成一个新的提示框
        var newMsg = cc.instantiate(this.msgPlate);
        //设置提示框的y轴位置
        newMsg.y = 0;

        //将msg的信息传入msgPlate组件中
        newMsg.getComponent("msgPlate").txt = msg;

        //将新生成的提示框添加到canvas中
        this.node.addChild(newMsg);

    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});