<script>
  import { goto } from '$app/navigation';
  let firstName, lastName, password, email
  let usernameNoAt
  $: username='@'+usernameNoAt

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

  async function registration(firstName, lastName, email, password, username) {
    fetch('http://localhost:3600/users', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        username: username
      })
    }).then((res) => {
      if (res.status == 201){
        login(email, password)
      } else throw `error`;
    })
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
    setCookie('TouchyTokens', JSON.stringify(data))
    fetchUserData(email)
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

  async function handleRegistration(event){
    event.preventDefault()
    registration(firstName, lastName, email, password, username)
  }


</script>
















<div class="font-sans content-box p-16 ">

  <form on:submit={handleRegistration} name="dataDiv" class="relative">
    <p class="text-center text-9xl subpixel-antialiased font-bold p-16">touchy.</p>
    <div class="grid grid-cols-2 gap-4">

      <div class="flex flex-wrap items-stretch w-full mb-4 relative">
        <input type="text" bind:value={firstName} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Firstname" required>
      </div>

      <div class="flex flex-wrap items-stretch w-full mb-4 relative">	
        <input type="text" bind:value={lastName} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Lastname" required>
      </div>

    </div>

    <div class="flex flex-wrap items-stretch w-full mb-4 relative">
      <div class="flex -mr-px">
        <span class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm">@</span>
      </div>	
      <input type="text" bind:value={usernameNoAt} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Username" required>
    </div>

    <div class="flex flex-wrap items-stretch w-full mb-4 relative">	
      <input type="email" bind:value={email} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Email" required>
    </div>

    <div class="grid grid-cols-10 ">

      <div class="flex col-start-1 col-end-8 flex-wrap items-stretch w-full mb-4 relative">
        <input type="password" bind:value={password} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Password" required>
      </div>

      <div class="flex col-start-9 col-end-11 flex-wrap items-stretch w-full mb-4 ">	
        <button type="submit" class="w-40 align-center leading-normal rounded whitespace-no-wrap text-white text-sm text-center font-sans subpixel-antialiased font-bold bg-gray-900">Register</button>
      </div>

    </div>

  </form>
</div>