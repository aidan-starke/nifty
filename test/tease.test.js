const { assert } = require('chai')

const NFT = artifacts.require('./NFT.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('NFT', accounts => {
  let contract

  before(async () => {
    contract = await NFT.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'NFT')
    })

    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'NF')
    })
  })

  describe('minting', async () => {
    it('creates a new token', async () => {
      const data = JSON.stringify({ nft: 'nfthash', metadata: 'metadatahash' })
      const result = await contract.mint(data)
      const totalSupply = await contract.totalSupply()

      assert.equal(totalSupply, 1)

      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      await contract.mint(data).should.be.rejected
    })
  })

  describe('indexing', async () => {
    it('indexes nfts', async () => {
      const data = JSON.stringify({ nft: 'nfthash', metadata: 'metadatahash' })
      const data1 = JSON.stringify({ nft: 'nfthash1', metadata: 'metadatahash1' })
      const data2 = JSON.stringify({ nft: 'nfthash2', metadata: 'metadatahash2' })
      const data3 = JSON.stringify({ nft: 'nfthash3', metadata: 'metadatahash3' })
      const expected = [data, data1, data2, data3]

      await contract.mint(data1)
      await contract.mint(data2)
      await contract.mint(data3)

      const totalSupply = await contract.totalSupply()

      const nft = await contract.nfts(0)
      const nft1 = await contract.nfts(1)
      const nft2 = await contract.nfts(2)
      const nft3 = await contract.nfts(3)

      assert.equal(totalSupply, 4)

      const result = [nft, nft1, nft2, nft3]

      assert.equal(result.join(','), expected.join(','))
    })
  })
})
