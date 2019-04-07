
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catagory: [],
    list: [],
    myhost: app.globalData.remoteDomainMy
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求数据 - 列表
    wx.request({
      url: app.globalData.remoteDomainApi + 'listmusic.php',
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
          list: res.data
        })
      }
    })

    //请求数据 - 分类
    wx.request({
      url: app.globalData.remoteDomainApi + 'classmusic.php',
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
          catagory: res.data
        })
      }
    })
  },

  //分类浏览
  classitem: function (e) {
    var that = this;
    // console.log(e);
    //获取当前分类id
    let id = e.currentTarget.dataset.id;
    //获取当前全部分类
    var catagory = that.data.catagory;

    //定义邻时属猪
    var tempArr = [];
    //添加分类的项目   class
    for (let i = 0; i < catagory.length; i++) {

      let item = catagory[i];

      if (item.id == id) {
        var newObject = { id: item.id, cls: 'active', cname: item.cname }
      } else {
        var newObject = { id: item.id, cls: '', cname: item.cname }
      }
      //把每一个新的对象存入到邻时数组中
      tempArr.push(newObject);
    }
    //更改catagory的内容
    that.setData({
      catagory: tempArr
    })
    ////////////请求
    wx.request({
      url: app.globalData.remoteDomainApi + 'listmusic.php',
      data: {
        ccid: id,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // console.log(res.data.length)
        // if (res.data.length==0){
        //   res.data = {}
        // }
        that.setData({
          list: res.data
        })
      }
    })
  },

  //音乐详情
  gomusicdetail:function(e){
    console.log(e);
    var id = e.currentTarget.id;

    //跳转到音乐详情页
    wx.navigateTo({
      url: '../detailmusic/detailmusic?id='+id,
    })
  }

})