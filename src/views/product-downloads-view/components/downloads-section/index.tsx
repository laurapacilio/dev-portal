import { ReactElement, useMemo } from 'react'
import { IconExternalLink16 } from '@hashicorp/flight-icons/svg-react/external-link-16'
import CodeBlock from '@hashicorp/react-code-block'
import { PackageManager } from 'views/product-downloads-view/types'
import { ReleaseVersion } from 'lib/fetch-release-data'
import { sortPlatforms, prettyOs } from 'views/product-downloads-view/helpers'
import Card from 'components/card'
import DownloadStandaloneLink from 'components/download-standalone-link'
import Heading from 'components/heading'
import InlineLink from 'components/inline-link'
import Tabs, { Tab } from 'components/tabs'
import Text from 'components/text'
import StandaloneLink from 'components/standalone-link'
import s from './downloads-section.module.css'
import { DownloadsSectionProps } from './types'

const groupDownloadsByOS = (selectedRelease: ReleaseVersion) => {
  return sortPlatforms(selectedRelease)
}

const groupPackageManagersByOS = (packageManagers: PackageManager[]) => {
  const result = {}

  packageManagers.forEach((packageManager) => {
    const { os } = packageManager
    if (result[os]) {
      result[os].push(packageManager)
    } else {
      result[os] = [packageManager]
    }
  })

  return result
}

const PackageManagerSection = ({ packageManagers, prettyOSName }) => {
  const hasOnePackageManager = packageManagers?.length === 1
  const hasManyPackageManagers = packageManagers?.length > 1
  const hasPackageManagers = hasOnePackageManager || hasManyPackageManagers

  return (
    <>
      {hasPackageManagers && (
        <Heading
          className={s.subHeading}
          level={3}
          size={200}
          slug={`package-manager-for-${prettyOSName}`}
          weight="semibold"
        >
          Package manager for {prettyOSName}
        </Heading>
      )}
      {hasOnePackageManager && (
        <CodeBlock
          code={packageManagers[0].commands
            .map((command: string) => `$ ${command}`)
            .join('\n')}
          language="shell-session"
          options={{ showClipboard: true }}
        />
      )}
      {hasManyPackageManagers && (
        /**
         * TODO: this will eventually be <CodeTabs> once a bug has
         * been fixed.
         *
         * ref: https://app.asana.com/0/1201010428539925/1201881376116200/f
         */
        <Tabs showAnchorLine={false}>
          {packageManagers.map(({ label, commands }) => {
            return (
              <Tab heading={label} key={label}>
                <CodeBlock
                  className={s.codeTabsCodeBlock}
                  code={commands
                    .map((command: string) => `$ ${command}`)
                    .join('\n')}
                  language="shell-session"
                  options={{ showClipboard: true }}
                />
              </Tab>
            )
          })}
        </Tabs>
      )}
    </>
  )
}

const BinaryDownloadsSection = ({
  downloadsByOS,
  os,
  prettyOSName,
  selectedRelease,
}) => {
  const { version } = selectedRelease
  return (
    <>
      <Heading
        className={s.subHeading}
        level={3}
        size={200}
        slug={`binary-download-for-${prettyOSName}`}
        weight="semibold"
      >
        Binary download for {prettyOSName}
      </Heading>
      {Object.keys(downloadsByOS[os]).map((arch) => (
        <Card className={s.downloadCard} elevation="base" key={arch}>
          <div className={s.downloadCardText}>
            <Text className={s.archNameLabel} size={200} weight="semibold">
              {arch.toUpperCase()}
            </Text>
            <Text className={s.archVersionLabel} size={200} weight="regular">
              Version: {version}
            </Text>
          </div>
          <DownloadStandaloneLink
            ariaLabel="TODO"
            href={downloadsByOS[os][arch]}
          />
        </Card>
      ))}
    </>
  )
}

const ChangelogSection = ({ selectedRelease }) => {
  const { version } = selectedRelease
  return (
    <>
      <Heading
        className={s.subHeading}
        level={3}
        size={200}
        slug="release-information"
        weight="semibold"
      >
        Release information
      </Heading>
      <Card className={s.downloadCard} elevation="base">
        <div className={s.downloadCardText}>
          <Text className={s.archNameLabel} size={200} weight="semibold">
            Changelog
          </Text>
          <Text className={s.archVersionLabel} size={200} weight="regular">
            Version: {version}
          </Text>
        </div>
        <StandaloneLink
          ariaLabel="TODO"
          href={`https://github.com/hashicorp/waypoint/blob/v${version}/CHANGELOG.md`}
          icon={<IconExternalLink16 />}
          iconPosition="trailing"
          openInNewTab
          text="GitHub"
          textSize={200}
        />
      </Card>
    </>
  )
}

const NotesSection = ({ selectedRelease }) => {
  const { name, shasums, shasums_signature, version } = selectedRelease
  return (
    <>
      <Heading
        className={s.subHeading}
        level={3}
        size={200}
        slug="notes"
        style={{ marginBottom: 8 }}
        weight="semibold"
      >
        Notes
      </Heading>
      <Text size={200}>
        You can find the{' '}
        <InlineLink
          href={`https://releases.hashicorp.com/${name}/${version}/${shasums}`}
          text={`SHA256 checksums for Waypoint ${version}`}
          textSize={200}
        />{' '}
        online and you can{' '}
        <InlineLink
          href={`https://releases.hashicorp.com/${name}/${version}/${shasums_signature}`}
          text="verify the checksums signature file"
          textSize={200}
        />{' '}
        which has been signed using{' '}
        <InlineLink
          href="https://www.hashicorp.com/security"
          text="HashiCorp's GPG key"
          textSize={200}
        />
        .
      </Text>
    </>
  )
}

const DownloadsSection = ({
  packageManagers,
  selectedRelease,
}: DownloadsSectionProps): ReactElement => {
  const downloadsByOS = useMemo(() => groupDownloadsByOS(selectedRelease), [
    selectedRelease,
  ])
  const packageManagersByOS = useMemo(
    () => groupPackageManagersByOS(packageManagers),
    [packageManagers]
  )

  return (
    <article>
      <Card elevation="base">
        <Heading
          className={s.operatingSystemTitle}
          level={2}
          size={300}
          slug="operating-system"
          weight="bold"
        >
          Operating System
        </Heading>
        <Tabs showAnchorLine>
          {Object.keys(downloadsByOS).map((os) => {
            const packageManagers: PackageManager[] = packageManagersByOS[os]
            const prettyOSName = prettyOs(os)

            return (
              <Tab heading={prettyOSName} key={os}>
                <div className={s.tabContent}>
                  <PackageManagerSection
                    packageManagers={packageManagers}
                    prettyOSName={prettyOSName}
                  />
                  <BinaryDownloadsSection
                    downloadsByOS={downloadsByOS}
                    os={os}
                    prettyOSName={prettyOSName}
                    selectedRelease={selectedRelease}
                  />
                  <ChangelogSection selectedRelease={selectedRelease} />
                  <NotesSection selectedRelease={selectedRelease} />
                </div>
              </Tab>
            )
          })}
        </Tabs>
      </Card>
    </article>
  )
}

export default DownloadsSection
