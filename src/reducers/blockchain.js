import { SET_ACCOUNT, SET_CONTRACT, SET_HASHES, SET_IPFS } from '../actions'

function viewTasks (state = { account: '', hashes: {}, contract: {}, nfts: [] }, action) {
  switch (action.type) {
    case SET_ACCOUNT:
      state.account = action.account
      return state
    case SET_CONTRACT:
      state.contract = action.contract
      return state
    case SET_HASHES:
      state.hashes = action.hashes
      return state
    case SET_IPFS:
      state.ipfs = action.ipfs
      return state
    default:
      return state
  }
}

export default viewTasks
