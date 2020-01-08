//index.js
//获取应用实例
const app = getApp()
import HTTP from '../../utils/http'
import { formatTime } from '../../assets/js/util'

Page({
  data: {
    indicatorDots: true,
    autoplay: true,
    circular: true,
    interval: 5000,
    indicatorColor: '#ddd',
    lists: [],
    hasNextPage: true,
    page: 1,
    address: app.globalData.address,
    startIndex: -1, //默认始发站
    endIndex: -1,  //默认目的地
    date:formatTime(new Date(),1)
  },
  /**
   * 右上角点击转发
   */
  onShareAppMessage: function (res) {
    return {
      title: "与您同行",
      path: "/pages/index/index",
      imageUrl:""
    }
  },
  onLoad() {
    this.listRequest()  
    this.bannerFn()
  },
  //下拉刷新
  onPullDownRefresh() {
    this.setData({
      lists: []
    })
    this.resultList(this.data)
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom(){
    let { hasNextPage, page } = this.data
    
    if (hasNextPage) {
      this.setData({
        page:page+1
      })
      this.resultList(this.data)
    }
  },
  //发布信息入口、获取用户信息授权 
  getUserInfoHandle(e) {
    if (e.detail.userInfo) {
      wx.setStorage({
        key:"userInfo",
        data: e.detail.userInfo
      });
      wx.navigateTo({
        url: '/pages/addInfo/addInfo',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您拒绝了授权部分功能无法使用',
        showCancel: false
      })
    }
  },
  bindStart: function (e) {
    this.setData({
      startIndex: e.detail.value,
      page: 1,
      lists:[]
    })
    this.resultList(this.data)
  },
  //筛选重置
  reset:function(e){
    this.setData({
      startIndex:-1,
      endIndex:-1,
      lists:[],
      date:formatTime(new Date(),1)
    });
    this.resultList(this.data)
  },
  bindEnd: function (e) {
    this.setData({
      endIndex: e.detail.value,
      page: 1,
      lists:[]
    })
    this.resultList(this.data)
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      page: 1,
      lists:[]
    })
    this.resultList(this.data)
  },
  //列表请求参数处理
  resultList(data) {
    let { startIndex, endIndex, date, address, page } = data
    this.listRequest({
      index:page,
      start: startIndex >= 0 ? address[startIndex] : '',
      end: endIndex >= 0 ? address[endIndex] : '',
      date
    })
  },
  //顺风车列表
  listRequest(params) {
    HTTP.apiFreeRide(params).then((res) => {
      let { items, hasNextPage } = res
      let oldData = this.data.lists
      let lists = oldData.concat(items)
      this.setData({
        lists,
        hasNextPage
      })  
    }).catch((err) => {
      wx.showToast({
        title: err.msg,
        icon:'none',
        duration: 2000
      })
    });
  },
  //banner图
  bannerFn() {
    HTTP.apiBanner().then((result) => {
      this.setData({
        banner:result.res.ad
      })
    }).catch((err) => {
      wx.showToast({
        title: err.msg,
        icon:'none',
        duration: 3000
      })
    });
  }
})
