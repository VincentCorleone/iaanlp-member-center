// member.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    points: 0,          // 积分
    coupons: 0,         // 优惠券数量
    badges: 1,          // 勋章数量
    currentLevel: 1,    // 当前等级
    nextLevel: 2,       // 下一等级
    currentPoints: 0,   // 当前经验值
    requiredPoints: 150, // 升级所需经验值
    progressPercentage: 0 // 进度百分比
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.calculateProgress();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.calculateProgress();
  },

  /**
   * 计算等级进度
   */
  calculateProgress() {
    const progressPercentage = Math.round((this.data.currentPoints / this.data.requiredPoints) * 100);
    this.setData({
      progressPercentage
    });
  },

  /**
   * 导航到地址管理
   */
  navigateToAddress() {
    wx.showToast({
      title: '地址管理功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到发票管理
   */
  navigateToInvoice() {
    wx.showToast({
      title: '发票管理功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到学生认证
   */
  navigateToCertification() {
    wx.showToast({
      title: '学生认证功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到我的礼品卡
   */
  navigateToGiftCards() {
    wx.showToast({
      title: '我的礼品卡功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到宠物身份证
   */
  navigateToPetId() {
    wx.showToast({
      title: '宠物身份证功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到在线客服
   */
  navigateToCustomerService() {
    wx.showToast({
      title: '在线客服功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到加盟咨询
   */
  navigateToFranchise() {
    wx.showToast({
      title: '加盟咨询功能开发中',
      icon: 'none'
    });
  },

  /**
   * 导航到协议及政策
   */
  navigateToAgreements() {
    wx.showToast({
      title: '协议及政策功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看会员权益
   */
  viewBenefits() {
    wx.showToast({
      title: '会员权益功能开发中',
      icon: 'none'
    });
  },

  /**
   * 完善个人信息
   */
  completeProfile() {
    wx.showToast({
      title: '完善信息功能开发中',
      icon: 'none'
    });
  }
});

// 在App全局对象中添加同时按住检测功能
// 初始化长按状态变量
if (!getApp().tabBarLongPressState) {
  getApp().tabBarLongPressState = {
    homePressed: false,
    profilePressed: false,
    pressStartTime: null
  };
}

// 监听tabBar长按事件
if (!getApp().tabBarLongPressHandlerSet) {
  getApp().tabBarLongPressHandlerSet = true;
  
  // 这里需要注意，小程序原生不直接支持tabBar的长按事件监听
  // 以下是一种实现方式，通过在首页和我的页面中添加长按检测逻辑
  
  // 我们需要在index.js和profile.js中添加对应的长按检测代码
}