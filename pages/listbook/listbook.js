
//获取全局APP
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    myhost: app.globalData.remoteDomainMy,  //项目根目录
    activeHealth: '',   //健康养生
    activeScience: '',   //科学技术
    activeChild: '',   //儿童图书
    activeYounth: '',   //青春文学
    activePeople: '',   //人物传
    activeNewbook: '',   //新书上架
    activeFree:'',        //99包邮
    activehotsale:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //加载loading
    wx.showLoading({
      title: '加载中',
    })
    //定义this指向
    var that = this;
    console.log(options)

    //是搜索还是查询分类？
    if (options.tap) {
      //获取tap
      let tap = options.tap;

      that.listTap(tap);  //使用listtap  方法


    } else if (options.keywords){
      //搜索词
      let searchKeywords = options.keywords
      //查询哪个字段
      let comlumn = options.action
      console.log(searchKeywords, comlumn)
      //后端查询
      //根据tap从服务器抓取对应的数据
      wx.request({
        url: app.globalData.remoteDomainApi + 'booklist.php',
        data: {
          searchKeywords: searchKeywords,
          comlumn: comlumn
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();  //取消loading

          //给模板提供数据
          // console.log(res.data)
          that.setData({
            list: res.data
          })
        }
      })
    }
  },
  //点击上面的分类
  gobooklist:function(e){
    var that = this
    console.log(e)
    let tap = e.currentTarget.dataset.tap


    that.listTap(tap);

  },


  //封装一个方法  参数tap

  listTap:function(tap){

    var that = this
    //处理分类样式
    switch (tap) {
      case 'science':
        this.setData({
          activeHealth: '',
          activeScience: 'active',
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'health':
        this.setData({
          activeHealth: 'active',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'child':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: 'active',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'younth':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: 'active',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'newbook':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: 'active',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'people':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: 'active',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: '',
        })
        break;
      case 'free99':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: 'active',        //99包邮
          activehotsale: '',
        })
        break;
      case 'bookmoretop':
        this.setData({
          activeHealth: '',
          activeScience: '',   //科学技术
          activeChild: '',   //儿童图书
          activeYounth: '',   //青春文学
          activePeople: '',   //人物传
          activeNewbook: '',   //新书上架
          activeFree: '',        //99包邮
          activehotsale: 'active',
        })
        break;
    }

    //初始化
    let res = '';

    //根据tap从服务器抓取对应的数据
    wx.request({
      url: app.globalData.remoteDomainApi + 'booklist.php',
      data: {
        tap: tap
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        wx.hideLoading();  //取消loading

        // 给模板提供数据
        // console.log(res.data)
        that.setData({
          list: res.data
        })
      }
    })


  },



  /**
  ***详情页面
  ***/

  gobookdetail: function (e) {
    // console.log(e);
    let id = e.currentTarget.dataset.id;
    //跳转到详情页面
    wx.navigateTo({
      url: '../detailbook/detailbook?id=' + id,
    })
  },
  
})