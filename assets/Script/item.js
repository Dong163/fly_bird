var Data = require('./data.js');

cc.Class({
    extends: cc.Component,

    properties: {

        //头像对象
        portrart: {
            default: null,
            type: cc.Sprite
        },
        //头像数组
        portrartArr: {
            default: [],
            type: [cc.SpriteFrame]
        },
        //名称对象
        names: {
            default: null,
            type: cc.Label
        },
        //技能描述对象
        desc: {
            default: null,
            type: cc.Label
        },
        //按钮对象
        itemBtn: {
            default: null,
            type: cc.Node
        },
        //购买对象
        pay: {
            default: null,
            type: cc.Label
        }


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        var self = this;
        //角色编码

        this.setItemData(this.main.shopItemNum);

        this.itemBtn.on('touchstart', function() {

            //判断当前商品是否已被购买
            if (self.main.payArr[this.index] == '替换') {
                //储存角色编码
                cc.sys.localStorage.setItem('portrartNum', this.index + 1);
                self.main.spanNewMsg('替换成功');
                return;
            };

            //判断是否有足够的金币购买商品
            if (self.main.money >= Data[this.index].pay) {

                //购买成功赋值为'替换'
                self.main.payArr[this.index] = '替换';
                self.pay.string = '替换';

                //金币减少
                self.main.money -= Data[this.index].pay;
                self.main.shopMoney.string = self.main.money;

                //存储信息
                cc.sys.localStorage.setItem('money', self.main.money);
                cc.sys.localStorage.setItem('payArr', self.main.payArr.toString());

                self.main.spanNewMsg('购买成功');


            } else {
                self.main.spanNewMsg('购买失败');
            };

        });
    },

    setItemData: function(index) {
        var payBool;

        //判断购买的状态
        if (this.main.payArr[index] != 0) {
            payBool = this.main.payArr[index];
        } else {
            payBool = Data[index].pay;
        }

        //赋值
        this.names.string = Data[index].name;
        this.desc.string = Data[index].desc;
        this.pay.string = payBool;
        this.portrart.spriteFrame = this.portrartArr[index];
        this.itemBtn.index = index;
    }

    // update (dt) {},
});