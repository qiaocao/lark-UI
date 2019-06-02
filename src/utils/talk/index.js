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
   * @param {*} data 数据对象
   */
  constructor (code, data) {
    if (typeof code === 'number') { this.code = code }
    if (data instanceof Object) { this.data = data }
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
   */
  constructor (id, username, avatar, fromId, toId, atId, secretLevel, type, content, time, isGroup) {
    // if (id instanceof String) { this.id = id } else { throw Error('id 数据类型错误') }
    this.id = id
    // if (avatar instanceof String) { this.avatar = avatar } else { throw Error('avatar 数据类型错误') }
    this.avatar = avatar
    // if (username instanceof String) { this.username = username } else { throw Error('username 数据类型错误') }
    this.username = username
    // if (fromId instanceof String) { this.fromId = fromId } else { throw Error('fromId 数据类型错误') }
    this.fromId = fromId
    // if (toId instanceof String) { this.toId = toId } else { throw Error('toId 数据类型错误') }
    this.toId = toId
    // if (atId instanceof Array) { this.atId = atId } else { throw Error('atId 数据类型错误') }
    this.atId = atId
    // if (secretLevel instanceof Number) { this.secretLevel = secretLevel } else { throw Error('secretLevel 数据类型错误') }
    this.secretLevel = secretLevel
    // if (type instanceof Number) { this.type = type } else { throw Error('type 数据类型错误') }
    this.type = type
    // if (time instanceof Date) { this.time = time } else { throw Error('time 数据类型错误') }
    this.time = time
    // if (code instanceof Number) { this.code = code } else { throw Error('code 数据类型错误') }
    this.isGroup = isGroup
    // if (content instanceof String || content instanceof Object) { this.content = content } else { throw Error('content 数据类型错误') }
    this.content = content
  }
}

export {
  Tweet,
  SocketApi,
  SocketMessage
}
