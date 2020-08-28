export interface CommentsListPartConfig {
  /**
   * Heading tag
   */
  headingTag: "h2" | "h3" | "h4" | "h5";

  /**
   * Include Default CSS
   */
  includeCss: "true" | "false";

  /**
   * Login page
   */
  loginPageId?: string;
}
