import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  Container,
  makeStyles,
  TextField,
} from '@material-ui/core'
import { mapHashesToStore } from '../actions'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    textAlign: 'center',
    width: '300px',
    margin: 'auto',
    marginTop: '10px',
  },
  flex: {
    margin: theme.spacing(1),
    display: 'flex',
  },
  input: {
    display: 'none',
  },
}))

function Create ({ blockchain, history, dispatch }) {
  const classes = useStyles()
  const { account, contract, ipfs } = blockchain

  const [file, setFile] = useState()
  const [hashes, setHashes] = useState()

  const [state, setState] = useState({
    title: '',
    price: '',
  })

  function handleChange (data) {
    setState({
      ...state,
      [data.name]: data.value,
    })
  }

  async function pinFileToIpfs (file) {
    try {
      const addedFile = await ipfs.add(file)
      const fileHash = addedFile.cid.toString()

      const metadata = {
        author: account,
        hash: fileHash,
        title: state.title,
        price: state.price,
      }

      const addedMetaData = await ipfs.add(JSON.stringify(metadata))
      const metaDataHash = addedMetaData.cid.toString()

      setHashes({ file: fileHash, metaData: metaDataHash })
    } catch (err) {
      console.error(err)
    }
  }

  async function mint () {
    await contract.methods.mint(JSON.stringify(hashes)).send({ from: account })
      .once('receipt', receipt => {
        console.log('receipt', receipt)
        history.push('/added')
      })
  }

  useEffect(() => {
    if (hashes) {
      dispatch(mapHashesToStore(hashes))
      mint()
    }
  }, [hashes])

  return (
    <Card className={classes.root}>
      <Container className={classes.flex}>
        <TextField
          size='small'
          name='title'
          label='Title'
          variant='outlined'
          value={state.title}
          onChange={e => handleChange(e.target)}
        />
      </Container>
      <Container className={classes.flex}>
        <TextField
          size='small'
          name='price'
          label='Price'
          variant='outlined'
          value={state.price}
          onChange={e => handleChange(e.target)}
        />
      </Container>
      <input
        accept='image/*'
        className={classes.input}
        id='contained-button-file'
        multiple
        type='file'
        onChange={e => setFile(e.target.files[0])}
      />
      <label htmlFor='contained-button-file'>
        <Button variant='contained' color='primary' component='span'>
          Upload
        </Button>
      </label>
      <Button onClick={() => pinFileToIpfs(file)}>Mint NFT</Button>
    </Card>
  )
}

function mapStateToProps (state) {
  return {
    blockchain: state.blockchain,
  }
}

export default connect(mapStateToProps)(withRouter(Create))
