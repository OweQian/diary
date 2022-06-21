import { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';
import styles from "../PopupType/style.module.less";

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false)
  const [now, setNow] = useState(new Date())

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

  const closeMonth = (item) => {
    setNow(item)
    setShow(false)
    if (mode === 'month') {
      onSelect(dayjs(item).format('YYYY-MM'))
    } else if (mode === 'date') {
      onSelect(dayjs(item).format('YYYY-MM-DD'))
    }
  }

  return (
    <Popup
      visible={show}
      onMaskClick={() => setShow(false)}
      direction="bottom"
      destroy={false}
      mountContainer={false}
    >
      <div className={styles.popupDate}>
        <DatePicker
          value={now}
          mode={mode}
          onOk={closeMonth}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  )
})

PopupDate.propTypes = {
  mode: PropTypes.string,
  onSelect: PropTypes.func
}

export default PopupDate;