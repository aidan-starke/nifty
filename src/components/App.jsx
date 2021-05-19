import React from 'react'

import { Container, makeStyles } from '@material-ui/core'

import Header from './Header'
import Content from './Content'
import Footer from './Footer'

const useStyles = makeStyles(() => ({
  root: {
    padding: '20px',
  },
}))

function App () {
  const classes = useStyles()

  return (
    <>
      <Header />
      <Container className={classes.root}>
        <Content />
      </Container>
      <Footer />
    </>
  )
}

export default App
