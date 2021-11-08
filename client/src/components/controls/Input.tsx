import { FC, Ref, forwardRef } from 'react'
import { Grid, TextField, InputAdornment, IconButton } from '@material-ui/core'

import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'

interface Props {
  name: string
  label: string
  type: string
  className?: string
  multiline?: boolean
  minRows?: number
  maxRows?: number
  variant?: string
  ref?: Ref<HTMLElement>
  value?: string
  error?: any
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  half?: boolean
  handleVisiblePassword?: () => void
  InputLabelProps?: {}
}

interface Props {
  ref?: Ref<HTMLElement>
}

const Input: FC<Props> = forwardRef(
  (
    {
      name,
      label,
      type,
      className,
      multiline,
      minRows,
      maxRows,
      variant,
      value,
      error = null,
      half,
      onChange,
      handleVisiblePassword,
      InputLabelProps,
    },
    ref
  ) => {
    return (
      <Grid item xs={12} sm={half ? 6 : 12}>
        <TextField
          name={name}
          label={label}
          type={type}
          className={className}
          ref={ref}
          multiline={multiline}
          minRows={minRows}
          maxRows={maxRows}
          variant={variant || 'outlined'}
          value={value}
          {...(error && { error: true, helperText: error })}
          onChange={onChange}
          fullWidth
          InputLabelProps={InputLabelProps}
          InputProps={
            name === 'password' || name === 'confirmPassword'
              ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleVisiblePassword}>
                        {type === 'password' ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              : undefined
          }
        ></TextField>
      </Grid>
    )
  }
)

export default Input
