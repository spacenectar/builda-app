import { ConfigFile } from '@typedefs/config-file';

const urlWithProtocol = (url: string) => {
  // If a url starts with http or https, return the url unchanged
  if (url.startsWith('http') || url.startsWith('https')) {
    return url;
  }
  return `https://${url}`;
};

export const convertRegistryPathToUrl = (
  registryPath: string,
  config: ConfigFile
) => {
  let newPath = registryPath;

  const customMatcherKeys = config.resolve
    ? Object.keys(config.resolve)
    : undefined;

  const pathMatcher = newPath.split(':');

  if (newPath.endsWith('/')) {
    newPath = newPath.slice(0, -1);
  }

  if (pathMatcher.length > 0 && customMatcherKeys?.includes(pathMatcher[0])) {
    const slug = newPath.split(':').pop();
    for (let i = 0; i < customMatcherKeys.length; i++) {
      if (pathMatcher[0] === customMatcherKeys[i] && config.resolve) {
        newPath = urlWithProtocol(`${config.resolve[pathMatcher[0]]}/${slug}`);
      }
    }
    return newPath;
  }

  if (newPath.startsWith('github:')) {
    const updatedPath = newPath.replace(
      'github:',
      'https://raw.githubusercontent.com/'
    );
    return `${updatedPath}/master`;
  }

  if (newPath.startsWith('bitbucket:')) {
    const updatedPath = newPath.replace('bitbucket:', 'https://bitbucket.org/');
    return `${updatedPath}/raw/master`;
  }

  if (newPath.includes('github.com')) {
    return newPath
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob', '')
      .replace('/tree', '');
  }

  if (newPath.includes('bitbucket.org')) {
    return newPath.replace('src', 'raw');
  }

  // If no custom matcher is provided, assume it's pointing to the builda repository
  newPath = `https://builda.app/modules/${newPath}`;

  return newPath;
};

export default convertRegistryPathToUrl;
