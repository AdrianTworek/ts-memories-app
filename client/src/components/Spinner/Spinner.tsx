import { FC } from 'react'

import { CircularProgress } from '@material-ui/core'

interface Props {
  gutterTop?: string
  color?: 'inherit' | 'primary' | 'secondary' | undefined
  size?: number
  thickness?: number
}

const Spinner: FC<Props> = ({ gutterTop, color, size, thickness }) => {
  return (
    <div style={{ display: 'grid', placeItems: 'center' }}>
      <CircularProgress
        style={{ marginTop: gutterTop }}
        color={color}
        size={size}
        thickness={thickness}
      />
    </div>
  )
}

export default Spinner
