export function PriceFormat(
  price: Number,
  n: Number,
  x: Number,
  s: any,
  c: any
): any {
  if (price == 0) return 'Free';
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = price.toFixed(Math.max(0, ~n));

  return (
    (c ? num.replace('.', c) : num).replace(
      new RegExp(re, 'g'),
      '$&' + (s || ',')
    ) + ' VND'
  );
}

export function FormatPrice(
  price: Number,
  n: Number,
  x: Number,
  s: any,
  c: any
) {
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
    num = price.toFixed(Math.max(0, ~n));

  return (c ? num.replace('.', c) : num).replace(
    new RegExp(re, 'g'),
    '$&' + (s || ',')
  );
}
