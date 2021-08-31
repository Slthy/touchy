<script>
  import { goto } from '$app/navigation';
  import { BACKEND_HOST } from '$lib/envVar';
  import { getCookie, setCookie } from '$lib/utils.js'
  import { browser } from '$app/env';
  let firstName, lastName, password, email, usernameNoAt, registrationError = false
  $: username='@'+usernameNoAt
  async function registration(firstName, lastName, email, password, username) {
    fetch(BACKEND_HOST+'/users', {
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
        login(username, password)
      } else registrationError = true;
    })
  }
  async function login (username, password) {
    const res = await fetch(BACKEND_HOST+'/auth', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
    const data = await res.json()
    setCookie('TouchyTokens', JSON.stringify(data))
    fetchUserData(username)
  }
  async function fetchUserData (username) {
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
    if (browser) setCookie('TouchyProfile', JSON.stringify(data))
    const userData = JSON.parse(getCookie('TouchyProfile'))
    goto('/profile/'+userData.username)
  }
  async function handleRegistration(event){
    event.preventDefault()
    registration(firstName, lastName, email, password, username)
  }
</script>

<div class="font-sans flex h-screen justify-center items-center p-16">
    <p class="text-center text-9xl subpixel-antialiased font-bold p-16">touchy.</p>
    <form on:submit={handleRegistration} name="dataDiv" class="w-3/6 text-center">
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
      <div class="flex flex-wrap items-stretch w-full mb-4 ">	
        <input type="email" bind:value={email} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Email" required>
      </div>
      <div class="grid grid-cols-10 relative">

        <div class="flex col-start-1 col-end-8 flex-wrap items-stretch w-full mb-4 ">
          <input type="password" bind:value={password} class="absolute flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Password" required>
        </div>
        <button type="submit" class="absolute top-0 right-0 w-40 h-10 align-right leading-normal rounded whitespace-no-wrap text-white text-sm text-center font-sans subpixel-antialiased font-bold bg-gray-900">Register</button>
      </div>
      {#if registrationError}
      <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">Invalid email or password!</span>
      {/if}
    </form>
</div>