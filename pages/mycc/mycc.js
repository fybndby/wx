

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pname:'',
    stars:[],
    catagory:'',
    pid:'',
    starnum:5,
    notes:'',              ///评论内容
    action:'add'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log(options)
    let catagory = options.catagory;  //分类
    let pid = options.pid;    //产品ID

    //网络请求
    wx.request({
      url: app.globalData.remoteDomainApi+'getpname.php',
      data: {
        catagory: catagory,
        pid: pid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        //产品名称
        that.setData({
          pname: res.data.pname,
          catagory:catagory,
          pid:pid

        })
      }
    })

    var tempArr = [];
    for(let i =1 ;i<6;i++){

      if(!options.stars){   //如果没有星星数量 -》说明是发表评论尽量的
        let starUrl = '../../static/ico/star.png';

        tempArr.push({ id: i, starUrl: starUrl });

      }else{     ///点击编辑进来的


        let redStar = '../../static/ico/star.png';   //红心

        let grayStar = '../../static/ico/star-gray.png'  //灰星
        if (i <= options.stars) {
          tempArr.push({ id: i, starUrl: redStar })
        } else {
          tempArr.push({ id: i, starUrl: grayStar })
        }


      }

    }

    //渲染星星
    this.setData({
      stars:tempArr,
      notes:options.notes
    })

    //如果能够接受到action 来自于(我的订单评论)，则修改 data。action的值
    if(options.action){
      this.setData({
        action:options.action
      })
    }
  },
  /**
   * 选择星星
   */
  selectStar:function(e){
    //点击的是那颗星星
    console.log(e);
    var tempArr = [];
    let starNum = e.currentTarget.id;
    //从新渲染，stars的值
    for (let i = 1; i < 6; i++) {

      let redStar = '../../static/ico/star.png';   //红心

      let grayStar = '../../static/ico/star-gray.png'  //灰星
      if (i <= starNum){
        tempArr.push({ id: i, starUrl:redStar})
      }else{
        tempArr.push({ id: i, starUrl: grayStar})
      }
    }

    this.setData({
      stars: tempArr,
      starnum: starNum
    })
  },

  /**
   * 提交评论
   */
  formSubmit:function(e){

    var that = this;
    //分类
    let catagory = this.data.catagory;
    //产品id
    let pid = this.data.pid;
    //openid
    let openid = app.globalData.openId;
    //星星数量
    let starnum = this.data.starnum;
    //评论内容
    let content = e.detail.value.notes;
    console.log(catagory, pid, openid, starnum, content);

    //提交数据
    wx.request({
      url: app.globalData.remoteDomainApi+'comment.php',
      data: {
        action: that.data.action,           //提交状态。默认add  判断是否入库还是修改
        catagory: catagory,
        pid: pid,
        openid: openid,
        starnum: starnum,
        content:content
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        if (res.data == 'success'){
          wx.showToast({
            title: '发表成功',
            icon: 'success',
            duration: 2000,

            // success(res){   //成功。。跳转
            //   setTimeout(function(){
            //     wx.navigateTo({
            //       url: '../myorder/myorder',
            //     })
            //   },2000)
            // }

          })
        }else{
          wx.showToast({
            title: '评论失败',
            duration: 2000
          })
        }
      }
    })

  }
})