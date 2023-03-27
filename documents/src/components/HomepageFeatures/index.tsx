import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type FeatureItem = {
  title: string
  Svg: React.ComponentType<React.ComponentProps<"svg">>
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: "Hassle-free Token Management",
    Svg: require("@site/static/img/undraw_savings.svg").default,
    description: <>Manage your tokens without any gas fees or manual management tasks, saving you time and money.</>,
  },
  {
    title: "Cloud-based Token Balances",
    Svg: require("@site/static/img/undraw_secure_server.svg").default,
    description: (
      <>
        Keep your token balances safe and secure in the cloud, and distribute temporary or test tokens easily without
        worrying about manually tracking balances.
      </>
    ),
  },
  {
    title: "Seamless Token Migration",
    Svg: require("@site/static/img/undraw_transfer_money.svg").default,
    description: (
      <>
        Easily migrate your temporary tokens to your ERC20 contract and mint tokens to holders' wallets with just a few
        clicks, simplifying the token issuance process.
      </>
    ),
  },
]

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
