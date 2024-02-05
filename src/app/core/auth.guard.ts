import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor() {}


  isAuthenticated:boolean = false;


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


    if (this.isAuthenticated) {
      return true;
    } else {
      return false;
    }
  }
  authenticateUser(bool?:boolean){
  if(bool){
     this.isAuthenticated=bool
  }else{
    this.isAuthenticated=false
  }
}
}
