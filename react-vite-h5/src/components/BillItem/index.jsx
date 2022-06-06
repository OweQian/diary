import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { Cell } from 'zarm'
import { useNavigate } from 'react-router-dom'
import CustomIcon from '../CustomIcon'
import { typeMap } from '@/utils'
import style from './style.module.less'

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0) // 收入
  const [expense, setExpense] = useState(0) // 支出
  const navigateTo = useNavigate()

  useEffect(() => {
    const _income = bill.bills.filter(item => item.pay_type === 2).reduce((curr, item) => {
      curr += Number(item.amount)
      return curr
    }, 0)
    const _expense = bill.bills.filter(item => item.pay_type === 1).reduce((curr, item) => {
      curr += Number(item.amount)
      return curr
    }, 0)
    setIncome(_income)
    setExpense(_expense)
  }, [bill.bills])

  const goToDetail = (item) => {
    navigateTo(`/detail?id=${item.id}`)
  }

  return (
    <div className={style.item}>
      <div className={style.headerDate}>
        <div className={style.date}>{bill.date}</div>
        <div className={style.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>¥ {expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>¥ {income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {
        bill && bill.bills.map(item => {
          return (
            <Cell
              className={style.bill}
              key={item.id}
              onClick={() => goToDetail(item)}
              title={
                <>
                  <CustomIcon className={style.itemIcon} type={typeMap[item.type_id].icon}/>
                  <span>{ item.type_name }</span>
                </>
              }
              description={
                <span style={{color: item.pay_type === 2 ? 'red' : '#39be77'}}>{`${item.pay_type === 2 ? '+' : '-'}${item.amount}`}</span>
              }
              help={
                <div>
                  {dayjs(Number(item.date)).format('HH:mm')} {item.remark ? `| ${item.remark}` : ''}
                </div>
              }>
            </Cell>
          )
        })
      }
    </div>
  )
}

BillItem.propTypes = {
  bill: PropTypes.object
}

export default BillItem
