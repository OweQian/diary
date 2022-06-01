import { Button } from 'zarm'
import style from './style.module.less'
const Index = () => {
  return (
    <div className={style.index}>
      <span>Index</span>
      <Button theme="primary">按钮</Button>
    </div>
  )
}

export default Index