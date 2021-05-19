import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import NFTCard from './NFTCard'

function Browse ({ contract }) {
  const [mounted, toggle] = useState(false)
  const [nfts, setNfts] = useState([])

  async function loadNfts () {
    const totalSupply = await contract.methods.totalSupply().call()

    let result = []
    for (let i = 1; i <= totalSupply; i++) {
      let nft = await contract.methods.nfts(i - 1).call()
      result.push(JSON.parse(nft))
    }
    setNfts(result)

    toggle(true)
  }

  useEffect(() => {
    loadNfts()
  }, [])


  return (
    <div style={{ display: 'flex' }}>
      {mounted && nfts.map((nft, i) => <NFTCard key={i} hashes={nft} />)}
    </div>
  )
}

function mapStateToProps (state) {
  return {
    contract: state.blockchain.contract
  }
}

export default connect(mapStateToProps)(Browse)
