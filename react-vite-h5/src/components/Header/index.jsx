import PropTypes from 'prop-types';
import { NavBar, Icon } from 'zarm';
import { useNavigate } from 'react-router-dom';

import styles from './style.module.less'

const Header = ({ title = '' }) => {
  const navigate = useNavigate()

  return (
    <div className={styles.headerWrap}>
      <div className={styles.block}>
        <NavBar
          className={styles.header}
          left={<Icon type="arrow-left" theme="primary" onClick={() => navigate(-1)} />}
          title={title}/>
      </div>
    </div>
  )
}

Header.propTypes = {
  title: PropTypes.string
}

export default Header;
