import { axios } from '@/utils/request'

const api = {
  workplace: '/portal/workplace/myself',
  card: '/portal/workplace/move',
  notice: '/workplace/notice'
}

export default api

export function getWorkplace (parameter) {
  return axios({
    url: api.workplace,
    method: 'get',
    params: parameter
  })
}

export function moveCard (parameter) {
  return axios({
    url: api.card,
    method: 'post',
    params: parameter
  })
}
/**
 * 工作舱-公告、首页右上角消息弹窗
 * created by fanjiao
 */
export function getNotice (parameter) {
  return axios({
    url: api.notice,
    method: 'get',
    params: parameter
  })
}
