import { ITagsAPIResponse } from './types';

export default async (repo: string): Promise<string> => {
  const api = `https://api.github.com/repos/${repo}/tags`;
  const res: ITagsAPIResponse[] = await (await fetch(api)).json();
  return res[0].name;
};