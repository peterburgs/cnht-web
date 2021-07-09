export function BalanceFormat(price:number):any{
    var price_format="";
    console.log(price);
    var zero;
    if(price==undefined) return 0;
    if(price==0) return "0 VND";
    if(price<1000) return price+" VND";

    var priceString: string = price + "";
    while(priceString.length  - 3 > 0){
        price_format ="." + priceString.substring(priceString.length - 3) +  price_format;
        priceString = priceString.substring(0, priceString.length - 3);
        console.log(price_format);
    }
    price_format = priceString + price_format + " VND";
    return price_format;
  
}
