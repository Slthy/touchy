<script>
  import { goto } from '$app/navigation';
  import { BACKEND_HOST } from '$lib/envVar';
  import { getCookie, setCookie } from '$lib/utils.js'
  let password, email, loginError = false

  async function login (email, password) {
    const res = await fetch(BACKEND_HOST+'/auth', {
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
    const res = await fetch(BACKEND_HOST+'/getDataEmail', {
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

<div class="font-sans flex h-screen justify-center items-center p-16">
  <p class="text-center text-9xl subpixel-antialiased font-bold p-8">touchy.</p>
  <form on:submit={handleLogin} name="dataDiv" class="w-3/6 text-center p-8">
    <div class="flex flex-wrap items-stretch w-full mb-4 ">	
      <input type="email" bind:value={email} class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Email" required>
    </div>
    <div class="grid grid-cols-10 relative">
      <div class="flex col-start-1 col-end-8 flex-wrap items-stretch w-full mb-4 ">
        <input type="password" bind:value={password} class="absolute flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" placeholder="Password" required>
      </div>
      <button type="submit" class="absolute top-0 right-0 w-40 h-10 align-right leading-normal rounded whitespace-no-wrap text-white text-sm text-center font-sans subpixel-antialiased font-bold bg-gray-900">Login</button>
    </div>
    {#if loginError}
      <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">Invalid email or password!</span>
    {/if}
  </form>
  
</div>