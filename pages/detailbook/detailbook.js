
var app = getApp();
// var helper = '../../utils/helper.js';

import helper from '../../utils/helper.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    isloading: true,   //加载的时候
    myhost: app.globalData.remoteDomainMy,  //项目根目录
    pid: '',
    datas: {},
    cartCounts: 0,
    commentlist:[],
    price:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.openId)
    var that = this;
    //获取从列表页获取到的id
    let id = options.id
    //根据id后端API获取数据
    wx.request({
      url: app.globalData.remoteDomainApi + 'bookdetail.php?id=' + id,
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
          datas: res.data,
          imgUrls: res.data.cover,
          pid: id,
          price:res.data.price
        })
      }
    })
    //显示购物车数量
    wx.getStorage({
      key: app.globalData.openId,
      success: function (res) {
        console.log(res);
        helper.cartCount(that, res.data);
      },
    })

    /**
     * 
     * 读取评论
     */
    wx.request({
      url: app.globalData.remoteDomainApi + 'getcomment.php',
      data: {
        catagory: 'book',
        pid: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.setData({
          commentlist:res.data
        })
      }
    })

  },


  /**
   * 立即购买
   */
  goPay:function(){

    //获取参数

    //分类
    var catagory = 'book';
    //产品id、
    var pid = this.data.pid;
    //封面
    var coverurl = this.data.imgUrls[0].coverurl;
    // 价格
    var price = this.data.price;
    console.log(catagory,pid,coverurl,price);
    wx.navigateTo({
      url: '../payone/payone?catagory='+catagory+'&pid='+pid+'&cover='+coverurl+'&price='+price,
    })
  },




  /**
   * 查看作品
   */
  viewworks: function (e) {
    //获取搜索词
    // console.log(e);
    let keywords = e.target.id;
    //跳转到图书列表+参数+
    wx.navigateTo({
      url: '../listbook/listbook?keywords=' + keywords + '&action=author&do=search',
    })
  },




  /**
   * 加入购物车
   */
  cart: function () {

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

        var allDatas_book = allDatas.book;

        //2.2.1查看图书book中是否有数据
        if (allDatas_book.length < 1) {   //图书中没有任何的数据
          let data = [{ pid: that.data.pid, count: 1, pdatas: that.data.datas }]

          let lastData = { book: data, music: allDatas.music, movie: allDatas.movie }
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
          for(let i = 0;i<allDatas_book.length;i++){
            
            //当前遍历的产品ID是否等于当前页面加载的产品的ID
            if(allDatas_book[i].pid == that.data.pid){    //如果等于（表面该产品已经购买过了，只需要数量+1）
              //当前变量的项目
              let currentItem = allDatas_book[i];
              currentItem.count++;
              //存入新数组
              tempArr.push(currentItem);
              //改变是否存在该产品的状态
              isExist = true;
            }else{  //如果不等 （表示从来没有购买过此书）（（（（（（））

              tempArr.push(allDatas_book[i])

            }

          }

          if (!isExist) {   //表面当前的图书的数组中没有当前的图书
            let data = { pid: that.data.pid, count: 1, pdatas: that.data.datas };
            tempArr.push(data)

          }



          //最终数据
          let lastData = { book: tempArr, music: allDatas.music, movie: allDatas.movie }

          
            //更改storage的值
            wx.setStorage({
              key: app.globalData.openId,
              data: lastData,
              success:function(){

                //显示购物车数量
              helper.cartCount(that,lastData)
               
              }
            })

          }

        

       

      },


      //2.3如果在storage不存在该openid  //创建storage并且存入当前的产品信息(pid,count)
      fail: function () {
        wx.setStorage({
          key: app.globalData.openId,
          data: {book:[{pid:that.data.pid,count:1,pdatas:that.data.datas}],music:[],movie:[]},

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
  gohome:function(){
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