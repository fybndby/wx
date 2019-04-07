// component/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: { //接收父组件
    starnums:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[]
  },
  ready(){  //生命周期函数
  //获取父组件传递的星星数量
    let stars = this.properties.starnums;
    //创建星星
    let totalStars = 5;
    //邻时数组
    var tempArr = [];
    for (let i = 1; i < totalStars+1;i++){
      //1颗红心
      let redStar = '../static/ico/star.png';
      //1颗灰星
      let grayStar = '../static/ico/star-gray.png';
      //如果传过来小于5 ，，剩下的存黑猩猩
      if(i>stars){
        tempArr.push(grayStar);
      }else{
        //存入
        tempArr.push(redStar);
      }
      //把tempArr赋值给list
      this.setData({
        list:tempArr
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
