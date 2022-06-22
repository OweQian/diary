import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Modal, Toast } from 'zarm';
import dayjs from 'dayjs'
import style from 'classnames'
import Header from '@/components/Header'
import CustomIcon from "@/components/CustomIcon";
import styles from './style.module.less'
import { get, typeMap, post } from '@/utils'
import PopupAddBill from '@/components/PopupAddBill'

const Detail = () => {
  const [detail, setDetail] = useState({})
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const editRef = useRef()

  useEffect(() => {
    getDetail()
  }, [])

  const getDetail = () => {
    get(`/bill/detail?id=${params.getAll('id')[0]}`)
      .then(res => {
        const {
          data
        } = res
        setDetail(data)
      })
  }

  const deleteDetail = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: () => {
        post('/bill/delete', {
          id: params.getAll('id')[0]
        }).then(res => {
          Toast.show('删除成功')
          navigate(-1)
        })
      }
    })
  }

  const editDetail = () => {
    editRef.current && editRef.current.show()
  }

  return (
    <div className={styles.detail}>
      <Header title="账单详情" />
      <div className={styles.card}>
        <div className={styles.type}>
          <span className={style({[styles.expense]: detail.pay_type === 1, [styles.income]: detail.pay_type === 2})}>
            <CustomIcon className={styles.iconfont} type={detail.type_id ? typeMap[detail.type_id].icon : 1} />
          </span>
          <span>{ detail.type_name || '' }</span>
        </div>
        {
          detail.pay_type === 1
            ? <div className={style(styles.amount, styles.expense)}>-{ detail.amount }</div>
            : <div className={style(styles.amount, styles.income)}>+{ detail.amount }</div>
        }
        <div className={styles.info}>
          <div className={styles.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format('YYYY-MM-DD HH:mm')}</span>
          </div>
          <div className={styles.remark}>
            <span>备注</span>
            <span>{ detail.remark || '-' }</span>
          </div>
        </div>
        <div className={styles.operation}>
          <span onClick={deleteDetail}><CustomIcon type="shanchu" />删除</span>
          <span onClick={editDetail}><CustomIcon type="tianjia" />编辑</span>
        </div>
      </div>
      <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
    </div>
  )
}

export default Detail
