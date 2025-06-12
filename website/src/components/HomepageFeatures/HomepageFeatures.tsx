import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import {
  Icon,
  SwatchesIcon,
  UsersThreeIcon,
  LightningIcon,
  SealCheckIcon,
  PlugIcon,
} from "@phosphor-icons/react";

type FeatureItem = {
  title: string;
  Icon: Icon;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Latest GO Data",
    Icon: LightningIcon,
    description: (
      <>
        Components fetch data from the latest GO release by default and can be
        configured to use other sources for advanced use cases.
      </>
    ),
  },
  {
    title: "Web Standards",
    Icon: SealCheckIcon,
    description: (
      <>
        Built using web standards so they work with any web framework or no
        framework at all.
      </>
    ),
  },
  {
    title: "Customizable",
    Icon: SwatchesIcon,
    description: (
      <>
        Use CSS custom properties and shadow parts to customize the look and
        feel of the components to match your application's design.
      </>
    ),
  },
  {
    title: "Simple Integration",
    Icon: PlugIcon,
    description: (
      <>
        Multiple integration options make it easy to use GO Web Components in
        anything from standalone HTML pages to complex web applications.
      </>
    ),
  },
  {
    title: "Open Source",
    Icon: UsersThreeIcon,
    description: (
      <>
        GO Web Components are open source and available on GitHub. We welcome
        contributions and feedback.
      </>
    ),
  },
];

function Feature({ title, description, Icon }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding--md">
        <div className="text--primary">
          <Icon size={64} color="currentColor" weight="fill" />
        </div>
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className="padding-vert--xl">
      <div className="container">
        <div className="row justify--center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
