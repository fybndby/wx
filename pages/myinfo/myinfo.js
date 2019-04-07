

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:'',
    tempFilePaths:'',
    myname:'',
    mytel:'',
    mypost:'',
    myheader:'',
    myhost: app.globalData.remoteDomainMy,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.remoteDomainApi+'getmyinfo.php',
      data: {
        openid: app.globalData.openId,
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        that.setData({
          myname: res.data.uname,
          mytel: res.data.tel,
          mypost: res.data.post,
          myheader: res.data.header,
          address: res.data.address,
        })
      }
    })
  },
  //提交表单
  formSubmit:function(e){
    
    //获取表单数据
    console.log(e);

    //OPENID
    // $openid = 
    //姓名
    let uname = e.detail.value.uname;

    //电话
    let tel = e.detail.value.tel;

    //地址
    let address = e.detail.value.address;

    //邮编
    let post = e.detail.value.post;

    //获取头像邻时地址
    let tempFilePaths = this.data.tempFilePaths;
    console.log(tempFilePaths);
    //执行上传和表单提交
    if (tempFilePaths.length>0){   //选择了新头像
      
          wx.uploadFile({
            url: app.globalData.remoteDomainApi + 'upload.php',
            filePath: tempFilePaths,
            name: 'file',
            formData: {
              uname: uname,
              tel: tel,
              address: address,
              post: post,
              openid: app.globalData.openId
            },
            success(res) {
              const data = res.data
              console.log(data);
              if (data == 'success') {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {  //等两秒钟执行
                      //返回上一个页面
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)
                  }
                })
              } else {
                wx.showToast({
                  title: '失败',
                  icon: 'success',
                  duration: 2000,
                  success: function () {
                    setTimeout(function () {  //等两秒钟执行
                      //返回上一个页面
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)

                  }
                })
              }
            },
            fail(){
                console.log('111')
            }
          })
    }else{  //不选择头像

      wx.request({
        url: app.globalData.remoteDomainApi + 'upload.php',
        data: {
          uname: uname,
          tel: tel,
          address: address,
          post: post,
          openid: app.globalData.openId
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          const data = res.data
          console.log(data)
          if (data == 'success') {
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000,
              success: function () {
                setTimeout(function () {  //等两秒钟执行
                  //返回上一个页面
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
          } else {
            wx.showToast({
              title: '失败',
              icon: 'fail',
              duration: 2000,
              success: function () {
                setTimeout(function () {  //等两秒钟执行
                  //返回上一个页面
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)

              }
            })
          }
        }
      })

    }
   
  },
//////////////////////////////////////////5-+5658
  getLocation:function(){               //获取位置
    var that = this;
    wx.chooseLocation({
      success:function(res){
        // console.log(res)
        let address = res.address;

        //渲染
        that.setData({
          address:address
        })
      }
    })

  },

  getPhoto:function(){              //获取头像
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        //更新  tempFilePaths的值
        console.log(tempFilePaths)
        that.setData({
          tempFilePaths: tempFilePaths[0]
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