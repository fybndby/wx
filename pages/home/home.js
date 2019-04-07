
//获取全局app
var app = getApp();
var helper = require('../../utils/helper.js');
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    imgUrls: ['../../static/ico/loading.gif'],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    isloading: true,   //加载的时候

    newsInfo: ['AAAAAAAAAAAAAAAAAAAAAAAA', 'BBBBBBBBBBBBBBBBBBBBBBBBB', 'CCCCCCCCCCCCCCCCCCCCCCCCC'],
    host: app.globalData.remoteDomain,
    myhost: app.globalData.remoteDomainMy,
    booktop3:[],    //畅销书top3
    newbook:[],   //新书
    starbook:{},   //5星图书
    starmusic:{},
    starmovie:{},
    musictop6:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    //网络请求，给轮播提供数据
    wx.request({
      url: app.globalData.remoteDomainApi + 'swiper.php',
      success: function (res) {
        console.log(res);
        //拿到网络数据渲染模板
        that.setData({
          imgUrls: res.data,
          isloading: false
        })
      }
    })
  },

  onShow:function(){

    var that = this;
    //////////////////////////////////////////////////////////////////////////////////////////////
    //显示tabbar购物车的数量

    //首先获取openid
    let openid = wx.getStorageSync('openid')
    // console.log(openid);
    //获取购买产品的总数量（根据openid获取购买产品的所有数据）
    let storageData = wx.getStorageSync(openid)
    // console.log(storageData);
    if (storageData){
      //获取购买总数量
      let cartCounts = helper.cartCount(this, storageData);
      if (cartCounts>0){
        wx.setTabBarBadge({  //最后设置tabar数量
          index: 2,
          text: cartCounts.toString()
        })
      }
     
    }
    //畅销书top3
    wx.request({
      url: app.globalData.remoteDomainApi+'booksaletop3.php',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.length>0){
          that.setData({
            booktop3:res.data
          })
        }
      }
    })

    //新书+特价包邮
    wx.request({
      url: app.globalData.remoteDomainApi + 'newbook.php',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data.length > 0) {
          that.setData({
            newbook: res.data
          })
        }
      }
    })

    //五星排行榜图书
    wx.request({
      url: app.globalData.remoteDomainApi + 'star5.php',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        //渲染5星排行榜
        if (res.data) {  //数据渲染

          if (res.data.book){
            that.setData({
              starbook: res.data.book,
            })
          }
          if (res.data.music){
            that.setData({
              starmusic: res.data.music,
            })
          }
          if (res.data.movie) {
            that.setData({
              starmovie: res.data.movie
            })
          }

        }
      }
    })

    //音乐top6
    wx.request({
      url: app.globalData.remoteDomainApi + 'musictop6.php',
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          musictop6:res.data
        })
      }
    })
  },
   ////////////////////////////////////////////////////////////////////////////////////
  /**
   * 轮播跳转
   */
  gourl: function (e) {
    console.log(e);
    let url = e.currentTarget.dataset.url;
    let res_home = url.indexOf('home');
    let res_scan = url.indexOf('scan');
    let res_cart = url.indexOf('cart');
    let res_my = url.indexOf('my');
    if (res_home > -1 || res_scan > -1 || res_cart > -1 || res_my > -1) {
      wx.switchTab({  //跳转到tab页面
        url: '../' + url,
      })
    } else {
      wx.navigateTo({
        url: '../' + url,
      })
    }

  },

  /**
   * 畅销书排行榜，更多
   */
  showMoreBookTop3:function(){
    wx.navigateTo({
      url: '../listbook/listbook?tap=bookmoretop',
    })
  },
  /**
   * 分类跳转
   */
  gobooklist: function (e) {
    //获取标签参数
    // console.log(e);
    let tap = e.currentTarget.dataset.tap;
    //页面跳转+参数
    wx.navigateTo({
      url: '../listbook/listbook?tap=' + tap,
    })
  },
  gomusiclist: function () {
    wx.navigateTo({
      url: '../listmusic/listmusic',
    })
  },
  gomovielist: function () {
    wx.navigateTo({
      url: '../listmovie/listmovie',
    })
  },


  /**
   * 跳转到top3详情
   */

  gobookdetail:function(e){
    console.log(e);
    let pid = e.currentTarget.id;
    
    wx.navigateTo({
      url: '../detailbook/detailbook?id='+pid,
    })
  },
  /**
   * 跳转到新书+包邮
   */
   gonewbookdetail:function(e){
     console.log(e);
     let id = e.currentTarget.id;

     wx.navigateTo({
       url: '../detailbook/detailbook?id=' + id,
     })
   }
})