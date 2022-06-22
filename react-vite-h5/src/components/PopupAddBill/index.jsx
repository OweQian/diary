import { useState, forwardRef, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon, Keyboard, Input, Toast } from 'zarm';
import PopupDate from "../PopupDate";
import CustomIcon from "../CustomIcon";
import { get, typeMap, post } from "@/utils";
import dayjs from 'dayjs';
import style from 'classnames';
import styles from './style.module.less'

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const [show, setShow] = useState(false)
  const [payType, setPayType] = useState('expense')
  const dateRef = useRef()
  const [date, setDate] = useState(new Date())
  const [amount, setAmount] = useState('')
  const [currentType, setCurrentType] = useState({})
  const [expense, setExpense] = useState([])
  const [income, setIncome] = useState([])
  const [remark, setRemark] = useState('')
  const [showRemark, setShowRemark] = useState(false)
  const id = detail && detail.id
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

  useEffect(() =>  {
    if (id) {
      setPayType(detail.pay_type === 1 ? 'expense' : 'income')
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name
      })
      setRemark(detail.remark)
      setAmount(detail.amount)
      setDate(dayjs(Number(detail.date)).$d)
    }
  }, [detail])

  useEffect(() => {
    get('/type/list').then(res => {
      const {
        data: {
          list,
        }
      } = res
      const _expense = list.filter(item => item.type === 1)
      const _income = list.filter(item => item.type === 2)
      setExpense(_expense)
      setIncome(_income)
      if (!id) {
        setCurrentType(_expense[0])
      }
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
      addBill()
      return
    }

    if (value === '.' && amount.includes('.')) return
    if (value !== '.' && amount.includes('.') && amount && amount.split('.')[1] >= 2) return
    setAmount(amount + value)
  }

  const addBill = () => {
    if (!amount) {
      Toast.show('请输入具体金额')
      return
    }
    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType === 'expense' ? 1 : 2,
      remark: remark || ''
    }
    if (id) {
      post('/bill/update').then(res => {
        Toast.show('修改成功')
      })
    } else {
      post('/bill/add', params).then(res => {
        setAmount('')
        setPayType('expense')
        setDate(new Date())
        setRemark('')
        setCurrentType(expense[0])
        Toast.show('添加成功')
      })
    }
    setShow(false)
    onReload && onReload()
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
                    <span>{item.name}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
        <div className={styles.remark}>
          {
            showRemark ? (
              <Input
                autoHeight
                showLength
                maxLength={50}
                type="text"
                rows={3}
                value={remark}
                placeholder="请输入备注信息"
                onChange={val => setRemark(val)}
                onBlur={() => setShowRemark(false)}/>
            ) : (
              <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
            )
          }
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  )
})

PopupAddBill.propTypes = {
  onReload: PropTypes.func,
}

export default PopupAddBill;
