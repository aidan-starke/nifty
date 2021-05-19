import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { concat } from 'uint8arrays'
import imageType from 'image-type'
import { Card, makeStyles, Link, Typography } from '@material-ui/core'

const useStyles = makeStyles(() => ({
  root: {
    margin: 'auto',
    marginTop: '10px',
    width: '20%',
  },
  img: {
    maxHeight: '200px'
  },
  button: {
    display: 'block',
    margin: 'auto',
  },
  link: {
    color: 'grey',
    textDecoration: 'underline'
  },
}))

function NFTCard ({ hashes, ipfs }) {
  const classes = useStyles()

  const [mounted, toggle] = useState(false)
  const [metadata, setMetadata] = useState({})
  const [image, setImage] = useState('')

  async function fetchMetadataFromIpfs () {
    for await (const file of ipfs.get(hashes.metaData)) {
      if (!file.content) continue

      let content = []

      for await (const chunk of file.content) {
        content.push(chunk)
      }

      content = concat(content)
      var string = new TextDecoder().decode(content)
      const data = JSON.parse(string)
      data.author = data.author.substring(0, Math.min(data.author.length, 12))

      setMetadata(data)
    }
  }

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
      toggle(true)
    }
  }

  useEffect(() => {
    fetchMetadataFromIpfs()
    fetchImageFromIpfs()
  }, [])

  return (
    <Card className={classes.root}>
      {mounted && <>
        <Card>
          <img src={image} className={classes.img} alt='nft-preview' />
        </Card>
        <Typography variant='h6'>Author</Typography>
        <Typography variant='body2'>{metadata.author}</Typography>

        <Typography variant='h6'>Title</Typography>
        <Typography variant='body2'>{metadata.title}</Typography>

        <Typography variant='h6'>Price</Typography>
        <Typography variant='body2'>{metadata.price}</Typography>

        <Link
          href={`ipfs://${hashes.file}`}
          target='_blank'
          className={classes.link}>
          {/* IPFS Companion required */}
          <Typography variant='h6'>View Full Size Image</Typography>
        </Link>
      </>}
    </Card>
  )
}

function mapStateToProps (state) {
  return {
    ipfs: state.blockchain.ipfs,
  }
}

export default connect(mapStateToProps)(NFTCard)
