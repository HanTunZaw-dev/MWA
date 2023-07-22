import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { LoginService } from "./login/login.service";
export const AddApiTokenInterceptor : HttpInterceptorFn = (req, next) => {
  const auth = inject(LoginService);
 if(auth.isLoggedIn()){
    const jwt = "Beare " + auth.state_signal().jwt
    const new_req  = req.clone({
      headers: req.headers.set("Authorization", jwt)
    })
    return next(new_req);
 }
  return next(req);
}
