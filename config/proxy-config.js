module.exports = {
  boundary: {
    domain: 'https://www.boundaryproject.io',
    host: '(www\\.boundaryproject\\.io|test-bd\\.hashi-mktg\\.com)',
    assets: [
      '/files/press-kit.zip',
      '/data/vault/boundary-controller-policy.hcl',
    ],
  },
  // consul: {
  //   domain: 'https://test-cs.hashi-mktg.com',
  //   host: 'test-cs.hashi-mktg.com',
  //   assets: [],
  // },
  nomad: {
    domain: 'https://test-nm.hashi-mktg.com',
    host: 'test-nm.hashi-mktg.com',
    assets: ['/files/press-kit.zip'],
  },
  // packer: {
  //   domain: 'https://test-pk.hashi-mktg.com',
  //   host: 'test-pk.hashi-mktg.com',
  //   assets: [],
  // },
  sentinel: {
    // actually https://docs.hashicorp.com, but using test-st.hashi-mktg.com as a test
    domain: 'https://test-st.hashi-mktg.com',
    host: 'test-st.hashi-mktg.com',
    assets: [],
  },
  // terraform: {
  //   domain: 'https://test-tf.hashi-mktg.com',
  //   host: 'test-tf.hashi-mktg.com',
  //   assets: [],
  // },
  // vagrant: {
  //   domain: 'https://test-vg.hashi-mktg.com',
  //   host: 'test-vg.hashi-mktg.com',
  //   assets: [],
  // },
  vault: {
    domain: 'https://test-vt.hashi-mktg.com',
    host: 'test-vt.hashi-mktg.com',
    assets: ['/files/press-kit.zip'],
  },
  waypoint: {
    domain: 'https://www.waypointproject.io',
    host: '(www\\.waypointproject\\.io|test-wp\\.hashi-mktg\\.com)',
    assets: ['/files/press-kit.zip'],
  },
}