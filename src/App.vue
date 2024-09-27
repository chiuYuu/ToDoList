<script>
import { computed } from 'vue';

export default {
  data() {
    return {
      contentLists: [],
      currentFilter: 'all', // 預設篩選的條件是全部
      editIndex: -1, // 跟蹤正在編輯的項目索引
      newItem: '',
      listTabs: [
        { label: '全部', status: 'all' },
        { label: '待完成', status: 'undone' },
        { label: '已完成', status: 'done' },
      ],
    };
  },

  // 原生碼windows.監聽那邊
  mounted() {
    const storedContentLists = localStorage.getItem('contentLists');
    if (storedContentLists) {
      this.contentLists = JSON.parse(storedContentLists);
    }
  },

  computed: {
    // 原生碼的renderList那邊
    // this.記得要加RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR
    filteredItems() {
      if (this.currentFilter === 'done') {
        return this.contentLists.filter(item => item.done);
      } else if (this.currentFilter === 'undone') {
        return this.contentLists.filter(item => !item.done);
      } else {
        return this.contentLists;
      }
    },

    // 原生碼的count函式
    undoneCount() {
      return this.contentLists.filter(item => !item.done).length;
    },
  },

  methods: {
    addOrEditItem() {
      console.log('click');
      // 宣告一個變數 = 我的todoList
      const inputValue = this.newItem.trim();
      // 檢查是不是空的(跟js原生碼一樣 但就是要記得加this.)
      if (!inputValue) {
        return;
      }
      // 如果我的修改的索引值等於-1
      if (this.editIndex === -1) {
        // 就push一個項目
        this.contentLists.push(
          { content: inputValue, done: false },
        );
      } else {
        this.contentLists[this.editIndex].content = inputValue;
        this.editIndex = -1;
      }
      this.newItem = '';
      this.updateStorage();
    },

    // 修改按鈕
    editItem(index) {
      this.newItem = this.contentLists[index].content;
      this.editIndex = index;
    },

    // 刪除按鈕
    deleteItem(index) {
      this.contentLists.splice(index, 1);
      this.updateStorage();
    },

    // 更改完成狀態
    changeDone(e, item) {
      // 利用 e.target.checked 來取得 checked 是否勾選(true/false)
      item.done = e.target.checked;
      // 更新storage
      this.updateStorage();
    },

    // 清空所有項目
    clearAll() {
      this.contentLists = [];
      this.updateStorage();
    },

    // 用來篩選待辦事項的條件
    setFilter(filter) {
      this.currentFilter = filter;
    },

    // 暫存，原生碼更新localStorage的地方
    updateStorage() {
      localStorage.setItem('contentLists', JSON.stringify(this.contentLists));
    },
  },
};
</script>

<template>
  <div class="container">
    <h1>TODO LIST</h1>
    <div class="card input">
      <input id="item-input" type="text" placeholder="請輸入待辦事項" v-model="newItem">
      <button type="button" id="add-btn" class="action-btn" title="新增項目" @click="addOrEditItem">
        {{ editIndex === -1 ? '新增' : '修改' }}
      </button>
    </div>

    <div class="card card-list">
      <div class="tab-box">
        <button v-for="tab in listTabs" :key="tab.status" :class="{ tab: true, active: currentFilter === tab.status }"
          @click="setFilter(tab.status)">
          {{ tab.label }}
        </button>
      </div>

      <div class="card-content">
        <ul class="list">
          <li class="item" v-for="(item, index) in filteredItems" :key="index" :class="{ done: item.done }">
            <label class="checkbox">
              <input 
                type="checkbox" 
                class="done-input" 
                @change="changeDone($event, item)" 
                :checked="item.done === true"
              >
              <span class="content">{{ item.content }}</span>
            </label>

            <button type="button" class="edit-btn" title="編輯項目" @click="editItem(index)">
              X
            </button>

            <button type="button" class="delete-btn" title="刪除項目" @click="deleteItem(index)">
              X
            </button>

          </li>
        </ul>

        <div class="footer-list">
          <p id="show-count">{{ undoneCount }}個待完成項目</p>
          <button id="clear-all-btn" type="button" @click="clearAll">清空所有項目</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --default: #70CFCB;
  --dark: #333;
  --gray: #9f9a91;
  --light: #efefef;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
}

