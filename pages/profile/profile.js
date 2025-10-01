// pages/profile/profile.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      totalStudents: 0,
      totalPoints: 0,
      todayOperations: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.calculateStats();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.calculateStats();
    },

    /**
     * 计算统计数据
     */
    calculateStats() {
      const students = wx.getStorageSync('students') || [];
      
      // 计算总学员数
      const totalStudents = students.length;
      
      // 计算总学分数
      let totalPoints = 0;
      let todayOperations = 0;
      const today = new Date().toDateString();
      
      students.forEach(student => {
        totalPoints += student.points;
        
        // 计算今日操作数
        if (student.pointsHistory) {
          student.pointsHistory.forEach(history => {
            const historyDate = new Date(history.timestamp).toDateString();
            if (historyDate === today) {
              todayOperations++;
            }
          });
        }
      });
      
      this.setData({
        totalStudents,
        totalPoints,
        todayOperations
      });
    },

    /**
     * 跳转到学员列表（首页）
     */
    goToStudentList() {
      wx.switchTab({
        url: '/pages/index/index'
      });
    },

    /**
     * 查看操作日志
     */
    viewOperationLog() {
      wx.showToast({
        title: '操作日志功能开发中',
        icon: 'none'
      });
    },

    /**
     * 导入数据
     */
    importData() {
      wx.showModal({
        title: '数据导入',
        content: '请先将学员数据复制到剪贴板，然后点击确定进行导入。导入将覆盖现有数据！',
        success: (res) => {
          if (res.confirm) {
            wx.getClipboardData({
              success: (res) => {
                try {
                  // 尝试解析剪贴板中的JSON数据
                  const importedStudents = JSON.parse(res.data);
                  
                  // 验证数据格式是否正确
                  if (!Array.isArray(importedStudents)) {
                    throw new Error('数据格式不正确，应为学员数组');
                  }
                  
                  // 保存导入的数据
                  wx.setStorageSync('students', importedStudents);
                  
                  // 更新统计数据
                  this.calculateStats();
                  
                  wx.showToast({
                    title: '数据导入成功',
                    icon: 'success'
                  });
                } catch (error) {
                  wx.showToast({
                    title: '数据格式错误，请检查后重试',
                    icon: 'none'
                  });
                }
              },
              fail: () => {
                wx.showToast({
                  title: '获取剪贴板数据失败',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    },

    /**
     * 关于我们
     */
    about() {
      wx.showModal({
        title: '关于学分统计系统',
        content: '学分统计系统 v1.0.0\n\n这是一款专为培训机构设计的学分管理系统，\n帮助培训机构轻松管理学员学分，\n记录积分明细，实现高效的学员管理。',
        showCancel: false
      });
    }
})
