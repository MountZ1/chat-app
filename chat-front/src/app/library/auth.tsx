import Cookies from "js-cookie";
import { CheckCreditentials } from "./api";

export function getAuth(req : any) {
    const cookie = req.cookies["user_identifier"];
    if (!cookie) {
        return false;
    }

   CheckCreditentials(cookie).then((res) => {
       return res.valid
   })
}

export async function authentication(auth? : boolean){
    if (auth){
        auth
    } else{
        return
    }
}
