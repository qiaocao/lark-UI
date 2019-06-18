import { axios } from '@/utils/request'

const api = {
  workplace: '/portal/workplace/myself',
  card: '/portal/workplace/move'
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
