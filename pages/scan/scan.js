

var app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    host: app.globalData.remoteDomain
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //扫码
  scan:function(){

    wx.scanCode({
      success:(res)=>{
        console.log(res);
        //条形码号
        let code = res.result;

        //获取产品分类和ID

        wx.request({
          url: app.globalData.remoteDomainApi+'scan.php',
          data: {
            code: code,
            y: ''
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success(res) {
            console.log(res.data);
            let catagory = res.data.catagory;
            let pid = res.data.pid;

            if(!catagory ||!pid){
              console.log('没有产品')
            }else{
              if (catagory == 'book') { //根据不同分类跳转到不同分类
                wx.navigateTo({
                  url: '../detailbook/detailbook?id=' + pid,
                })
              } else if (catagory == 'music') {
                wx.navigateTo({
                  url: '../detailmusic/detailmusic?id=' + pid,
                })
              } else {
                wx.navigateTo({
                  url: '../detailmovie/detailmovie?id=' + pid,
                })
              }
            }
            


          }
        })
      }
    });
  },

  
})