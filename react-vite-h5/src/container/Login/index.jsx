import { useState, useCallback } from 'react'
import { Cell, Button, Input, Checkbox, Toast } from 'zarm'
import CustomIcon from '@/components/CustomIcon'
import Captcha from 'react-captcha-code'
import { post } from '@/utils'
import style from './style.module.less'

const Login = () => {
  const [username, setUsername] = useState('') // 账号
  const [password, setPassword] = useState('') // 密码
  const [verify, setVerify] = useState('') // 验证码
  const [captcha, setCaptcha] = useState('') // 验证码存值

  const handleChange = useCallback((captcha) => {
    console.log('captcha', captcha)
    setCaptcha(captcha)
  }, [])

  const onSubmit = () => {
    if (!username) {
      Toast.show('请输入账号')
      return
    }
    if (!password) {
      Toast.show('请输入密码')
      return
    }
    if (!verify) {
      Toast.show('请输入验证码')
      return
    }
    if (verify !== captcha) {
      Toast.show('验证码错误')
      return
    }
    post('/user/register', {
      username,
      password
    }).then(res => {
      Toast.show('注册成功')
    }).catch(e => {
      console.error(e)
      Toast.show('系统错误')
    })
  }

  return (
    <div className={style.auth}>
      <div className={style.head} />
      <div className={style.tab}>
        <span>注册</span>
      </div>
      <div className={style.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={value => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={value => setPassword(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入验证码"
            onChange={value => setVerify(value)}
          />
          <Captcha charNum={4} onChange={handleChange} />
        </Cell>
      </div>
      <div className={style.operation}>
        <div className={style.agree}>
          <Checkbox />
          <label className="text-align">阅读并同意<a>《手札条款》</a></label>
        </div>
        <Button onClick={onSubmit} block theme="primary">注册</Button>
      </div>
    </div>
  )
}

export default Login
