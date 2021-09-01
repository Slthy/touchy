<script>
  import { goto } from "$app/navigation";
  import { BACKEND_HOST } from "$lib/envVar";
  import { setCookie } from "$lib/utils.js";
  import jwt_decode from "jwt-decode";
  let firstname,
    lastName,
    password,
    email,
    usernameNoAt,
    registrationError = false;
  $: username = "@" + usernameNoAt; //check whenever usernameNoAt changes and changes itself

  async function registration() {
    const res = await fetch(BACKEND_HOST + "/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstname,
        lastName: lastName,
        email: email,
        password: password,
        username: username,
      }),
    });
    const data = await res.json();

    if (res.status == 200) {
      const jwt = JSON.stringify(data); //convert retrived jwt tokens to string
      setCookie("TouchyTokens", jwt);
      const parsedJwt = jwt_decode(jwt);
      goto("/profile/" + parsedJwt.username);
    } else registrationError = true;
  }

  async function handleRegistration(event) {
    event.preventDefault();
    registration();
  }
</script>

<div class="font-sans flex h-screen justify-center items-center p-16">
  <p class="text-center text-9xl subpixel-antialiased font-bold p-16">
    touchy.
  </p>
  <form on:submit={handleRegistration} name="dataDiv" class="w-3/6 text-center">
    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-wrap items-stretch w-full mb-4 relative">
        <input
          type="text"
          bind:value={firstname}
          class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light 
                 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
          placeholder="firstname"
          required
        />
      </div>
      <div class="flex flex-wrap items-stretch w-full mb-4 relative">
        <input
          type="text"
          bind:value={lastName}
          class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light 
                 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
          placeholder="Lastname"
          required
        />
      </div>
    </div>
    <div class="flex flex-wrap items-stretch w-full mb-4 relative">
      <div class="flex -mr-px">
        <span
          class="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none 
                 border border-r-0 border-grey-light px-3 whitespace-no-wrap text-grey-dark text-sm"
          >@</span
        >
      </div>
      <input
        type="text"
        bind:value={usernameNoAt}
        class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light 
               rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
        placeholder="Username"
        required
      />
    </div>
    <div class="flex flex-wrap items-stretch w-full mb-4 ">
      <input
        type="email"
        bind:value={email}
        class="flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light 
               rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
        placeholder="Email"
        required
      />
    </div>
    <div class="grid grid-cols-10 relative">
      <div
        class="flex col-start-1 col-end-8 flex-wrap items-stretch w-full mb-4 "
      >
        <input
          type="password"
          bind:value={password}
          class="absolute flex-shrink flex-grow flex-auto leading-normal w-px flex-1 border h-10 border-grey-light 
                 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
          placeholder="Password"
          required
        />
      </div>
      <button
        type="submit"
        class="absolute top-0 right-0 w-40 h-10 align-right leading-normal rounded whitespace-no-wrap 
               text-white text-sm text-center font-sans subpixel-antialiased font-bold bg-gray-900"
        >Register</button
      >
    </div>
    {#if registrationError}
      <span
        class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
        >Invalid email or password!</span
      >
    {/if}
  </form>
</div>
