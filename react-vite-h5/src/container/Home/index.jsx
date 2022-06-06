import { useState, useEffect } from 'react'
import { Icon, Pull } from 'zarm'
import BillItem from '@/components/BillItem'
import dayjs from 'dayjs'
import { get, REFRESH_STATE, LOAD_STATE } from '@/utils'
import style from './style.module.less'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format('YYYY-MM'))
  const [page, setPage] = useState(1)
  const [list, setList] = useState([])
  const [totalPage, setTotalPage] = useState(0)
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal)
  const [loading, setLoading] = useState(LOAD_STATE.normal)

  useEffect(() => {
    getBillList()
  }, [page])

  const getBillList = () => {
    get(`/bill/list?page=${page}&page_size=5&date=${currentTime}`).then(
      res => {
        const {
          data: {
            list: bill,
            totalPage
          }
        } = res
        if (page === 1) {
          setList(bill)
        } else {
          setList(list.concat(bill))
        }
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
  return (
    <div className={style.home}>
      <div className={style.header}>
        <div className={style.dataWrap}>
          <span className={style.expense}>
            总支出：<b>¥ 200</b>
          </span>
          <span className={style.income}>
            总收入：<b>¥ 500</b>
          </span>
        </div>
        <div className={style.typeWrap}>
          <div className={style.left}>
            <span className={style.title}>
              类型 <Icon className={style.arrow} type="arrow-bottom"/>
            </span>
          </div>
          <div className={style.right}>
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
    </div>
  )
}

export default Home
