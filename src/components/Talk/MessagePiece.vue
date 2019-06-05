<template>
  <!-- 聊天消息框 -->
  <div :class="['message-piece', {send: isMe(), receive: !isMe()}]">

    <!-- 消息时间 需要判断显示时间的条件 -->
    <div class="time-stamp">
      <div>{{ messageInfo.time | timeFormat }}</div>
    </div>

    <!-- 用户头像 需要添加点击事件，显示用户信息 -->
    <a-avatar
      :class="['message-avatar', {send: isMe(), receive: !isMe()}]"
      shape="square"
      :src="isMe() ? userInfo.avatar : messageInfo.avatar"
      :size="40">
      <span>{{ messageInfo.username }}</span>
    </a-avatar>

    <div class="message-content">

      <!-- 需要判断什么时候显示 -- 群消息 且 不是当前用户发送的 且 设置了显示群昵称的 -->
      <div v-if="!isMe() && messageInfo.isGroup" class="message-nickname">
        <span>{{ messageInfo.username }}</span>
      </div>

      <!-- 判断消息类型：图片 文字 文件 -->
      <div class="message-bubble left right ">
        <!-- 纯文本信息 -->
        <div class="bubble-content">
          <div class="plain">
            <div class="secret-tip">
              <span :class="'s-' + messageInfo.secretLevel">
                【{{ JSON.parse(messageInfo.secretLevel) | fileSecret }}】
              </span>
            </div>
            <pre>{{ messageInfo.content }}</pre>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import { toWeiXinString } from '@/utils/util'
import { mapGetters } from 'vuex'
import { mixinSecret } from '@/utils/mixin'

export default {
  name: 'MessagePiece',
  props: {
    /** 消息对象Tweet */
    messageInfo: {
      type: Object,
      default: () => ({}),
      required: true
    },
    /** 是否为群组消息 */
    isGroup: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {}
  },
  mixins: [mixinSecret],
  computed: {
    ...mapGetters(['userInfo'])
  },
  filters: {
    timeFormat: toWeiXinString
  },
  methods: {
    /**
     * 判断是否当前用户发送的消息
     * @param {String} fromId 发送者的id
     */
    isMe () {
      return this.messageInfo.fromId === this.userInfo.id
    }
  }
}
</script>

<style lang="less" scoped>
  // 接收到的消息样式
  .receive {
    float: left;

    .left {
      &::after, &::before {
        right: 100%;
        border-right-color: #fff !important;
        border-right-width: 4px;
      }
    }
  }

  // 发送的消息样式
  .send {
    float: right;
    text-align: right;

    .right {
      background-color: #cce4fc !important;
      &::before, &::after {
        left: 100%;
        border-left-color: #cce4fc !important;
        border-left-width: 4px;
      }
    }
  }

  .message-piece {
    width: 100%;
    margin-bottom: 15px;
    display: block;

    .time-stamp {
      text-align: center;
      margin: 10px auto;
      max-width: 50%;

      div {
        display: inline-block;
        font-size: 12px;
        color: #b2b2b2;
        padding: 1px 18px;
      }
    }

    .message-avatar {
      border-radius: 2px;
      cursor: pointer;
    }

    .message-content {
      overflow: hidden;

      .message-nickname {
        height: 22px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        padding-left: 10px;
        color: #4f4f4f;
        width: 350px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }

      .message-bubble {
        background-color: #ffffff;
        margin: 0 10px;
        max-width: 500px;
        min-height: 1em;
        display: inline-block;
        vertical-align: top;
        position: relative;
        text-align: left;
        font-size: 14px;
        border-radius: 3px;

        &::before, &::after {
          position: absolute;
          right: 100%;
          top: 14px;
          border: 6px solid transparent;
          content: " ";
        }

        .bubble-content {
          word-wrap: break-word;
          word-break: break-all;
          min-height: 25px;

          .plain {
            padding: 9px 13px;

            .secret-tip {
              display: inline;
              .s-60 {
                color: #b2b2b2;
              }
              .s-70 {
                color: orange;
              }
              .s-80 {
                color: tomato;
              }
            }

            pre {
              margin: 0;
              display: inline;
              font-family: inherit;
              font-size: inherit;
              white-space: pre-wrap;
              word-break: normal;
            }
          }
        }

      }
    }

  }
</style>
