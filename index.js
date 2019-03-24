const todoAppcation = new Vue({

  el: '#app',

  data() {
    return {
      // 綁定主要輸入框
      textInput: '',
      // todo清單
      todoList: [],

      // 暫存編輯輸入框
      tempInput: '',
      // 暫存編輯項目
      tempTodo: {},

      // 分頁清單
      tabItem: ['all', 'undone', 'completed'],
      // 分頁狀態
      tabStatus: 'all',

      // 狀態訊息
      statusMsg: {
        completed: '任務已全部完成',
        undone: '還有{0}筆任務未完成',
        default: '在上面的輸入框輸入內容後點擊 \"新增\"',
      },
    }
  },
  
  methods: {

    // 定義todo項目物件
    todoObj( text = '', done = false ) {
      return {
        // 時間流水號
        id: Date.now(),

        // todo內容
        text,

        // 是否完成
        done
      };
    },

    // 增加一個todo項目
    addTodo() {

      // 如果沒有資料的話，返回
      if (!this.textInput) { return; }

      // 新增一筆資料
      this.todoList.push(this.todoObj( this.textInput ));

      // 清除輸入框
      this.textInput = '';
    },

    // 刪除一個todo項目
    removeTodo( item ) {

      // 如果沒有物件的話，返回
      if (!item) { return; }

      let todoList = this.todoList;

      this.todoList.splice(todoList.indexOf(item), 1);
    },

    // 清除所有todo項目
    cleanTodo() {
      this.todoList = [];
      this.editClear();
    },

    // 項目編輯模式
    editModel( todo ) {
      this.tempTodo = todo;
      this.tempInput = todo.text;
    },

    // 完成編輯
    editFinish() {
      let tempTodo = this.tempTodo;
      let tempInput = this.tempInput;

      // 找到編輯的todo並修改text
      this.todoList[this.todoList.indexOf(tempTodo)].text = tempInput;

      this.editClear();
    },

    // 清除暫存區
    editClear() {
      this.tempTodo = {};
      this.tempInput = '';
    },

    // 切換標籤
    tabSwitch( status ) {
      this.tabStatus = status;
    },
    
    stringFormat(str, ...anyReplace) {
      let args = anyReplace;
      return str.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] !== 'undefined' ? args[number] : match;
      });
    }
  },
  computed: {

    // 依據分頁項目輸出todo清單
    filterList() {

      let 
        filterlist = [],
        tabStatus = this.tabStatus,
        tabItem = this.tabItem;

      switch(tabStatus) {
        // all
        case tabItem[0]:
          filterlist = this.todoList;
          break;

        // undone
        case tabItem[1]:
          filterlist = this.todoList.filter(item => !item.done);
          break;

        // completed
        case tabItem[2]:
          filterlist = this.todoList.filter(item => item.done);
          break;

        // Error 在分頁清單中找不到標籤項目 ( 參閱 [ tabItem ] )
        default:
          throw new Error('無此標籤清單');
          break;
      }

      return filterlist;
    },

    // 顯示狀態訊息
    displayStatusMsg() {
      let 
        statusMsg = this.statusMsg,
        length = this.todoList.length,
        done = this.todoList.filter(item => item.done).length;
        
      // 如果沒有任何項目
      if (length === 0) {
        return statusMsg['default'];
      } 

      // 如果有項目未完成
      else if ((length - done) > 0) {
        return this.stringFormat(statusMsg['undone'], (length - done));
      } 

      // 所有項目已完成
      else {
        return statusMsg['completed'];
      }
    },
  },
});