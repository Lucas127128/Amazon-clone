export function getURLParams(url: URL = new URL(location.href)) {
  const { searchParams } = url;
  return {
    q: searchParams.get('q'),
    orderId: searchParams.get('orderId'),
    productId: searchParams.get('productId'),
  };
}
