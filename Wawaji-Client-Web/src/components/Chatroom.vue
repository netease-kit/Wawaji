<template>
  <div class="chatroom">
    <div class="chat">
      <div id="chat-list" class="list">
        <div v-for="msg in chatroomMsgs">
          <div v-if="msg.type==='notification'" class="item notice">
            <p class="info">{{msg.attach.fromNick}} {{msg.text}}</p>
          </div>
          <div v-else-if="msg.type==='text'" class="item msg">
            <p class="nick">{{msg.fromNick}}</p>
            <p class="text">{{msg.text}}</p>
          </div>
        </div>
      </div>
      <div class="edit">
        <textarea class="ipt" maxlength="120" placeholder="输入聊天内容..." v-model="msg"></textarea>
        <button class="send" @click="sendMsg">发送</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'chatroomAction',
    'chatroomMsgs'
  ],
  data () {
    return {
      msg: ''
    }
  },
  updated () {
    this.$nextTick(() => {
      let chatNode = document.getElementById('chat-list')
      chatNode.scrollTop = chatNode.clientHeight + chatNode.scrollHeight
    })
  },
  methods: {
    sendMsg () {
      if (!(/^\s*$/.test(this.msg))) {
        this.chatroomAction.sendChatroomMsg(this.msg)
        this.msg = ''
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
  .chatroom {
    float: left;
    margin-left: 30px;
    padding: 10px;
    width: 360px;
    height: 500px;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid #00B8A5;
    box-shadow: 0 8px 0 0 rgba(0,0,0,0.12);
    border-radius: 20px;
    .chat {
      width: 100%;
      height: 100%;
      background: #F1F3F5;
      border-radius: 12px;
      overflow: hidden;
      .list {
        width: 100%;
        height: 378px;
        box-sizing: border-box;
        padding: 10px 0;
        background: #F1F3F5;
        overflow-y: scroll;
      }
      .item {
        padding: 5px 20px;
      }
      .nick {
        margin-bottom: 2px;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        line-height: 14px;
        word-break: break-all;
      }
      .text {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        word-break: break-all;
        line-height: 18px;
      }
      .notice {
        text-align: center
      }
      .info {
        display: inline-block;
        padding: 0 16px;
        background: #DADEE0;
        border-radius: 14px;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        line-height: 24px;
      }
      .edit {
        width: 100%;
        height: 100px;
        position: relative;
        background: #EAEDEF;
        box-shadow: 0 -1px 0 0 rgba(0,0,0,0.08);
        border-radius: 0 0 12px 12px;
      }
      .ipt {
        width: 96%;
        height: 100%;
        border: 0;
        padding: 10px;
        background: #EAEDEF;
      }
      .send {
        position: absolute;
        width: 68px;
        height: 42px;
        border: none;
        bottom: 10px;
        right: 10px;
        z-index: 5;
        font-size: 12px;
        color: #FFFFFF;
        letter-spacing: 3px;
        background: url('../assets/send.png') no-repeat 0 6px;
        &:active {
          background: url('../assets/send_press.png') no-repeat 0 6px;
        }
      }
    }
  }
</style>

