import AppError from '../errors/AppError';

export const parseFullUrlToUrl = (fullUrl: string): string => {
  const url = fullUrl
    .split('?')
    .shift();

  if (url === undefined) {
    throw new AppError('URL not found');
  }

  return url
    .replace(/\/+/g, '/')
    .toLowerCase();
};

export const parseUrlToSegments = (url: string): string[] => url
  .split('/')
  .filter((item) => item);

export const parseSegmentsToUrl = (url: string[]): string => `/${url.join('/')}`;
