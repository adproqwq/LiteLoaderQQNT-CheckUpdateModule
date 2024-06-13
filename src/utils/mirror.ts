export default (type: 'total' | 'domain' | 'off', originUrl: string, domain: string) => {
  if(type == 'off') return originUrl;
  else if(type == 'total') return `${domain}/${originUrl}`;
  else{
    const url = new URL(originUrl);
    return originUrl.replace(url.origin, domain);
  }
};