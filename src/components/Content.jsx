import React from 'react'
import { Route } from 'react-router'
import { makeStyles } from '@material-ui/core/styles'

import { Paper, Typography } from '@material-ui/core'

import Added from './Added'
import Browse from './Browse'
import Create from './Create'
import Prism from './Prism'

const useStyles = makeStyles(() => ({
  root: {
    textAlign: 'center',
    height: '600px',
  },
  img: {
    height: '550px',
  },
  title: {
    color: 'lightgrey',
    flex: 'wrap',
    marginBottom: '-10px',
  },
}))

function Content () {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Typography variant='h2' className={classes.title}>
        NFT
      </Typography>
      <Route path='/added' render={() => <Added />} />
      <Route path='/browse' render={() => <Browse />} />
      <Route path='/create' render={() => <Create />} />
      <Route exact path='/' render={() => <Prism />} />
    </Paper>
  )
}

export default Content
