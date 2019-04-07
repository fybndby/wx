
var app = getApp();
var helper = require('../../utils/helper.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDatas:[],
    musicDatas:[],
    movieDatas:[],
    myhost: app.globalData.remoteDomainMy,
    result:'',
    totalPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  onShow:function(){

    //获取本地存储的数据
    let openid = wx.getStorageSync('openid');

    let storageDatas = wx.getStorageSync(openid);

    console.log(storageDatas);
    if (storageDatas) {
      this.setData({
        result: ''
      })

      //图书
      var bookArr = storageDatas.book;
      //音乐
      var musicArr = storageDatas.music;
      //电影
      var movieArr = storageDatas.movie;

      //统计总价
      let totalPrice = helper.countPrice(storageDatas);

      this.setData({  //渲染到模板
        bookDatas:bookArr,
        musicDatas:musicArr,
        movieDatas:movieArr,
        totalPrice: totalPrice
      })

    } else {
      this.setData({
        result: '暂无数据!'
      })
    }
  },
  /**
   * add+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   * 
   */

  add:function(e){
    helper.addsub(e,app.globalData.openId,this,'add');
  },

  /**
   * sub------------------------------------------------------------------------
   */
  
  sub:function(e){
    helper.addsub(e, app.globalData.openId, this,'sub');
  },
  /**
   * del```````````````````````````````````````````````````
   */
  del:function(e){

    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          //执行删除
          helper.addsub(e, app.globalData.openId, that, 'del');
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  gopay:function(){  //去结算
    wx.navigateTo({
      url: '../pay/pay',
    })
  }
})