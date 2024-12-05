class NimbusTeam extends HTMLElement {
  static #selectors = {
    UserCardTmpl: "nimbus-team-user-card-tmpl",
  };

  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const template = document.getElementById(
      NimbusTeam.#selectors.UserCardTmpl
    );

    if (template) {
      const content = template.content.cloneNode(true);
      this.#shadow.appendChild(content);
    }
  }
}

customElements.define("nimbus-team", NimbusTeam);
