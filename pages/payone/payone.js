

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderUser: '无',
    orderTel: '无',
    orderAddress: '无',
    postImages: [],
    totalPrice: 0,
    myhost: app.globalData.remoteDomainMy,
    coverurl:'',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //存储参数
    this.setData({
      catagory:options.catagory,
      pid: options.pid,
      coverurl: options.cover,
      price: options.price,
    })

    //获取收货人信息
    this.getUserInfo();

  },
  getUserInfo: function () {

    var that = this;
    // console.log(app.globalData.openId);
    wx.request({
      url: app.globalData.remoteDomainApi + 'getuserinfo.php',
      data: {
        openid: app.globalData.openId,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data == null) {  //表明该用户还没有填写资料

          wx.showModal({
            title: '提示',
            content: '请完善个人资料',
            success(res) {
              if (res.confirm) {  //跳转到完善个人资料页面

                wx.navigateTo({
                  url: '../myinfo/myinfo',
                })

              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })

        } else {    //渲染模板数据
          // console.log(res)
          that.setData({
            orderUser: res.data.uname,
            orderTel: res.data.tel,
            orderAddress: res.data.address
          })

        }
      }
    })
  },

  /**
   * 提交订单
   */
  submitOrder: function () {
    var that =this
    //校验收货人
    this.getUserInfo();

    if (this.data.orderTel != '无' && this.data.price > 0) { //确保、填写了联系人和购买了产品

      wx.request({
        url: app.globalData.remoteDomainApi + 'createorderone.php',
        data: {
          openid: app.globalData.openId,
          catagory:that.data.catagory,
          pid:that.data.pid,

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res.data);
          if(res.data =='success'){
            wx.reLaunch({
              url: '../my/my',
            })
          }
        }
      })

    }
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

    var that = this;
    // console.log(app.globalData.openId);
    wx.request({
      url: app.globalData.remoteDomainApi + 'getuserinfo.php',
      data: {
        openid: app.globalData.openId,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {

        if (res.data != null) {
          that.setData({
            orderUser: res.data.uname,
            orderTel: res.data.tel,
            orderAddress: res.data.address
          })

        }

      }

    })

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})