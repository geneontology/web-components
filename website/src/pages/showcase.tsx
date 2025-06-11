import Layout from "@theme/Layout";

import styles from "./showcase.module.css";

const SITES = [
  {
    name: "Alliance",
    description:
      "The Alliance of Genome Resources is a consortium of model organism databases that provides a " +
      "unified view of gene function and disease. The Alliance uses the GO Annotation Ribbon and " +
      "GO-CAM Viewer on their gene pages.",
    url: "https://www.alliancegenome.org/gene/FB:FBgn0041630#function---go-annotations",
  },
  {
    name: "AmiGO",
    description:
      "AmiGO is the official web application for searching and browsing the Gene Ontology (GO) " +
      "knowledgebase. AmiGO uses the GO-CAM Viewer on their gene product pages and " +
      "standalone GO-CAM pages.",
    url: "https://amigo.geneontology.org/amigo/gene_product/WB:WBGene00006575",
  },
  {
    name: "PomBase",
    description:
      "PomBase is the model organism database for the fission yeast Schizosaccharomyces pombe. " +
      "PomBase uses the GO-CAM Viewer on their gene pages as well as on standalone GO-CAM " +
      "pages.",
    url: "https://www.pombase.org/gocam/docs/671ae02600003596",
  },
  {
    name: "UniProt",
    description:
      "UniProt is a comprehensive protein sequence and functional information database. UniProt " +
      "uses both the GO Annotation Ribbon and GO-CAM Viewer on their protein pages.",
    url: "https://www.uniprot.org/uniprotkb/P05067/entry",
  },
];

const Showcase: React.FC = () => {
  return (
    <Layout title="Showcase">
      <div className="hero">
        <div className="container">
          <h1 className="hero__title">GO Web Components Showcase</h1>
          <p className="hero__subtitle">
            List of websites using GO Web Components
          </p>
        </div>
      </div>

      <section className={styles.showcase}>
        <div className="container">
          <div className="row">
            {SITES.map((site) => (
              <div className="col col--4" key={site.url}>
                <div className="card margin-bottom--lg shadow--tl">
                  <div className="card__header">
                    <h3>{site.name}</h3>
                  </div>
                  <div className="card__body">
                    <p>{site.description}</p>
                  </div>
                  <div className="card__footer">
                    <a
                      className="button button--block button--primary"
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Example
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Showcase;
