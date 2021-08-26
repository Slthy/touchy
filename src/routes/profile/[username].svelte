<script context="module">
  import { browser } from '$app/env';

  export async function load({ fetch, page }) { 
    const username = page.params.username
    const infoReq = await fetch('http://localhost:3600/getDataUsername', {
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
    let imgScr
    if (browser) {
      const imageProfile = await fetch('http://localhost:3600/getProfilePic', {
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
      imgScr = await new Promise(function (resolve) {
        let reader = new FileReader()
        reader.readAsDataURL(blobdata);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject('Error: ', error);
      });
    }
    return {
      props: {
        info: info,
        profilePic: imgScr,
        username: username
      }
    }
  }
</script>

<script>
  export let info, profilePic, username
</script>

<svelte:head>
	<title>Welcome</title>
</svelte:head>

<div class="font-sans content-box p-16 ">
  <div class="relative">
    <p class="text-left text-9xl subpixel-antialiased font-bold">{username.substring(1)}</p>
    <p class="text-left text-3xl subpixel-antialiased ">{info.firstName} {info.lastName}</p>
    <img class="absolute top-0 right-0 w-[128px] h-[128px] rounded-full" src={profilePic} alt="{username}'s profile image"/>
    {#if info.permissionLevel == 7}
      <img class="h-14 pt-6" src="../static/SVG/ranks/adminRank.svg" alt="{info.firstName} {info.lastName} is the admin of Touchy"/>
    {/if}
    {#if info.permissionLevel == 2}
      <img class="h-14 pt-6" src="../static/SVG/ranks/vipRank.svg" alt="{info.firstName} {info.lastName} has a vip rank in Touchy"/>
    {/if}
  </div>
</div>
