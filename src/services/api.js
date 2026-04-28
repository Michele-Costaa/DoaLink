import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api-doalink.onrender.com'
})

export default api