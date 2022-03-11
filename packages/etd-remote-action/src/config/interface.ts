export interface Config {
  /**
   * Name of the configuration
   */
  name: string;
  /**
   * Number of the parallel jobs
   */
  concurrency?: number;
  /**
   * List of remotes' ip address
   */
  remote: string[];
  /**
   * Login method. Only username and password are supported currently
   */
  login: Login;
  /**
   * Logger
   */
  logger?: Logger;
  /**
   * List of action step
   */
  steps: Step[];
  /**
   * Includes command output. Default is true
   */
  output: boolean;
  /**
   * Start remote action from index x.
   * For example, when this field is set to 1, then the first remote will be skipped.
   */
  start_from?: number;
}

export interface Logger {
  output: string;
}

export interface Login {
  /**
   * SSH's username
   */
  username: string;
  /**
   * SSH's password
   */
  password: string;
}

export interface Step {
  /**
   * Actual command
   */
  run?: string;
  /**
   * Throw error and stop the step if any error occurs. Default to false.
   */
  catch_err?: boolean;
  /**
   * Copy local files to remote location
   */
  files?: Directory[];
  /**
   * Copy local directory to remote location
   */
  directories?: Directory[];
  /**
   * List of environment variables for this step
   */
  env?: string[];
  /**
   * Current working directory.
   */
  cwd?: string;
  /**
   * Name of the step. Field "Run" will be used for UI display if this field is empty
   */
  name?: string;
  /**
   * Use admin privilege
   */
  with_root?: boolean;
}

export interface Directory {
  /**
   * Local file path
   */
  local: string;
  /**
   * Remote file path
   */
  remote: string;
}
