import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'shortenDescription'
})
export class ShortenDescription implements PipeTransform{

    transform(value: any){

        if(value.length >80)
        return value.substr(0,80)+"...";
        else
        return value;
    }
}