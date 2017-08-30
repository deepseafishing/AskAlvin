import React from 'react'
import { Button, Icon } from 'react-materialize'

export default ({ isLoading, text, loadingText, disabled = false, ...props }) =>
  <Button disabled={disabled || isLoading} {...props}>
    {isLoading ? loadingText : text}
{
  isLoading
    ? <Icon left className="spinning">
        refresh
      </Icon>
    : <Icon left className="white-text">
        done
      </Icon>
}
  </Button>
