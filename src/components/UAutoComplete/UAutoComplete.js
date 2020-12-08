import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete'
import { makeStyles } from '@material-ui/core/styles'
import ActiveFormTextField from '../ActiveFormTextField'

const filter = createFilterOptions()

const useStyles = makeStyles(theme => ({
  controlStyle: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
}))
/**
 * UAutoComplete is an editable dropdown component.
 * User can enter the text in order to find the value from the list of values
 * User can also add new value to the list as well.
 */
export default function UAutoComplete({
  value,
  label,
  onChange,
  isRequired,
  onBlur,
  name,
  options,
  readOnly,
  minLength,
  maxLength,
  usedItemIds = [],
  allowContextSpecific = false,
  props,
}) {
  const classes = useStyles()
  //const dispatch = useDispatch()
  const [selectedValue, setSelectedValue] = useState(value || null) // for initialization: avoid the control to be a uncontrolled component with 'undefined'

  const handleChange = (event, newValue) => {
    // Create a new value from the user input
    if (newValue && newValue.inputValue) {
      setSelectedValue({
        text: newValue.inputValue,
      })
      onChange({
        text: newValue.inputValue,
      })
      return
    }
    setSelectedValue(newValue)
    onChange && onChange(newValue, name)
  }

  const handleFilter = (options, params) => {
    const filtered = filter(options, params)
    const labelForMessage = label && label.toLowerCase()
    // Suggest the creation of a new value
    if (params.inputValue !== '' && allowContextSpecific) {
      filtered.push({
        inputValue: params.inputValue,
        text: `Use context-specific ${
          labelForMessage ? labelForMessage : ''
        } "${params.inputValue}"`,
      })
    }
    return filtered
  }

  const handleGetOption = option => {
    // Value selected with enter, right from the input
    if (typeof option === 'string') {
      return option
    }
    // Add "new" option created dynamically
    if (option.inputValue) {
      return option.inputValue
    }
    // Regular option
    return option.text || ''
  }

  const handleOnBlur = e => {
    if (
      selectedValue &&
      selectedValue.text &&
      selectedValue.text.trim() !== ''
    ) {
      onBlur && onBlur(e, name)
    }
  }

  const controlOptions =
    options && options.length > 0
      ? options.filter(opt => !usedItemIds.includes(opt.id))
      : []

  return (
    <React.Fragment>
      {readOnly ? (
        <ActiveFormTextField
          multiline
          label={`${label}*`}
          variant="outlined"
          fullWidth
          readOnly={readOnly}
          value={selectedValue && selectedValue.text}
        />
      ) : (
        <Autocomplete
          value={selectedValue}
          getOptionSelected={option => option.id === selectedValue.id}
          onChange={(event, newValue) => handleChange(event, newValue)}
          filterOptions={(options, params) => handleFilter(options, params)}
          id="target-input"
          name={name}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={controlOptions}
          getOptionLabel={option => handleGetOption(option)}
          renderOption={option => option.text}
          onBlur={handleOnBlur}
          className={classes.controlStyle}
          freeSolo={allowContextSpecific}
          renderInput={params => (
            <ActiveFormTextField
              {...params}
              multiline
              label={`${label}${isRequired ? `*` : ``}`}
              variant="outlined"
              value={(selectedValue && selectedValue.text) || ''}
              validators={isRequired ? ['required', 'trim'] : ['trim']}
              fullWidth
              inputProps={{
                ...params.inputProps,
                minLength: minLength,
                maxLength: maxLength,
              }}
              maxLength={maxLength}
              counter
            />
          )}
        />
      )}
    </React.Fragment>
  )
}

UAutoComplete.propTypes = {
  /** selected value of the dropdown */
  value: PropTypes.object,
  /** label */
  label: PropTypes.string,
  /** options to display */
  options: PropTypes.array,
  /** dropdown on change event */
  onChange: PropTypes.func,
  /** enable required validator */
  isRequired: PropTypes.bool,
  /** enable required error in dropdown */
  hasError: PropTypes.bool,
  /** onBlur event for dropdown  */
  onBlur: PropTypes.func,
  /** name of the dropdown */
  name: PropTypes.string,
  /** max length text */
  maxLength: PropTypes.number,
  /** min length text */
  minLength: PropTypes.number,
}
