const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'http://cnodejs.org/api/v1'

router.post('/login', function(req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        // 只有在处理登陆后才加上session
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url,
        }
        res.json({
          success: true,
          data: resp.data,
        })
      }
    })
    .catch(err => {
      if (err.response) { // 如果是服务端返回端错误
        res.json({
          success: false,
          data: err.response.data // err.response 嵌套太多
        })
      } else {
        next(err) // 抛给全局的错误处理
      }
    })
})

module.exports = router
