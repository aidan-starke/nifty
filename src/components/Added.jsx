import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { concat } from 'uint8arrays'
import imageType from 'image-type'

function Added ({ blockchain }) {
  const { hashes, ipfs } = blockchain

  const [image, setImage] = useState('')

  async function fetchImageFromIpfs () {
    for await (const file of ipfs.get(hashes.file)) {
      if (!file.content) continue

      let content = []

      for await (const chunk of file.content) {
        content.push(chunk)
      }

      const arrayBufferView = new Uint8Array(concat(content))
      const blob = new Blob([arrayBufferView], { type: imageType(arrayBufferView).mime })

      const urlCreator = window.URL || window.webkitURL
      const imageUrl = urlCreator.createObjectURL(blob)

      setImage(imageUrl)
    }
  }

  useEffect(() => {
    fetchImageFromIpfs()
  }, [])

  return <img src={image} alt='added-nft' style={{ maxHeight: '500px' }} />
}

function mapStateToProps (state) {
  return {
    blockchain: state.blockchain,
  }
}

export default connect(mapStateToProps)(Added)
