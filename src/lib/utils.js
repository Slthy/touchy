import jwt_decode from "jwt-decode";
import { browser } from '$app/env';

export function setCookie(cname, cvalue) {
  if (browser) {
    const d = new Date();
    d.setTime(d.getTime() + 86400000);
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname+"=" + cvalue + ";" + expires + ";sameSite=Strict;path=/";
  }
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function checkIfLoggedTrue (jwt, email) {
  const parsedJwt = jwt_decode(jwt)
  return (parsedJwt.email == email)
}