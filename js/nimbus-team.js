class NimbusTeam extends HTMLElement {
  static #selectors = {
    UserCardTmpl: "nimbus-team-user-card-tmpl",
    UserCardAvatar: ".user-card-avatar",
    UserCardEmail: ".user-card-email a",
    UserCardSocial: {
      bluesky: ".icon-social-bsky",
      linkedin: ".icon-social-linkedin",
      mastodon: ".icon-social-mastodon",
    },
    UserCardPhone: ".user-card-phone a",
    UserCardRole: ".user-card-role",
    UserCardTitle: ".user-card-title",
  };

  #shadow;

  #users;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#loadCSS();
  }

  connectedCallback() {
    this.#render();
  }

  async #render() {
    const template = document.getElementById(
      NimbusTeam.#selectors.UserCardTmpl
    );

    if (!template) {
      return;
    }

    if (!this.#users) {
      await this.#loadUsers();
    }

    const listContainer = document.createElement("ul");
    listContainer.classList.add("card-list");

    this.#users.forEach((user) => {
      const userCard = template.content.cloneNode(true);
      const email = userCard.querySelector(NimbusTeam.#selectors.UserCardEmail);
      const phone = userCard.querySelector(NimbusTeam.#selectors.UserCardPhone);

      const bluesky = userCard.querySelector(
        NimbusTeam.#selectors.UserCardSocial.bluesky
      );
      const linkedin = userCard.querySelector(
        NimbusTeam.#selectors.UserCardSocial.linkedin
      );
      const mastodon = userCard.querySelector(
        NimbusTeam.#selectors.UserCardSocial.mastodon
      );

      // Because all social icons have the same accessible text content
      // we can use any of them to get the unprocessed text content.
      const accText = bluesky.querySelector("span").textContent;

      userCard.querySelector(
        NimbusTeam.#selectors.UserCardTitle
      ).textContent = `${user.firstName} ${user.lastName}`;

      userCard.querySelector(NimbusTeam.#selectors.UserCardAvatar).src =
        user.avatarURL;

      userCard.querySelector(NimbusTeam.#selectors.UserCardRole).textContent =
        user.role;

      email.textContent = user.email;
      email.href = `mailto:${user.email}`;

      phone.textContent = user.telephone;
      phone.href = `tel:${user.telephone}`;

      bluesky.href = user.social.bluesky.url;
      bluesky.querySelector("span").textContent = accText
        .replace("@employee", user.firstName)
        .replace("@platform", user.social.bluesky.name);

      linkedin.href = user.social.linkedin.url;
      linkedin.querySelector("span").textContent = accText
        .replace("@employee", user.firstName)
        .replace("@platform", user.social.linkedin.name);

      mastodon.href = user.social.mastodon.url;
      mastodon.querySelector("span").textContent = accText
        .replace("@employee", user.firstName)
        .replace("@platform", user.social.mastodon.name);

      listContainer.appendChild(userCard);
    });

    this.#shadow.appendChild(listContainer);
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

  async #loadUsers() {
    const response = await fetch(
      "https://fictionalfolks.netlify.app/.netlify/functions/users"
    );

    if (response.ok) {
      this.#users = await response.json();
    }
  }
}

customElements.define("nimbus-team", NimbusTeam);
