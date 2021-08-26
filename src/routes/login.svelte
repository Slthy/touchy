<script>
  let password, email, loginError = false
  import { goto } from '$app/navigation';

  function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + 86400000);
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname+"=" + cvalue + ";" + expires + ";sameSite=Strict;path=/";
  }
  function getCookie(cname) {
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

  async function login (email, password) {
    const res = await fetch('http://localhost:3600/auth', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    const data = await res.json()
    if (res.status == 200) {
      setCookie('TouchyTokens', JSON.stringify(data))
      fetchUserData(email)
    } else {
      loginError = true
    }
  }

  async function fetchUserData (email) {
    const res = await fetch('http://localhost:3600/getDataEmail', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: email
      })
    })
    const data = await res.json()
    setCookie('TouchyProfile', JSON.stringify(data))
    const userData = JSON.parse(getCookie('TouchyProfile'))
    goto('/profile/'+userData.username)
  }

  async function handleLogin(event){
    event.preventDefault()
    login(email, password)
  }


</script>

<div class="font-sans content-box p-16 ">

  <form on:submit={handleLogin} name="dataDiv" class="relative">
    <p class="text-center text-9xl subpixel-antialiased font-bold p-16">touchy.</p>

    <div class="flex flex-wrap items-stretch w-full mb-4 relative">	
      <input bind:value={email} type="email" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Email" required>
    </div>

    <div class="grid grid-cols-10 ">

      <div class="flex col-start-1 col-end-8 flex-wrap items-stretch w-full mb-4 relative">
        <input bind:value={password} type="password" class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Password" required>
      </div>

      <div class="flex col-start-9 col-end-11 flex-wrap items-stretch w-full mb-4 ">	
        <button type="submit" class="w-40 align-center leading-normal rounded whitespace-no-wrap text-white text-sm text-center font-sans subpixel-antialiased font-bold bg-gray-900">Login</button>
      </div>

    </div>
    {#if loginError}
      <p class="text-red-500 text-xs italic">Incorrect password or email. Retry</p>
    {/if}
  </form>
</div>