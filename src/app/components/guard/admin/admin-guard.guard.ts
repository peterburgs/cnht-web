import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterState, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { authenticationService } from "src/app/service/authentication.service";
@Injectable({providedIn:'root'})
export class AdminGuard implements CanActivate{
   constructor(private authenticate:authenticationService,
    private router:Router){

   }
    canActivate(route:ActivatedRouteSnapshot,
        router:RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree{
                if(this.authenticate.isAdmin()){
                    return true;
                }
             
            return this.router.createUrlTree(['/home']);
        }
}