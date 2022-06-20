import { useState, forwardRef, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Keyboard } from 'zarm';
import PopupDate from "../PopupDate";
import CustomIcon from "../CustomIcon";
import { get, typeMap } from "@/utils";
import dayjs from 'dayjs';
import style from 'classnames';
import styles from './style.module.less'

const PopupAddBill = forwardRef((props, ref) => {
  const [show, setShow] = useState(false)
  const [payType, setPayType] = useState('expense')
  const dateRef = useRef()
  const [date, setDate] = useState(new Date())
  const [amount, setAmount] = useState('')
  const [currentType, setCurrentType] = useState({})
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
    get('type/list').then(res => {
      const {
        data: {
          list,
        }
      } = res
      const _expense = list.filter(item => item.type === 1)
      const _income = list.filter(item => item.type === 2)
      setExpense(_expense)
      setIncome(_income)
      setCurrentType(_expense[0])
    })
  }, [])

  const selectDate = val => {
    setDate(val)
  }

  const toggleDate = () => {
    dateRef.current && dateRef.current.show()
  }

  const handleMoney = value => {
    value = String(value)

    if (value === 'delete') {
      let _amount = amount.slice(0, amount.length -1)
      setAmount(_amount)
      return
    }

    if (value === 'ok') {
      return
    }

    if (value === '.' && amount.includes('.')) return
    if (value !== '.' && amount.includes('.') && amount && amount.split('.')[1] >= 2) return
    setAmount(amount + value)
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={false}>
      <div className={styles.addWrap}>
        <header className={styles.header}>
          <span className={styles.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        <div className={styles.filter}>
          <div className={styles.type}>
            <span onClick={() => setPayType('expense')} className={style({[styles.expense]: true, [styles.active]: payType === 'expense'})}>支出</span>
            <span onClick={() => setPayType('income')} className={style({[styles.income]: true, [styles.active]: payType === 'income'})}>收入</span>
          </div>
          <div className={styles.time} onClick={toggleDate}>
            {dayjs(date).format('MM-DD')} <Icon className={styles.arrow} type="arrow-bottom" />
          </div>
        </div>
        <div className={styles.money}>
          <span className={styles.sufix}>¥</span>
          <span className={style(styles.amount, styles.animation)}>{amount}</span>
        </div>
        <div className={styles.typeWarp}>
          <div className={styles.typeBody}>
            {
              (payType === 'expense' ? expense : income).map(item => {
                return (
                  <div onClick={() => setCurrentType(item)} key={item.id} className={styles.typeItem}>
                    <span className={style({[styles.iconfontWrap]: true, [styles.expense]: payType === 'expense', [styles.income]: payType === 'income', [styles.active]: currentType.id === item.id})}>
                      <CustomIcon className={styles.iconfont} type={typeMap[item.id].icon}/>
                    </span>
                    <span>{ item.name }</span>
                  </div>
                )
              })
            }
          </div>
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
})

export default PopupAddBill;
