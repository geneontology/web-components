import { Component, Prop, State, Event, EventEmitter, h } from "@stencil/core";
import ky from "ky";

import * as dbxrefs from "@geneontology/dbxrefs";

/**
 * The Entity Autocomplete component provides an input field that allows users to search for
 * entities (genes or GO terms) using the GO API.
 *
 * @internal
 */
@Component({
  tag: "go-entity-autocomplete",
  styleUrl: "entity-autocomplete.css",
  shadow: true,
})
export class EntityAutocomplete {
  searchBox: HTMLInputElement;

  @Prop() value: string;

  /**
   * Category to constrain the search; by default search "gene"
   * Other values accepted:
   * `undefined` : search both terms and genes
   * `gene` : will only search genes used in GO
   * `biological%20process` : will search for GO BP terms
   * `molecular%20function` : will search for GO MF terms
   * `cellular%20component` : will search for GO CC terms
   * `cellular%20component,molecular%20function,biological%20process` : will search any GO term
   */
  @Prop() category: string = "gene";

  /**
   * Maximum number of results to show
   */
  @Prop() maxResults = 100;

  /**
   * Default placeholder for the autocomplete
   */
  @Prop() placeholder = "";

  /**
   * Event triggered whenever an item is selected from the autocomplete
   */
  @Event({ eventName: "itemSelected", cancelable: true, bubbles: true })
  itemSelected: EventEmitter;

  @State() docs; // will contain the results of the search (e.g. from the GO API)

  @State() ready = false;

  goApiUrl = "https://api.geneontology.org/api/search/entity/autocomplete/";
  ncbiTaxonUrl = "https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=";

  /**
   * Executed once during component initialization
   * Here, just ask for dbxrefs to load
   */
  componentWillLoad() {
    dbxrefs.init().then(() => {
      this.ready = true;
    });
  }

  autocomplete() {
    let url = "";
    if (!this.category) {
      url = this.goApiUrl + this.value + "&rows=" + this.maxResults;
    } else if (this.category && this.category.includes(",")) {
      const tmp = "?category=" + this.category.split(",").join("&category=");
      url = this.goApiUrl + this.value + tmp + "&rows=" + this.maxResults;
      console.log(url);
    } else {
      url =
        this.goApiUrl +
        this.value +
        "?category=" +
        this.category +
        "&rows=" +
        this.maxResults;
    }
    ky.get(url)
      .json()
      .then((data) => {
        this.docs = data["docs"];
        // console.log(this.docs);
      });
  }

  timer = undefined;
  newSearch(evt) {
    this.value = evt.target.value;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.value.length < 2) {
      this.docs = undefined;
      return;
    }
    this.timer = setTimeout(() => {
      this.autocomplete();
    }, 800);
  }

  select(target, doc) {
    if (!target.href) {
      // console.log("doc selected: ", doc);
      this.docs = undefined;
      this.value = "";
      this.itemSelected.emit({ selected: doc });
    }
  }

  render() {
    return !this.ready ? (
      ""
    ) : (
      <div class="autocomplete">
        <span class="icon icon-left">{this.renderSearchIcon()}</span>
        <input
          type="text"
          class="input-field"
          value={this.value}
          placeholder={this.placeholder}
          ref={(el) => (this.searchBox = el as HTMLInputElement)}
          onInput={(evt) => this.newSearch(evt)}
        ></input>
        <span
          class="icon icon-right"
          onClick={() => {
            this.docs = undefined;
            this.value = "";
          }}
        >
          {this.renderClearIcon()}
        </span>
        {!this.docs ? (
          ""
        ) : (
          <div class="autocomplete-items">
            {this.docs.map((doc) => {
              return this.renderDoc(doc);
            })}
          </div>
        )}
      </div>
    );
  }

  renderDoc(doc) {
    // TODO: url taxon should also be fetch from dbxrefs.yaml; have to look in synonyms
    const url_taxon = this.ncbiTaxonUrl + doc.taxon.replace("NCBITaxon:", "");
    const db = doc.id.substring(0, doc.id.indexOf(":"));
    const id = doc.id.substring(doc.id.indexOf(":") + 1);
    // console.log("DOC: " ,doc);
    let url_id = "#";
    try {
      url_id = dbxrefs.getURL(db, undefined, id);
    } catch {
      // console.error(err);
    }

    // TODO: temporary fix while the db-xrefs.yaml gets updated
    if (url_id.includes("https://www.ncbi.nlm.nih.gov/gene/")) {
      // then this was fixed
    } else if (url_id.includes("https://www.ncbi.nlm.nih.gov/gene")) {
      url_id = url_id.replace(
        "https://www.ncbi.nlm.nih.gov/gene",
        "https://www.ncbi.nlm.nih.gov/gene/",
      );
    }

    return (
      <div onClick={(evt) => this.select(evt.target, doc)}>
        <span class="autocomplete__item__label">
          {
            <a href={url_id} target="blank">
              {doc.label}
            </a>
          }
        </span>
        <span class="autocomplete__item__taxon">
          {
            <a href={url_taxon} target="blank">
              {doc.taxon_label}
            </a>
          }
        </span>
      </div>
    );
  }

  renderSearchIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
      </svg>
    );
  }

  renderClearIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
      </svg>
    );
  }
}
