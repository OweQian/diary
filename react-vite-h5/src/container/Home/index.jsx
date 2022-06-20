import { useState, useEffect, useRef } from 'react'
import { Icon, Pull } from 'zarm'
import BillItem from '@/components/BillItem'
import PopupType from "@/components/PopupType"
import PopupDate from "@/components/PopupDate"
import PopupAddBill from "@/components/PopupAddBill"
import dayjs from 'dayjs'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'
import style from './style.module.less'
import CustomIcon from '@/components/CustomIcon'

const Home = () => {
  const typeRef = useRef()
  const monthRef = useRef()
  const addRef = useRef()
  const [currentSelect, setCurrentSelect] = useState({})
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  const [loading, setLoading] = useState(LOAD_STATE.normal)
  const [totalExpense, setTotalExpense] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)

  useEffect(() => {
    getBillList()
  }, [page, currentTime, currentSelect])

  const getBillList = () => {
    get(`/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${currentSelect.id || 'all'}`).then(
      res => {
        const {
          data: {
            list: bill,
            totalExpense,
            totalIncome,
            totalPage
          }
        } = res
        if (page === 1) {
          setList(bill)
        } else {
          setList(list.concat(bill))
        }
        setTotalExpense(totalExpense.toFixed(2))
        setTotalIncome(totalIncome.toFixed(2))
        setTotalPage(totalPage)
        setRefreshing(REFRESH_STATE.normal)
        setLoading(LOAD_STATE.success)
      }
    )
  }

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading)
    if (page !== 1) {
      setPage(1)
    } else {
      getBillList()
    }
  }

  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading)
      setPage(page + 1)
    }
  }

  const toggle = () => {
    typeRef.current && typeRef.current.show()
  }

  const monthToggle = () => {
    monthRef.current && monthRef.current.show()
  }

  const addToggle = () => {
    addRef.current && addRef.current.show()
  }

  const select = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentSelect(item)
  }

  const monthSelect = (item) => {
    setRefreshing(REFRESH_STATE.loading)
    setPage(1)
    setCurrentTime(item)
  }

  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <span className={style.expense}>
            总支出：<b>¥ {totalExpense}</b>
          </span>
          <span className={style.income}>
            总收入：<b>¥ {totalIncome}</b>
          </span>
        </div>
        <div className={style.typeWrap}>
          <div className={style.left} onClick={toggle}>
            <span className={style.title}>
              {currentSelect.name || '全部类型'} <Icon className={style.arrow} type="arrow-bottom"/>
            </span>
          </div>
          <div className={style.right} onClick={monthToggle}>
            <span className={style.time}>
              2022-06 <Icon className={style.arrow} type="arrow-bottom"/>
            </span>
          </div>
        </div>
      </div>
      <div className={style.contentWrap}>
        {
          list.length ? (
            <Pull
              animationDuration={200}
              stayTime={400}
              refresh={{
                state: refreshing,
                handler: refreshData
              }}
              load={{
                state: loading,
                distance: 200,
                handler: loadData
              }}>
              {
                list.map((item, index) => <BillItem bill={item} key={index} />)
              }
            </Pull>
          ) : null
        }
      </div>
      <PopupType ref={typeRef} onSelect={select} />
      <PopupDate ref={monthRef} onSelect={monthSelect} />
      <PopupAddBill ref={addRef} />
      <div className={style.add} onClick={addToggle}><CustomIcon type="tianjia" /></div>
    </div>
  )
}

export default Home
