export const SET_ACCOUNT = 'SET_ACCOUNT'
export const SET_HASHES = 'SET_HASHES'
export const SET_IPFS = 'SET_IPFS'
export const SET_CONTRACT = 'SET_CONTRACT'

export function mapAccountToStore (account) {
  return {
    type: SET_ACCOUNT,
    account,
  }
}

export function mapContractToStore (contract) {
  return {
    type: SET_CONTRACT,
    contract
  }
}

export function mapHashesToStore (hashes) {
  return {
    type: SET_HASHES,
    hashes,
  }
}

export function mapIpfsToStore (ipfs) {
  return {
    type: SET_IPFS,
    ipfs,
  }
}
