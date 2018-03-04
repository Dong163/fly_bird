cc.Class({
    extends: cc.Component,

    properties: {
        //msg文本对象
        msg: {
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.msg.string = this.txt;

        //获取提示框的动画事件
        var msgAnim = this.node.getComponent(cc.Animation);
        //调用动画
        // msgAnim.play('msg_open_anim');

        //两秒后调用关闭动画
        this.scheduleOnce(function() {
            msgAnim.play('msg_close_anim');
        }, 1);

        //调用动画的回调函数，结束关闭动画后清除自己
        msgAnim.msgClose = function() {
            this.node.destroy();
        }.bind(this);
    },



    // update (dt) {},
});