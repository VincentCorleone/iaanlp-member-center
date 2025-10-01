// index.js
Page({
  data: {
    students: [],
    originalStudents: [], // 存储原始未排序未过滤的学员列表
    newStudentName: '',
    showDetailModal: false,
    showPointsModal: false,
    selectedStudent: null,
    pointsModalTitle: '',
    pointsAmount: '',
    pointsDescription: '',
    currentOperation: '', // 'add' or 'deduct'
    currentStudentId: null,
    searchKeyword: '',
    sortOrder: 'desc' // 'asc' for ascending, 'desc' for descending
  },

  onLoad() {
    // 从本地存储加载学员数据
    this.loadStudentsFromStorage();
  },

  // 从本地存储加载学员数据
  loadStudentsFromStorage() {
    const students = wx.getStorageSync('students') || [];
    this.setData({ 
      originalStudents: students 
    });
    this.applySearchAndSort();
  },

  // 应用搜索和排序
  applySearchAndSort() {
    let filteredStudents = [...this.data.originalStudents];
    
    // 应用搜索
    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      filteredStudents = filteredStudents.filter(student => 
        student.name.toLowerCase().includes(keyword)
      );
    }
    
    // 应用排序
    filteredStudents.sort((a, b) => {
      if (this.data.sortOrder === 'asc') {
        return a.points - b.points;
      } else {
        return b.points - a.points;
      }
    });
    
    this.setData({ students: filteredStudents });
  },

  // 搜索关键词输入
  onSearchKeywordInput(e) {
    this.setData({ 
      searchKeyword: e.detail.value 
    });
    this.applySearchAndSort();
  },

  // 切换排序顺序
  toggleSortOrder() {
    const newSortOrder = this.data.sortOrder === 'asc' ? 'desc' : 'asc';
    this.setData({ sortOrder: newSortOrder });
    this.applySearchAndSort();
  },

  // 保存学员数据到本地存储
  saveStudentsToStorage() {
    wx.setStorageSync('students', this.data.originalStudents);
  },

  // 新学员姓名输入
  onNewStudentNameInput(e) {
    this.setData({ newStudentName: e.detail.value });
  },

  // 添加新学员
  addStudent() {
    const name = this.data.newStudentName.trim();
    if (!name) {
      wx.showToast({
        title: '请输入学员姓名',
        icon: 'none'
      });
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name,
      points: 0,
      pointsHistory: []
    };

    const students = [...this.data.students, newStudent];
    // 更新原始学员列表
    const originalStudents = [...this.data.originalStudents, newStudent];
    this.setData({
      originalStudents,
      newStudentName: ''
    });
    
    // 应用搜索和排序
    this.applySearchAndSort();

    this.saveStudentsToStorage();
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  // 查看学员详情
  viewStudentDetail(e) {
    const student = e.currentTarget.dataset.student;
    this.setData({
      selectedStudent: student,
      showDetailModal: true
    });
  },

  // 关闭详情弹窗
  closeDetailModal() {
    this.setData({
      showDetailModal: false,
      selectedStudent: null
    });
  },

  // 加分操作
  addPoints(e) {
    const studentId = e.currentTarget.dataset.id;
    this.setData({
      pointsModalTitle: '加分',
      currentOperation: 'add',
      currentStudentId: studentId,
      pointsAmount: '',
      pointsDescription: '',
      showPointsModal: true
    });
  },

  // 扣分操作
  deductPoints(e) {
    const studentId = e.currentTarget.dataset.id;
    this.setData({
      pointsModalTitle: '扣分',
      currentOperation: 'deduct',
      currentStudentId: studentId,
      pointsAmount: '',
      pointsDescription: '',
      showPointsModal: true
    });
  },

  // 关闭积分操作弹窗
  closePointsModal() {
    this.setData({
      showPointsModal: false,
      pointsAmount: '',
      pointsDescription: '',
      currentOperation: '',
      currentStudentId: null
    });
  },

  // 积分数量输入
  onPointsAmountInput(e) {
    this.setData({ pointsAmount: e.detail.value });
  },

  // 积分说明输入
  onPointsDescriptionInput(e) {
    this.setData({ pointsDescription: e.detail.value });
  },

  // 确认积分操作
  confirmPointsOperation() {
    const amount = parseInt(this.data.pointsAmount);
    const description = this.data.pointsDescription.trim();
    
    if (!amount || amount <= 0) {
      wx.showToast({
        title: '请输入有效的积分数量',
        icon: 'none'
      });
      return;
    }

    if (!description) {
      wx.showToast({
        title: '请输入积分说明',
        icon: 'none'
      });
      return;
    }

    const students = [...this.data.students];
    const studentIndex = students.findIndex(s => s.id === this.data.currentStudentId);
    
    if (studentIndex === -1) {
      wx.showToast({
        title: '学员不存在',
        icon: 'none'
      });
      return;
    }

    const student = students[studentIndex];
    const pointsChange = this.data.currentOperation === 'add' ? amount : -amount;
    
    // 更新学员积分
    student.points += pointsChange;
    
    // 添加积分记录
    const historyItem = {
      timestamp: Date.now(),
      time: this.formatTime(new Date()),
      points: pointsChange,
      description: description,
      operation: this.data.currentOperation
    };
    
    student.pointsHistory.unshift(historyItem);
    
    // 更新原始学员列表
    this.setData({ originalStudents: students });
    
    // 应用搜索和排序
    this.applySearchAndSort();
    
    this.saveStudentsToStorage();
    
    this.closePointsModal();
    wx.showToast({
      title: '操作成功',
      icon: 'success'
    });
  },

  // 格式化时间
  formatTime(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
})

// 初始化全局长按状态对象
if (!getApp().tabBarLongPressState) {
  getApp().tabBarLongPressState = {
    homePressed: false,
    profilePressed: false,
    pressStartTime: null
  };
}

// 监听页面显示，模拟tabBar长按检测
Page.prototype.onShow = function() {
  // 在页面显示时，如果是首页页面，模拟长按检测
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage.route === 'pages/index/index') {
    // 模拟首页按钮被按住
    this.startHomeLongPress();
  }
};

