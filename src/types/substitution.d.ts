// see (https://builda.app/docs/build-a-module/substitutions) for more info
type TSubstitution = {
  /**
   * The string(s) to be replaced
   * TODO: Add support for multiple strings to be replaced
   * @example %APP_NAME%
   */
  replace: string;
  /**
   * The string to replace with
   * @example my-app
   */
  with: string;
  /**
   * Is this substitution required? (i.e. if it is not found, should the build fail?)
   * @optional
   * @default false
   */
  required?: boolean;
  /**
   * Do you want to provide a list of valid options for this substitution? (i.e. if it is not found, should the build fail?)
   */
  valid?: string[];
  /**
   * Do you want the substitution be undone in the export?
   * Note: Not all substitutions can be undone, so use this with caution
   * @optional
   */
  reverseInExport?: boolean;
};
