export default (type: 'total' | 'domain', originUrl: string, domain: string) => {
  if(type == 'total') return `${domain}/${originUrl}`;
  else{
    const url = new URL(originUrl);
    return originUrl.replace(url.origin, domain);
  }
};