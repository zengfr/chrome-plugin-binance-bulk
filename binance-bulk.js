

//
//https://github.com/zengfr/chrome-plugin-binance-bulk
class QFParam {
    constructor() {
        this.scroll_duration = 2000;
        this.scroll_offset = -80;

        var s = 1000 * 10;
        this.mode = 2; //1=follow 2=thumb_up 3=random
        this.sleep1 = s; //next-page
        this.sleep2 = s; //follow
        this.sleep3 = s; //thumb_up
    }
}

class QAPP2 {
    constructor(qf, qfp) {
        this.qf = qf
        this.p = qfp
        this.qf.log('start app')
    }
    loop() {
        var that = this;
        that.qf.delay(function() {
            switch (that.p.mode) {
                case 1:
                    that.add_follow();
                    break;
                case 2:
                    that.thumb_up();
                    break;
                case 3:
                    var r = that.qf.rand(10, 20);
                    if (r % 2 == 0) {
                        that.add_follow();
                    } else {
                        that.thumb_up();
                    }
                    break;
                default:
                    this.qf.log('mode:' + that.p.mode)
                    break;
            }
        }, 1000);
    }
    next_page() {
        var that = this;
        this.qf.log('next_page')
        var sel2 = 'div.new-posts-hint span';
        var e2 = $(sel2).first();
        that.qf.log(e2.text())
        that.qf.click(e2)
        that.qf.delay(function() {
            that.loop();
        }, that.p.sleep1);
    }

    add_follow() {
        var that = this;
        var typ = 'follow';
        var sel3 = 'div.feed-follow-button button';
        var count = $(sel3).length;
        that.qf.log('find count: ' + count);
        if (count == 0) {
            that.next_page();
        } else {
            var total = count;
            $(sel3).each(function(index, element) {
                var e2 = $(this);
                var name = e2.children("span").first();
                that.qf.log(typ + ' find ' + name);
                that.qf.sleep_rnd_sync(that.p.sleep2 * index, function() {
                    that.qf.log(typ + ' ' + index + '/' + total);
                    that.qf.click(e2);
                });
                --count;
                if (count <= 0) {
                    that.qf.delay(function() {
                        that.next_page();
                    }, that.p.sleep2 * total);
                }
            });
        }
    }

    thumb_up() {
        var that = this;
        var typ = 'thumb_up';
        var sel3 = 'div.thumb-up-button div.thumb-up-button';
        var count = $(sel3).length;
        that.qf.log('find count: ' + count);
        if (count == 0) {
            that.next_page();
        } else {
            var total = count;
            $(sel3).each(function(index, element) {
                var e2 = $(this).first();
                var tt = e2.attr("style");
                that.qf.log(typ + ' style ' + tt);
                if (tt && tt.includes('ormal')) {
                    var e3 = e2.children("div");
                    that.qf.log(typ + ' find ' + name);
                    that.qf.sleep_rnd_sync(that.p.sleep3 * index, function() {
                        that.qf.log(typ + ' ' + index + '/' + total);
                        that.qf.click(e3);
                    });
                }
                --count;
                if (count <= 0) {
                    that.qf.delay(function() {
                        that.next_page();
                    }, that.p.sleep3 * total);
                }
            });
        }
    }
}
 

(function() {
    var qf = new QFFFFF();
    try {
        qf.init(function() {
            var qfp = new QFParam();
            var app = new QAPP2(qf, qfp)
            app.loop();
        });
    } catch (ex) {
        log(ex.message)
        console.error(ex)
    }
})();