// 模拟首页按钮长按开始
Page.prototype.startHomeLongPress = function() {
  const state = getApp().tabBarLongPressState;
  state.homePressed = true;
  
  if (!state.pressStartTime) {
    state.pressStartTime = Date.now();
  }
  
  // 检查是否同时按住了两个按钮
  this.checkSimultaneousPress();
};

// 模拟首页按钮长按结束
Page.prototype.endHomeLongPress = function() {
  const state = getApp().tabBarLongPressState;
  state.homePressed = false;
  
  // 如果两个按钮都不再按住，重置开始时间
  if (!state.profilePressed) {
    state.pressStartTime = null;
  }
};

// 检查是否同时按住了两个按钮
Page.prototype.checkSimultaneousPress = function() {
  const state = getApp().tabBarLongPressState;
  
  // 如果两个按钮都被按住，并且按住时间超过一定阈值（例如500毫秒）
  if (state.homePressed && state.profilePressed && state.pressStartTime) {
    const pressDuration = Date.now() - state.pressStartTime;
    
    if (pressDuration > 500) {
      // 跳转到会员页面
      wx.navigateTo({
        url: '/pages/member/member'
      });
      
      // 重置长按状态
      state.homePressed = false;
      state.profilePressed = false;
      state.pressStartTime = null;
    }
  }
};

// 监听页面隐藏，模拟长按结束
Page.prototype.onHide = function() {
  // 在页面隐藏时，如果是首页页面，模拟长按结束
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  
  if (currentPage.route === 'pages/index/index') {
    this.endHomeLongPress();
  }
};
