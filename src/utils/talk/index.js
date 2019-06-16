/**
 * 研讨相关的工具
 * @author jihainan
 */
import SocketApi from './SocketApi'

/**
 * 用于websocket通信的消息体
 */
class SocketMessage {
  /**
   * websocket通信消息体构造器
   * @param {Number} code 消息类型码
   * @param {Object} data 数据对象
   */
  constructor ({ code, data } = {}) {
    if (typeof code === 'number') { this.code = code }
    if (data instanceof Object) { this.data = data }
  }

  /**
   * 将消息体转换为字符串
   */
  toString () {
    return JSON.stringify(this)
  }
}

/**
 * 消息体类
 */
class Tweet {
  /**
   * 消息体构造器
   * @param {String} id 消息的id
   * @param {String} username 发送者姓名
   * @param {String} avatar 发送者头像地址
   * @param {String} fromId 发送者id
   * @param {String} toId 接受者id
   * @param {Array} atId 被at成员的id
   * @param {Number} secretLevel 消息密级 60 - 非密，70 - 秘密，80 - 机密
   * @param {Number} type 消息类型 1 - 文本消息，2 - 文件消息，3 - 图片消息
   * @param {String | Object} content 消息的内容
   * @param {Date} time 消息发送时间
   * @param {Boolean} isGroup 消息分类 ture - 群消息， - 私聊消息
   * @param {String} contactId 发信人或群组id
   */
  constructor ({ id, username, avatar, fromId, toId, atId, secretLevel, type, content, time, isGroup, contactId } = {}) {
    Object.assign(this, arguments[0])
  }
}

/**
 * 最近联系人消息体
 */
class RecentContact {
  /**
   * 构建最近联系人项
   * @param {String} id id
   * @param {String} name 名称
   * @param {String} time 最后聊天时间 hh:mm
   * @param {String} lastMessage 最后一条消息
   * @param {String} avatar 头像地址
   * @param {Boolean} atMe 是否at我
   * @param {Number} unreadNum 未读消息数
   * @param {Boolean} isTop 是否置顶
   * @param {Boolean} isMute 是否免打扰
   * @param {Boolean} isGroup 是否为群组
   */
  constructor ({ id, name, time, lastMessage, avatar, atMe, secretLevel, unreadNum, memberNum, isTop, isMute, isGroup } = {}) {
    if (!id) throw new Error('RecentContact: id不能为空！')
    if (!name) throw new Error('RecentContact: name不能为空！')
    // 固有信息(任何时候都需要有的属性)
    this.id = id
    this.name = name
    this.avatar = avatar || ''
    this.secretLevel = secretLevel ? JSON.parse(secretLevel) : 60
    // 有新消息时变更(有消息更新时需要有)
    this.unreadNum = unreadNum ? JSON.parse(unreadNum) : 0
    this.time = time || ''
    this.lastMessage = lastMessage || ''
    this.atMe = atMe ? JSON.parse(atMe) : false
    // 涉及到设置时变更(任何时候都需要有)
    this.memberNum = memberNum ? JSON.parse(memberNum) : 0
    this.isTop = isTop ? JSON.parse(isTop) : false
    this.isMute = isMute ? JSON.parse(isMute) : false
    this.isGroup = isGroup ? JSON.parse(isGroup) : false
  }
}

export {
  Tweet,
  SocketApi,
  SocketMessage,
  RecentContact
}
