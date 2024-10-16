import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api/products',
})

export default {
  getAll() {
    return api.get('/')
  },
  get(id) {
    return api.get(`/${id}`)
  },
  create(data) {
    return api.post('/', data)
  },
  update(id, data) {
    return api.put(`/${id}`, data)
  },
  delete(id) {
    return api.delete(`/${id}`)
  },
}
