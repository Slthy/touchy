import jwt_decode from "jwt-decode";
import { browser } from '$app/env';
import { BACKEND_HOST, DEFAULT_COOKIE_DURATION } from '$lib/envVar.js';
import { goto } from '$app/navigation';

export function setCookie(cname, cvalue, duration = DEFAULT_COOKIE_DURATION) {
  if (browser) {
    const d = new Date();
    d.setTime(d.getTime() + duration);
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname+"=" + cvalue + ";" + expires + ";sameSite=Strict;path=/";
  }
}

export function getCookie(cname) {
  if (browser) {
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
}

export function checkIfLoggedTrue (jwt, username) {
  if (browser) {
    const parsedJwt = jwt_decode(jwt)
    return (parsedJwt.username == username)
  }
}

export async function fetchUserData (username) {
  const res = await fetch(BACKEND_HOST+'/getDataUsername', {
    method: 'POST',
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      username: username
    })
  })
  const data = await res.json()
  goto('/profile/'+data.username)
}