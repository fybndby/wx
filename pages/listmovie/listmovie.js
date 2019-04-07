

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myhost: app.globalData.remoteDomainMy,
    list:[],
    class_style:[],  //分类 
    class_country:[],  //地区
    all_active_class:'active-class',  //分类样式
    all_active_country:'active-country',   //国家样式
    current_class:'all_class',  //当前分类
    current_country:'all_country', //当前国家
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //请求数据 - 列表
    wx.request({
      url: app.globalData.remoteDomainApi + 'listmovie.php',
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
          list: res.data.list_datas,
          class_style:res.data.class_catagory,
          class_country:res.data.class_country
        })
      }
    })
  },
  gomoviedetail:function(e){  //点击跳转详情页面
    console.log(e);
    var id = e.currentTarget.id;

    //跳转到电影详情页
    wx.navigateTo({
      url: '../detailmovie/detailmovie?id='+id,
    })
  },


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  classSelect:function(e){   //分类点击事件
  var that = this;
    console.log(e);
    //1.当前所选择的分类
    let currentSelectedClass = e.currentTarget.dataset.selectedclass;
    //改变当前分类状态（别的方法就可以获取到当前的所选分类）

    //全部分类的状态
    if (currentSelectedClass=='all_class'){
      var newClass = 'active-class'
    }else{
      var newClass = ''
    }
    this.setData({
      current_class:currentSelectedClass,
      all_active_class:newClass
    });

    //2.当前所选电影地区
    let currentSelectedCountry = this.data.current_country;

    console.log(currentSelectedClass, currentSelectedCountry);

    //3.根据这两个条件读取API数据
    wx.request({
      url: app.globalData.remoteDomainApi + 'movielistclass.php',
      data: {
        cls: currentSelectedClass,   //分类参数
        country: currentSelectedCountry //地区参数
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list: res.data.list_datas,
          class_style: res.data.class_catagory,
          class_country: res.data.class_country
        })
      }
    })
  },

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  countrySelect: function (e) {   //地区点击事件
    var that = this;
    //1.当前所选择的电影分类
    let currentSelectedClass = this.data.current_class;
    //2.当前所选电影地区
    let currentSelectedCountry = e.currentTarget.dataset.selectedcountry;

    //全部地区的状态
    if (currentSelectedCountry == 'all_country') {
      var newClass = 'active-country'
    } else {
      var newClass = ''
    }
    this.setData({
      current_country: currentSelectedCountry,
      all_active_country: newClass
    });

      //改变地区状态（这样在别的地方读取最近所选择的地区）
      this.setData({
        current_country:currentSelectedCountry
      })
    //3.根据这两个条件读取API数据
    wx.request({
      url: app.globalData.remoteDomainApi + 'movielistclass.php',
      data: {
        cls: currentSelectedClass,
        country: currentSelectedCountry
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          list: res.data.list_datas,
          class_style: res.data.class_catagory,
          class_country: res.data.class_country
        })
      }
    })
  },

})