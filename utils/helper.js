

var helper = {
 //统计购物车数量
   cartCount:function(that,allDatas){
     //1.购买的图书的总数量

     var totalCounts = 0;
     if (allDatas.book.length > 0) {
       for (let i = 0; i < allDatas.book.length; i++) {
         totalCounts += parseInt(allDatas.book[i].count);
       }
     }

     //1.购买的音乐的总数量
     if (allDatas.music.length > 0) {
       for (let i = 0; i < allDatas.music.length; i++) {
         totalCounts += parseInt(allDatas.music[i].count);
       }
     }
     //1.购买的电影的总数量
     if (allDatas.movie.length > 0) {
       for (let i = 0; i < allDatas.movie.length; i++) {
         totalCounts += parseInt(allDatas.movie[i].count);
       }
     }

     //显示购物车总数量
     that.setData({
       cartCounts: totalCounts
     })
    // console.log(totalCounts);

     return totalCounts
   },

   ///////////////////+++++++++++++++++++++++++++++++-------------------------------
  addsub: function (e, openid, that_,action){
     //所点的分类（音乐，图书，电影）
     let item = e.currentTarget.dataset.item;

     let pid = e.currentTarget.dataset.pid;

     console.log(pid);
     //没点击一次。1.重新更新stroage，2.重新渲染数据,3.购物车显示数量

     //1.获取本地数据
     var stroageDatas = wx.getStorageSync(openid);
     console.log(stroageDatas);

     //1.2更新本地数据

     var bookDatas = stroageDatas.book;

     var musicDatas = stroageDatas.music;

     var movieDatas = stroageDatas.movie;

        var this_ = this;
                if (item == 'book') {
                  console.log(bookDatas);

                  for (let i = 0; i < bookDatas.length; i++) {
                    if (bookDatas[i].pid == pid) {

                      if(action =='add'){
                        bookDatas[i].count++
                      }else if(action == 'sub'){
                        if (bookDatas[i].count == 1){


                          wx.showModal({
                            title: '提示',
                            content: '确定要删除吗？',
                            success(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                this_.addsub(e, openid, that_, 'del');  //递归，执行当前addsub方法
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })
                          
                        }else{
                          bookDatas[i].count--
                        }
                        
                      }else {
                        bookDatas.splice(i, 1)   //删除操作
                      }
                      
                    }
                  }
                } else if (item == 'music') {
                  for (let i = 0; i < musicDatas.length; i++) {
                    if (musicDatas[i].pid == pid) {
                      if(action =='add'){
                        musicDatas[i].count++
                      }else if(action == 'sub'){

                        if (musicDatas[i].count == 1) {

                          wx.showModal({
                            title: '提示',
                            content: '确定要删除吗？',
                            success(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                this_.addsub(e, openid, that_, 'del');  //递归，执行当前addsub方法
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })

                        } else {
                          musicDatas[i].count--
                        }
                      }else{
                        musicDatas.splice(i, 1)   //删除操作
                      }
                      
                    }
                  }
                } else {
                  for (let i = 0; i < movieDatas.length; i++) {
                    if (movieDatas[i].pid == pid) {
                      if (action == 'add') {
                        movieDatas[i].count++
                      } else if (action == 'sub') {

                        if (movieDatas[i].count == 1) {

                          wx.showModal({
                            title: '提示',
                            content: '确定要删除吗？',
                            success(res) {
                              if (res.confirm) {
                                console.log('用户点击确定')
                                this_.addsub(e, openid, that_, 'del');  //递归，执行当前addsub方法
                              } else if (res.cancel) {
                                console.log('用户点击取消')
                              }
                            }
                          })

                        } else {
                          movieDatas[i].count--
                        }
                      } else {
                        movieDatas.splice(i, 1)   //删除操作
                      }
                      
                    }
                  }
                }
        



     console.log(stroageDatas)
     //1.3重新设置storage
     wx.setStorageSync(openid, stroageDatas);

     //2.重新渲染数据
     that_.setData({
       bookDatas: stroageDatas.book,
       musicDatas: stroageDatas.music,
       movieDatas: stroageDatas.movie
     })

     //3.购物车数量的显示
     let counts = this.cartCount(that_, stroageDatas);
     wx.setTabBarBadge({
       index: 2,
       text: counts.toString(),
     })
     //统计总计  (使用下面的countPrice 方法 )
    let totalPrice = this.countPrice(stroageDatas);
     that_.setData({
       totalPrice:totalPrice
     })
   },




//////////////////////////////////
   //统计购物车总金额
   countPrice:function(allDatas){
    
     console.log(allDatas);
     
     let totalPrice = 0;
    
     for(var i in allDatas){
      allDatas[i].forEach(function(item){
        //数量
        let count =item.count;

        //单价
        let price =item.pdatas.price;

        //图书总价
        totalPrice += count * price;

      })
     }
    //  //图书总价
    //  for (let i = 0; i < allDatas.book.length; i++) {
    //    //数量
    //    let count = allDatas.book[i].count;

    //    //单价
    //    let price = allDatas.book[i].pdatas.price;

    //    //音乐
    //    totalPrice += count * price;
    //  }
     

    //  //音乐总价
    //  for (let i = 0; i < allDatas.music.length; i++) {
    //    //数量
    //    let count = allDatas.music[i].count;

    //    //单价
    //    let price = allDatas.music[i].pdatas.price;

    //    //音乐
    //    totalPrice += count * price;
    //  }
    //  //电影总价
    //  for (let i = 0; i < allDatas.movie.length; i++) {
    //    //数量
    //    let count = allDatas.movie[i].count;

    //    //单价
    //    let price = allDatas.movie[i].pdatas.price;

    //    //电影总价
    //    totalPrice += count * price;
    //  }

     return totalPrice
   }

}
module.exports = helper;