import React, { useEffect, useState } from 'react'
import { Alert } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { TMessageError } from 'types/common'

type TProps = {
  errors: TMessageError[]
}

export const FormError: React.FC<TProps> = ({ errors }) => {
  const [state, setState] = useState<React.ReactElement[]>([])

  useEffect(() => {
    const temp: React.ReactElement[] = []

    for (let i = 0, len = errors.length; i < len; i++) {
      const item = Object.values(errors[i])[0]
      const keys = Object.keys(errors[i])
      temp.push(
        <div key={`error_${keys[0]}`}>
          <CloseCircleFilled style={{ color: 'red' }} /> {item[0]}
        </div>
      )
    }

    setState(temp)
  }, [])

  return (
    <div>
      <Alert type="error" description={state} />
    </div>
  )
}
