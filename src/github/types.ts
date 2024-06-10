export interface ITagsAPIResponse {
  /**
   * tag
   */
  name: string;

  /**
   * zip 格式源码直链
   */
  zipball_url: string;

  /**
   * tar.gz 格式源码直链
   */
  tarball_url: string;

  /**
   * tag 提交信息
   */
  commit: {
    /**
     * sha
     */
    sha: string;

    /**
     * tag 对应提交的 diff
     */
    url: string;
  };

  node_id: string;
};