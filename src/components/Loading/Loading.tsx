import React from 'react'
import classes from './Loading.module.scss'
import { Spin } from 'antd'

const Loading: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className={classes['overlay-loading']}>
      <Spin className="loading" size="large" tip={message} />
    </div>
  )
}

export default Loading
