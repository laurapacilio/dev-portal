import { ReactElement, useMemo } from 'react'
import { useRouter } from 'next/router'
import semverRSort from 'semver/functions/rsort'
import { useCurrentProduct } from 'contexts'
import EmptyLayout from 'layouts/empty'
import Card from 'components/card'
import Text from 'components/text'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import { ReleasesAPIResponse } from 'lib/fetch-release-data'
import s from './product-downloads-view.module.css'

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus vitae leo id nunc convallis euismod et vel erat. Fusce vel velit turpis. Vivamus fringilla consequat metus, vitae euismod sem eleifend in. Morbi in ullamcorper dui. Quisque rutrum auctor tristique. Vivamus ac turpis non arcu fringilla interdum. Aliquam feugiat lectus ipsum, eu tincidunt mi tristique id. Aliquam sodales eros semper pharetra molestie. Mauris porta, nunc in tempor eleifend, metus massa sagittis nisi, non maximus quam mauris a erat. Duis nec risus diam. Aenean auctor accumsan ipsum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Fusce et sagittis nunc. Cras vel eros id purus sollicitudin lobortis. Vivamus hendrerit volutpat nulla.'

const WaypointDownloadsSidecarContent = () => {
  return (
    <>
      <Card elevation="base">
        <Text className={s.sidecarCardLabel} size={200} weight="semibold">
          Lorem ipsum
        </Text>
        <Text className={s.sidecarCardText} size={200}>
          This is a test to show that the Sidecar component can now render
          custom content by page.
        </Text>
      </Card>
    </>
  )
}

interface ProductDownloadsViewProps {
  latestVersion: string
  releases: ReleasesAPIResponse
}

const ProductDownloadsView = ({
  latestVersion,
  releases,
}: ProductDownloadsViewProps): ReactElement => {
  const router = useRouter()
  const currentProduct = useCurrentProduct()
  const backToLink = {
    text: 'Back to Waypoint',
    url: '/waypoint',
  }
  const navData = [
    ...currentProduct.sidebar.landingPageNavData,
    { divider: true },
    ...currentProduct.sidebar.resourcesNavData,
  ]
  const versionSwitcherOptions = useMemo(() => {
    return semverRSort(Object.keys(releases.versions)).map((version) => {
      const isLatest = version === latestVersion
      return {
        label: `${version}${isLatest ? ' (latest)' : ''}`,
        value: version,
      }
    })
  }, [latestVersion, releases.versions])

  // TODO: currently shows placeholder content for testing purposes
  return (
    <SidebarSidecarLayout
      backToLink={backToLink}
      navData={navData}
      productName="Waypoint"
      showFilterInput={false}
      sidecarChildren={<WaypointDownloadsSidecarContent />}
      versionSwitcherOptions={versionSwitcherOptions}
    >
      <h1>Install Waypoint: {router.query.version || latestVersion}</h1>
      {Array(12)
        .fill(null, 0)
        .map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={index}>{LOREM_IPSUM}</p>
        ))}
    </SidebarSidecarLayout>
  )
}

ProductDownloadsView.layout = EmptyLayout
export default ProductDownloadsView
