var app =getApp();

var helper = require('../../utils/helper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas:{coverurl:'images/loading.gif'},
    myhost: app.globalData.remoteDomainMy,
    isplay:false,
    dt:'00:00',
    cartCounts: 0,
    pid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this;   //改变this
   let id = options.id;  //id
  //  console.log(id);
    wx.request({
      url: app.globalData.remoteDomainApi+'musicdetail.php',
      data: {
        id : id,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data)
        that.setData({  //给模板提供数据
          datas: res.data,
          pid:id        ///////////////////////给pid赋值
        },function(){
          //创建音频对象
          that.InnerAudioContext = wx.createInnerAudioContext();
          
          //资源地址
          that.InnerAudioContext.src = that.data.myhost + res.data.musicurl

          //自动播放
          that.InnerAudioContext.autoplay = false
        })
      }
    })
    //更新购物车数量
    this.resetCartCount();

  },

  /**
   *  页面卸载（返回）时，更新首页home页面的
   */
  onUnload:function(){
    let pages = getCurrentPages();

    let homePage = pages[0];

    //获取openid
    let openid = wx.getStorageSync('openid')

    //根据openid获取购物车数据
    let cartDatas = wx.getStorageSync(openid)
    //通过小助手获取 购物数量
    let counts = helper.cartCount(this, cartDatas);

    homePage.data.barcount = counts
  },

  /**
   * 更新购物车数量
   */
  resetCartCount:function(){
    //获取openid
    let openid =  wx.getStorageSync('openid')

    //根据openid获取购物车数据
    let cartDatas = wx.getStorageSync(openid);

    if (cartDatas){
      //通过小助手获取 购物数量
      let counts = helper.cartCount(this, cartDatas);

      //渲染
      this.setData({
        cartCounts: counts
      })
    }
    
  },
  play:function(){   //播放按钮
    this.InnerAudioContext.play();
    //改变图标
    this.setData({
      isplay:true
    });
    // var that = this
    //计算播放时长
    // clearInterval(this.clock);
    this.clock = setInterval(()=>{
      
      //总时长
      var totalSeconds = parseInt(this.InnerAudioContext.duration);
      
      //当前播放的秒数
      var currentTime = parseInt(this.InnerAudioContext.currentTime);
      //剩余时间
      var leftTime = totalSeconds - currentTime;
      let seconds = '';
      let minuts = '';
      if (leftTime<60){
        minuts = '00';
        seconds = leftTime;
      }else{
        minuts = Math.floor(leftTime/60);
        seconds = leftTime % 60 ;
        //分钟小于10分钟前面加0
        if (minuts < 10) {
          minuts = '0' + minuts;
        }
      }
      //秒钟小于10 前面加10
      if (parseInt(seconds)<10) {
        seconds = '0' + seconds;
      }

      let result = minuts + ':'+seconds;
      this.setData({
        dt: result
      })
      // console.log(result);
    },1000)
  },
  pause: function () {   //暂停
    this.InnerAudioContext.pause();
    //改变图标
    this.setData({
      isplay: false
    })
    clearInterval(this.clock);
  },
  stop: function () {   //停止
    this.InnerAudioContext.stop();
    //改变图标
    this.setData({
      isplay: false
    })
    clearInterval(this.clock);
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.InnerAudioContext.destroy();
  },










//**********************////////*********************************** */
  //加入购物车
  add2cart:function(){
    /**
       * 加入购物车
       */

      var that = this;

      //1.显示购物状态
      wx.showToast({
        title: '成功加入购物车',
        icon: 'success',
        duration: 2000
      })

      //2.把产品写入到storage中（购买）
      //2.1在storage中是否存在该openid
      //获取本地存储
      wx.getStorage({
        key: app.globalData.openId,
        //2.2如果在storage存在该openid
        success(res) {
          console.log(res.data)

          //当前storage中该openid的所有数据
          var allDatas = res.data;

          var allDatas_music = allDatas.music;

          //2.2.1查看音乐music中是否有数据
          if (allDatas_music.length < 1) {   //图书中没有任何的数据
            let data = [{ pid: that.data.pid, count: 1, pdatas: that.data.datas }]

            let lastData = { book: allDatas.book, music: data, movie: allDatas.movie }
            //存入storage中
            wx.setStorage({
              key: app.globalData.openId,
              data: lastData,

              success: function () { //每次在成功设置storage时，重新统计购买数量

                //第一次创建storage时，数量是1
                let totalCounts = helper.cartCount(that, lastData)
                //更新模板数据
                that.setData({
                  cartCounts: totalCounts
                })
              }

            })
          } else {  //图书中有数据

            //定义一个邻时新数组，用于存放最新的改变了数量的数据
            var tempArr = [];
            //定义一个状态（当前的产品是否在已经购买的数组中）
            var isExist = false;

            //2.2.1他的book项中是否存在当前的产品
            for (let i = 0; i < allDatas_music.length; i++) {

              //当前遍历的产品ID是否等于当前页面加载的产品的ID
              if (allDatas_music[i].pid == that.data.pid) {    //如果等于（表面该产品已经购买过了，只需要数量+1）
                //当前变量的项目
                let currentItem = allDatas_music[i];
                currentItem.count++;
                //存入新数组
                tempArr.push(currentItem);
                //改变是否存在该产品的状态
                isExist = true;
              } else {  //如果不等 （表示从来没有购买过此书）（（（（（（））

                tempArr.push(allDatas_music[i])

              }

            }

            if (!isExist) {   //表面当前的图书的数组中没有当前的图书
              let data = { pid: that.data.pid, count: 1, pdatas: that.data.datas };
              tempArr.push(data)

            }



            //最终数据
            let lastData = { book: allDatas.book, music: tempArr, movie: allDatas.movie }


            //更改storage的值
            wx.setStorage({
              key: app.globalData.openId,
              data: lastData,
              success: function () {

                //显示购物车数量
                helper.cartCount(that, lastData)

              }
            })

          }





        },


        //2.3如果在storage不存在该openid  //创建storage并且存入当前的产品信息(pid,count)
        fail: function () {
          wx.setStorage({
            key: app.globalData.openId,
            data: { book: [], music: [{ pid: that.data.pid, count: 1, pdatas: that.data.datas }], movie: [] },

            success: function () { //每次在成功设置storage时，重新统计购买数量

              //第一次创建storage时，数量是1
              let count = 1;

              //更新模板数据
              that.setData({
                cartCounts: count
              })
            }

          })
        }
      })

  },
  //跳转到首页
  gohome: function () {
    wx.switchTab({
      url: '../home/home',
    })
  },
  gocart: function () {
    wx.switchTab({
      url: '../cart/cart',
    })
  },

  
})