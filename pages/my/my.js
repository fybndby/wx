

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.remoteDomain,
    myhost: app.globalData.remoteDomainMy,
    header: app.globalData.remoteDomain+'/web10/static/images/header.png',  //默认头像
    uname:'再见',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //去除tabar购物车数量
    let storageDatas = wx.getStorageSync(app.globalData.openId);
    console.log(storageDatas);
    if (storageDatas){
      if (storageDatas.book.length < 1 && storageDatas.music.length < 1 && storageDatas.movie.length < 1) {

        wx.removeTabBarBadge({
          index: 2,
        })

      }
    }

    //获取用户头像和姓名
    wx.request({
      url: app.globalData.remoteDomainApi+'getuserinfo.php',
      data: {
        openid: app.globalData.openId,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          header:that.data.myhost + res.data.header,
          uname:res.data.uname
        })
      }
    })

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 完善资料
   */
  myinfo:function(){
    wx.navigateTo({
      url: '../myinfo/myinfo',
    })
  },
  /**
   * 订单信息
   */
  myorder:function(){
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  }
  
})