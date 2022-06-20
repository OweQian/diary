import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'zarm';
import style from 'classnames';
import styles from './style.module.less'
import { get } from '@/utils';

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false)
  const [active, setActive] = useState('all')
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  if (ref) {
    ref.current = {
      show: () => {
        setShow(true)
      },
      close: () => {
        setShow(false)
      }
    }
  }
  useEffect(() => {
    get('/type/list').then(res => {
      const {
        data: {
          list,
        }
      } = res
      setExpense(list.filter(item => item.type === 1))
      setIncome(list.filter(item => item.type === 2))
    })
  }, [])

  const choseType = (item) => {
    setActive(item.id)
    setShow(false)
    onSelect(item)
  }

  return (
    <Popup
      visible={show}
      onMaskClick={() => setShow(false)}
      direction="bottom"
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={styles.popupType}>
        <div className={styles.header}>
          请选择类型
          <Icon
            type="wrong"
            className={styles.cross}
            onClick={() => setShow(false)} />
        </div>
        <div className={styles.content}>
          <div
            onClick={() => choseType({id: 'all'})}
            className={style({[styles.all]: true, [styles.active]: active === 'all'})}>全部类型</div>
          <div className={style.title}>支出</div>
          <div className={style.expenseWrap}>
            {
              expense.map((item, index) => {
                return (
                  <p
                    key={index}
                    onClick={() => choseType(item)}
                    className={style({[styles.active]: active === item.id})}>
                    {item.name}
                  </p>
                )
              })
            }
          </div>
          <div className={style.title}>收入</div>
          <div className={style.incomeWrap}>
            {
              income.map((item, index) => {
                return (
                  <p
                    key={index}
                    onClick={() => choseType(item)}
                    className={style({[styles.active]: active === item.id})}>
                    {item.name}
                  </p>
                )
              })
            }
          </div>
        </div>
      </div>
    </Popup>
  )
})

PopupType.propTypes = {
  onSelect: PropTypes.func
}

export default PopupType;