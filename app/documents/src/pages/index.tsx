import React from "react"
import clsx from "clsx"
import Link from "@docusaurus/Link"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import Layout from "@theme/Layout"
import HomepageFeatures from "@site/src/components/HomepageFeatures"

import styles from "./index.module.css"
import "../css/custom.css"
import { Button, MantineProvider } from "@mantine/core"

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Tutorial - 3min ⏱️
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title} - Hassle-Free Token Management and Migration for DAOs`}
      description="GasFree Token provides a hassle-free and cost-effective solution for DAOs and other token holders to manage their tokens and distribute them without incurring any gas fees. With GasFree Token, users can easily mint, transfer, burn, and check balances of their tokens through basic APIs, and keep their token balances securely stored in the cloud. When ready to deploy their ERC20 tokens on the mainnet, DAOs can seamlessly migrate their temporary tokens with just a few clicks, and have the equivalent amount of tokens automatically minted to holders' wallets. GasFree Token simplifies the token issuance process and saves time and money for DAOs."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  )
}
