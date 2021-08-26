<script context="module">
  import { browser } from '$app/env';
  import { goto } from '$app/navigation';
  import { BACKEND_HOST } from '$lib/envVar';

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
        }
      }
    } else if (browser) goto('/userNotFound/'+username)
    return {
      props: {
        info: info,
        profilePic: imgScr,
        username: username,
        existProfilePic : existProfilePic
      }
    }
  }
</script>

<script>
  export let info, profilePic, username, existProfilePic
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
	    <p>error</p>
    {/if}
    {#if info.permissionLevel == 7}
      <img class="h-14 pt-6" src="../static/SVG/ranks/adminRank.svg" alt="{info.firstName} {info.lastName} is the admin of Touchy"/>
    {/if}
    {#if info.permissionLevel == 2}
      <img class="h-14 pt-6" src="../static/SVG/ranks/vipRank.svg" alt="{info.firstName} {info.lastName} has a vip rank in Touchy"/>
    {/if}
  </div>
</div>
