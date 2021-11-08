import { useState } from 'react'

interface Props {
  initialState: any
  validateOnChange: boolean
  validate: Function
}

const useForm = ({ initialState, validateOnChange, validate }: Props) => {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState<any>(initialState)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (validateOnChange) {
      validate({ [name]: value })
    }
  }

  const resetForm = () => {
    setFormData(initialState)
    setErrors({})
  }

  return [
    formData,
    setFormData,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  ] as const
}

export default useForm