body {
  min-height: 100dvh;
  background: #eee;
  display: flex;
  justify-content: center;
  color: var(--dark);
  background-image: linear-gradient(174deg,
      var(--default) 2%,
      var(--default) 46%,
      #ffffff 46%,
      #ffffff 100%,
      #e8e8e8 100%);
  letter-spacing: 0.07em;
}

h1 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5rem;
  font-weight: bold;
  color: #fffcfc;

  @media (max-width: 575px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
}

ul {
  list-style: none;
}

.container {
  margin: 3rem auto 1.5rem auto;
  padding: 0 12px;
  width: 500px;

  @media (max-width: 575px) {
    margin-top: 1.5rem;
  }
}

.card {
  margin-bottom: 0.5rem;
  max-width: 100%;
  padding: 1rem;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

input[type="text"] {
  width: 100%;
  border: 0;
  outline: 0;
  font-size: 1rem;
  padding-right: 1rem;
  color: var(--dark);

  &::placeholder {
    color: var(--gray);
  }
}

.input {
  padding: 4px 4px 4px 1rem;
  display: flex;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 40px;
  padding: 0 8px;
  border-radius: 10px;
  background: var(--dark);
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.card-list {
  padding: 0;
}

.tab-box {
  display: flex;
  text-align: center;
  color: var(--gray);
  font-size: 14px;
}

.tab {
  cursor: pointer;
  padding: 1rem;
  width: 100%;
  background-color: transparent;
  border: 0;
  border-bottom: 2px solid var(--light);

  &.active {
    border-bottom: 2px solid var(--dark);
    color: var(--dark);
    font-weight: bold;
  }
}

.card-content {
  padding: 0.5rem 1rem 1rem 1rem;

  @media (max-width: 575px) {
    padding: 0.5rem 1rem 0.5rem 0.5rem;
  }
}

.item {
  position: relative;
  padding-right: 2rem;

  @media (max-width: 575px) {
    padding-right: 0;
  }

  .edit-btn {
    position: absolute;
    opacity: 0;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    color: transparent;
    width: 1rem;
    height: 1rem;
    background-image: url('https://pngfre.com/wp-content/uploads/Pencil-8.png');
    background-size: contain;
    border: 0;
    background-color: transparent;
    cursor: pointer;

    @media (max-width: 575px) {
      opacity: 1;
      width: 12px;
      height: 12px;
    }
  }

  .delete-btn {
    position: absolute;
    opacity: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    color: transparent;
    width: 1rem;
    height: 1rem;
    background-image: url('https://pngfre.com/wp-content/uploads/X-20.png');
    background-size: contain;
    border: 0;
    background-color: transparent;
    cursor: pointer;

    @media (max-width: 575px) {
      opacity: 1;
      width: 12px;
      height: 12px;
    }
  }

  &:hover .delete-btn,
  &:hover .edit-btn {
    opacity: 1;
  }
}

.footer-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem 1rem 0.5rem;
  font-size: 14px;

  @media (max-width: 575px) {
    padding: 1.5rem 0 1rem 0.5rem;
  }
}

#clear-all-btn {
  border: 0;
  background-color: transparent;
  color: var(--gray);
  cursor: pointer;

  &:hover {
    color: var(--dark);
  }
}

.checkbox {
  position: relative;
  user-select: none;
  width: 100%;
  display: block;
  padding-left: 44px;
  cursor: pointer;

  .content {
    display: block;
    padding: 1rem 0;
    border-bottom: 1px solid #eee;
    line-height: 1.5;

    @media (max-width: 575px) {
      padding-right: 1rem;
    }
  }

  .done-input {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
    display: block;
    height: 100%;
    width: 100%;
    margin: 0;
  }

  .content::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 50%;
    transform: translateY(-50%) scale(1);
    height: 20px;
    width: 20px;
    border-radius: 5px;
    border: 1px solid var(--dark);
    pointer-events: none;
    transition: 0.3s ease;
  }

  .content::after {
    content: '';
    position: absolute;
    left: 14px;
    top: 27%;
    transform: rotate(45deg);
    height: 15px;
    width: 0.5rem;
    border-radius: 1px;
    border-bottom: 3px solid var(--default);
    border-right: 3px solid var(--default);
    pointer-events: none;
    opacity: 0;
    transition: 0.3s ease;
  }

  .done-input:checked {
    ~.content {
      color: var(--gray);
      text-decoration: line-through;
    }

    ~.content::before {
      border-color: transparent;
      transform: translateY(-50%) scale(0);
    }

    ~.content::after {
      opacity: 1;
    }
  }
}

.checked {
  color: var(--gray);
  text-decoration: line-through;
}

.checked::before {
  border-color: transparent;
  transform: translateY(-50%) scale(0);
}

.checked::after {
  opacity: 1;
}

.display {
  display: none;
}
</style>
