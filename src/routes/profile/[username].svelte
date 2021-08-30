<script context="module">
  import { browser } from '$app/env';
  import { goto } from '$app/navigation';
  import { BACKEND_HOST } from '$lib/envVar.js';
  import { getCookie, checkIfLoggedTrue } from '$lib/utils.js'
  let isLogged

  export async function load({ fetch, page }) { 
    const username = page.params.username
    let imgScr = null, existProfilePic = true
    const infoReq = await fetch(BACKEND_HOST+'/getDataUsername', {
      method: 'POST',
      body: JSON.stringify({
        username: username
      }),
      mode: 'cors',
      headers: {
        'content-type': 'application/json'
      }
    })
    const info = await infoReq.json()
    if (browser) isLogged = checkIfLoggedTrue(getCookie('TouchyTokens'), info.email)
    if (infoReq.status == 200) {
      if (browser) {
        const imageProfile = await fetch(BACKEND_HOST+'/getProfilePic', {
          method: 'POST',
          body: JSON.stringify({
            username:username
          }),
          mode: 'cors',
          headers: {
            'content-type': 'application/json'
          }
        })
        const blobdata = await imageProfile.blob()
        if (imageProfile.status == 200) {
          existProfilePic = true
          imgScr = await new Promise(function (resolve) {
            let reader = new FileReader()
            reader.readAsDataURL(blobdata);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject('Error: ', error);
          });
        } else existProfilePic = false
      }
    } else if (browser) goto('/userNotFound/'+username)
    return {
      props: {
        info: info,
        profilePic: imgScr,
        username: username,
        existProfilePic : existProfilePic,
        isLogged: isLogged
      }
    }
  }
</script>

<script>
  export let info, profilePic, username, existProfilePic, isLogged
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<div class="font-sans content-box p-16 ">
  <div class="relative">
    <p class="text-left text-9xl subpixel-antialiased font-bold">{username.substring(1)}</p>
    <p class="text-left text-3xl subpixel-antialiased ">{info.firstName} {info.lastName}</p>
    {#if existProfilePic}
      <img class="absolute top-0 right-0 w-[128px] h-[128px] rounded-full" src={profilePic} alt="{username}'s profile image"/>
    {:else}
      <div class="absolute top-0 right-0 flex justify-end">
        <img class="align-right w-[128px] h-[128px]" src="../static/SVG/placeholderLogo.svg" alt="Placeholder Profile Pic"/>
      </div>
      <a href="../settings/uploadProfilePic"class="font-medium tracking-wide text-grey-800 text-xs mt-1 ml-1">Upload a profile image to make your account beautiful ✨</a>
    {/if}
    <div class="flex">
      {#if isLogged}
        <img class="h-14 pt-6" src="../static/SVG/logged.svg" alt="{info.firstName} {info.lastName} is logged in"/>
      {/if}
      {#if info.permissionLevel == 7}
        <img class="h-14 pt-6" src="../static/SVG/ranks/adminRank.svg" alt="{info.firstName} {info.lastName} is the admin of Touchy"/>
      {/if}
      {#if info.permissionLevel == 2}
        <img class="h-14 pt-6" src="../static/SVG/ranks/vipRank.svg" alt="{info.firstName} {info.lastName} has a vip rank in Touchy"/>
      {/if}
    </div>
  </div>
</div>