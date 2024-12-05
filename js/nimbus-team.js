class NimbusTeam extends HTMLElement {
  static #selectors = {
    UserCardTmpl: "nimbus-team-user-card-tmpl",
  };

  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#loadCSS();
  }

  connectedCallback() {
    const listContainer = document.createElement("ul");
    const template = document.getElementById(
      NimbusTeam.#selectors.UserCardTmpl
    );

    if (template) {
      const content = template.content.cloneNode(true);

      listContainer.classList.add("card-list");
      listContainer.appendChild(content);

      this.#shadow.appendChild(listContainer);
    }
  }

  /**
   * Asynchronously loads a CSS file and appends it's content to the shadow DOM.
   *
   * This method creates a <style> element, fetches the CSS content from the specified URL,
   * and appends the CSS content to the shadow DOM if the fetch request is successful.
   *
   * @private
   * @async
   * @returns {Promise<void>} A promise that resolves when the CSS is loaded and appended.
   */
  async #loadCSS() {
    const style = document.createElement("style");
    const response = await fetch("css/user-card.css");

    if (response.ok) {
      style.textContent = await response.text();
      this.#shadow.appendChild(style);
    }
  }
}

customElements.define("nimbus-team", NimbusTeam);
