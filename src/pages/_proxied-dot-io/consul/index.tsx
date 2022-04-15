import ConsulIoLayout from 'layouts/_proxied-dot-io/consul'
import * as React from 'react'
import Head from 'next/head'
import { proxiedRivetClient } from 'lib/cms'
import homepageQuery from './home/query.graphql'
import { renderMetaTags } from '@hashicorp/react-head'
import IoHomeHero from 'components/_proxied-dot-io/common/io-home-hero'
import IoHomeIntro from 'components/_proxied-dot-io/common/io-home-intro'
import IoHomeInPractice from 'components/_proxied-dot-io/common/io-home-in-practice'
import IoCardContainer from 'components/_proxied-dot-io/common/io-card-container'
import IoHomeCaseStudies from 'components/_proxied-dot-io/common/io-home-case-studies'
import IoHomeCallToAction from 'components/_proxied-dot-io/common/io-home-call-to-action'
import IoHomePreFooter from 'components/_proxied-dot-io/common/io-home-pre-footer'
import s from './home/style.module.css'

function Homepage({ data }: $TSFixMe): React.ReactElement {
  const {
    seo,
    heroHeading,
    heroDescription,
    heroCtas,
    heroCards,
    introHeading,
    introDescription,
    introOfferingsImage,
    introOfferings,
    introOfferingsCta,
    introVideo,
    inPracticeHeading,
    inPracticeDescription,
    inPracticeCards,
    inPracticeCtaHeading,
    inPracticeCtaDescription,
    inPracticeCtaLink,
    inPracticeCtaImage,
    useCasesHeading,
    useCasesDescription,
    useCasesCards,
    tutorialsHeading,
    tutorialCards,
    caseStudiesHeading,
    caseStudiesDescription,
    caseStudiesFeatured,
    caseStudiesLinks,
    callToActionHeading,
    callToActionDescription,
    callToActionCtas,
    preFooterHeading,
    preFooterDescription,
    preFooterCtas,
  } = data
  const _introVideo = introVideo[0]
  const _introOfferingsCta = introOfferingsCta[0]

  return (
    <>
      <Head>{renderMetaTags(seo)}</Head>

      <IoHomeHero
        pattern="/consul/img/home-hero-pattern.svg"
        brand="consul"
        heading={heroHeading}
        description={heroDescription}
        ctas={heroCtas}
        cards={heroCards.map((card: $TSFixMe) => {
          return {
            ...card,
            cta: card.cta[0],
          }
        })}
      />

      <IoHomeIntro
        brand="consul"
        heading={introHeading}
        description={introDescription}
        offerings={{
          image: {
            src: introOfferingsImage.url,
            width: introOfferingsImage.width,
            height: introOfferingsImage.height,
            alt: introOfferingsImage.alt,
          },
          list: introOfferings,
          cta: _introOfferingsCta,
        }}
        video={{
          youtubeId: _introVideo.youtubeId,
          thumbnail: _introVideo.thumbnail.url,
          heading: _introVideo.heading,
          description: _introVideo.description,
          person: {
            name: _introVideo.personName,
            description: _introVideo.personDescription,
            avatar: _introVideo.personAvatar?.url,
          },
        }}
      />

      <section className={s.useCases}>
        <div className={s.container}>
          <IoCardContainer
            heading={useCasesHeading}
            description={useCasesDescription}
            cardsPerRow={4}
            cards={useCasesCards.map((card: $TSFixMe) => {
              return {
                eyebrow: card.eyebrow,
                link: {
                  url: card.link,
                  type: 'inbound',
                },
                heading: card.heading,
                description: card.description,
                products: card.products,
              }
            })}
          />
        </div>
      </section>

      <section className={s.tutorials}>
        <div className={s.container}>
          <IoCardContainer
            heading={tutorialsHeading}
            cardsPerRow={3}
            cards={tutorialCards.map((card: $TSFixMe) => {
              return {
                eyebrow: card.eyebrow,
                link: {
                  url: card.link,
                  type: 'inbound',
                },
                heading: card.heading,
                description: card.description,
                products: card.products,
              }
            })}
          />
        </div>
      </section>

      <IoHomeInPractice
        brand="consul"
        pattern="/consul/img/practice-pattern.svg"
        heading={inPracticeHeading}
        description={inPracticeDescription}
        cards={inPracticeCards.map((card: $TSFixMe) => {
          return {
            eyebrow: card.eyebrow,
            link: {
              url: card.link,
              type: 'inbound',
            },
            heading: card.heading,
            description: card.description,
            products: card.products,
          }
        })}
        cta={{
          heading: inPracticeCtaHeading,
          description: inPracticeCtaDescription,
          link: inPracticeCtaLink,
          image: inPracticeCtaImage,
        }}
      />

      <IoHomeCaseStudies
        heading={caseStudiesHeading}
        description={caseStudiesDescription}
        primary={caseStudiesFeatured}
        secondary={caseStudiesLinks}
      />

      <IoHomeCallToAction
        brand="consul"
        heading={callToActionHeading}
        content={callToActionDescription}
        links={callToActionCtas}
      />

      <IoHomePreFooter
        brand="consul"
        heading={preFooterHeading}
        description={preFooterDescription}
        ctas={preFooterCtas}
      />
    </>
  )
}

export async function getStaticProps() {
  const query = proxiedRivetClient('consul')
  const { consulHomepage } = await query({
    query: homepageQuery,
  })

  return {
    props: { data: consulHomepage },
    revalidate: __config.io_sites.revalidate,
  }
}

Homepage.layout = ConsulIoLayout
export default Homepage
