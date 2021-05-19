import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Web3 from 'web3'
import { create } from 'ipfs-http-client'
import NFT from '../artifacts/NFT.json'
import { withRouter } from 'react-router-dom'
import useWindowSize from '../utils/useWindowSize'
import { mapAccountToStore, mapContractToStore, mapIpfsToStore } from '../actions'
import { makeStyles } from '@material-ui/core/styles'
import {
  Button,
  Breadcrumbs,
  Toolbar,
  Menu,
  MenuItem,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  center: {
    margin: 'auto',
    position: 'relative',
  },
}))

function Header ({ history }) {
  const dispatch = useDispatch()
  const [mounted, toggle] = useState(false)
  const [account, setAccount] = useState('')
  const [myContract, setMyContract] = useState()

  async function loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      window.ethereum.autoRefreshOnNetworkChange = false
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  async function loadBlockChainData () {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()

    setAccount(accounts[0])
    dispatch(mapAccountToStore(accounts[0]))

    const networkId = await web3.eth.net.getId()
    const networkData = NFT.networks[networkId]

    if (networkData) {
      const abi = NFT.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      setMyContract(contract)
      dispatch(mapContractToStore(contract))
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  useEffect(() => {
    if (!myContract) {
      dispatch(mapIpfsToStore(create('/ip4/127.0.0.1/tcp/5002')))
      connect()
    } else toggle(true)
  }, [myContract])

  async function connect () {
    await loadWeb3()
    await loadBlockChainData()
  }

  const { width } = useWindowSize()
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <Button size='large' onClick={() => history.push('/')}>
          NFT
        </Button>

        {width <= 768 && (
          <>
            <Button
              aria-controls='simple-menu'
              aria-haspopup='true'
              onClick={e => setAnchorEl(e.currentTarget)}
              className={classes.center}>
              Menu
            </Button>
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => setAnchorEl(null)}>
                <Typography onClick={() => history.push('/')}>Home</Typography>
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)} to='/browse'>
                <Typography onClick={() => history.push('/browse')}>
                  Browse
                </Typography>
              </MenuItem>
              <MenuItem onClick={() => setAnchorEl(null)} to='/create'>
                <Typography onClick={() => history.push('/create')}>
                  Create
                </Typography>
              </MenuItem>
            </Menu>
          </>
        )}
        {width >= 768 && (
          <Breadcrumbs aria-label='breadcrumb' className={classes.center}>
            <Button color='inherit' onClick={() => history.push('/')}>
              Home
            </Button>
            <Button color='inherit' onClick={() => history.push('/browse')}>
              Browse
            </Button>
            <Button color='inherit' onClick={() => history.push('/create')}>
              Create
            </Button>
          </Breadcrumbs>
        )}
        {!mounted && (
          <Button variant='outlined' size='small' onClick={connect}>
            connect
          </Button>
        )}

        {mounted && (
          <Typography
            variant='caption'
            style={{ maxWidth: '100px', marginRight: 0 }}>
            {account.substring(0, Math.min(account.length, 12))}
          </Typography>
        )}
      </Toolbar>
    </>
  )
}

export default withRouter(Header)
