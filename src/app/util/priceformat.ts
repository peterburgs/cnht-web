export function PriceFormat(price:number):any{
    var price_format="";
    var zero;
    if(price==undefined) return 0;
    if(price==0) return "Free"
    if(price<1000) return price+"VND"  
    while(price%1000==0)
    {
      price= price/1000;
      
       zero =price_format;
      price_format = ('.000').concat(price_format);
    }
    zero = price_format;
    price_format=price.toString()+ price_format+"VND";

    return price_format;

}

/**
 * Number.prototype.format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
 export function FormatPrice (price: Number, n:Number, x: Number, s:any, c:any) {
  
  var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = price.toFixed(Math.max(0, ~n));

  return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
};