<script context="module">
  import { browser } from "$app/env";
  import { goto } from "$app/navigation";
  import { BACKEND_HOST } from "$lib/envVar.js";
  import { checkIfLoggedTrue } from "$lib/utils.js";

  async function blobToImage(blob) {
    if (browser) {
      return await new Promise(function (resolve) {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject("Error: ", error);
      });
    }
  }

  export async function load({ fetch, page }) {
    const username = page.params.username;
    let isLogged = false,
      scrProfilePic = null,
      existProfilePic = false,
      post_firstRow1 = null,
      post_firstRow2 = null,
      hasMorePosts = false,
      fullName = null,
      permissionLevel,
      numberOfPosts = null,
      jwt = null;

    isLogged = checkIfLoggedTrue(username); //if user has a jwt token stored in cookies =>
    // if logged => 'logged' badge, new post and upload profile pic ()
    const infoReq = await fetch(BACKEND_HOST + "/getDataUsername", {
      //get user info
      method: "POST",
      body: JSON.stringify({
        username: username,
      }),
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
    });
    const info = await infoReq.json(); //data from api
    if (infoReq.status != 200 && browser) goto("/userNotFound/" + username); //if bad request, execute goto() function in through browser
    fullName = info.name;
    permissionLevel = info.permissionLevel;
    numberOfPosts = info.numberOfPosts - 1;
    const imageProfile = await fetch(BACKEND_HOST + "/getProfilePic", {
      //search for users's profile pic
      method: "POST",
      body: JSON.stringify({
        username: username,
      }),
      mode: "cors",
      headers: {
        "content-type": "application/json",
      },
    });
    const blobProfilePic = await imageProfile.blob(); //contain downloaded user's pic blob
    if (imageProfile.status == 200) existProfilePic = true; //if the req is successful, mark that user has a profile pic
    if (browser) {
      if (numberOfPosts > 0) {
        //if user has post, try to get the first 2
        const loadPost = await fetch(BACKEND_HOST + "/getPost", {
          //get first user post
          method: "POST",
          body: JSON.stringify({
            username: username,
            id: numberOfPosts - 1,
          }),
          mode: "cors",
          headers: {
            "content-type": "application/json",
          },
        });
        const blobPost = await loadPost.blob();
        post_firstRow1 = await blobToImage(blobPost);
      }
      if (numberOfPosts > 1) {
        //if user has more than one post, get user's second post
        const loadPost = await fetch(BACKEND_HOST + "/getPost", {
          method: "POST",
          body: JSON.stringify({
            username: username,
            id: numberOfPosts - 2,
          }),
          mode: "cors",
          headers: {
            "content-type": "application/json",
          },
        });
        const blobPost = await loadPost.blob();
        if (browser) post_firstRow2 = await blobToImage(blobPost);
      }
      if (numberOfPosts > 2) hasMorePosts = true; //if user has more posts, marks variable 'hasMorePosts' to true (future feature, see projects)
    }

    if (browser && existProfilePic)
      scrProfilePic = await blobToImage(blobProfilePic);

    return {
      props: {
        username: username,
        fullName: fullName,
        permissionLevel: permissionLevel,
        numberOfPosts: numberOfPosts,
        profilePic: scrProfilePic,
        existProfilePic: existProfilePic,
        isLogged: isLogged,
        hasMorePosts: hasMorePosts,
        post_firstRow1: post_firstRow1,
        post_firstRow2: post_firstRow2,
      },
    };
  }
</script>

<script>
  export let isLogged,
    username,
    fullName,
    permissionLevel,
    existProfilePic,
    profilePic,
    post_firstRow1,
    post_firstRow2;
</script>

<svelte:head>
  <title>Welcome</title>
</svelte:head>

<div class="font-sans content-box p-16 ">
  <div class="relative">
    <p class="text-left text-9xl subpixel-antialiased font-bold">
      {username.substring(1)}
    </p>
    <p class="text-left text-3xl subpixel-antialiased ">{fullName}</p>
    {#if existProfilePic}
      <img
        class="absolute top-0 right-0 w-[128px] h-[128px] rounded-full"
        src={profilePic}
        alt="{username}'s profile image"
      />
    {:else}
      <div class="absolute top-0 right-0 flex justify-end">
        <img
          class="align-right w-[128px] h-[128px]"
          src="../static/SVG/placeholderLogo.svg"
          alt="Placeholder Profile Pic"
        />
      </div>
      <a
        href="./uploadProfilePic/{username}"
        class="font-medium tracking-wide text-grey-800 text-xs mt-1 ml-1"
        >Upload a profile image to make your account beautiful ✨</a
      >
    {/if}
    <div class="flex">
      {#if isLogged}
        <img
          class="h-14 pt-6"
          src="../static/SVG/logged.svg"
          alt="{fullName} is logged in"
        />
      {/if}
      {#if permissionLevel == 7}
        <img
          class="h-14 pt-6"
          src="../static/SVG/ranks/adminRank.svg"
          alt="{fullName} is the admin of Touchy"
        />
      {/if}
      {#if permissionLevel == 2}
        <img
          class="h-14 pt-6"
          src="../static/SVG/ranks/vipRank.svg"
          alt="{fullName} has a vip rank in Touchy"
        />
      {/if}
    </div>
  </div>
</div>

<div
  class="p-16 flex flex-wrap place-items-center -mx-6 overflow-hidden sm:-mx-6 md:-mx-8 lg:-mx-6 xl:-mx-6"
>
  {#if isLogged}
    <div
      class="my-6 px-6 w-1/3 overflow-hidden sm:my-6 sm:px-6 sm:w-1/3 md:my-8 md:px-8 md:w-1/3 lg:my-6 lg:px-6 lg:w-1/3 xl:my-6 xl:px-6 xl:w-1/3"
    >
      <img
        class="w-1/2"
        on:click={() => goto("./newPost/" + username)}
        src="../static/SVG/placeholder_newPost.svg"
        alt="{fullName} is logged in"
      />
    </div>
  {/if}

  <div
    class="items-center my-6 px-6 w-1/3 overflow-hidden sm:my-6 sm:px-6 sm:w-1/3 md:my-8 md:px-8 md:w-1/3 lg:my-6 lg:px-6 lg:w-1/3 xl:my-6 xl:px-6 xl:w-1/3"
  >
    {#if post_firstRow1}
      <img class="w-1/2" src={post_firstRow1} alt="{fullName} post" />
    {/if}
  </div>

  <div
    class="my-6 px-6 w-1/3 overflow-hidden sm:my-6 sm:px-6 sm:w-1/3 md:my-8 md:px-8 md:w-1/3 lg:my-6 lg:px-6 lg:w-1/3 xl:my-6 xl:px-6 xl:w-1/3"
  >
    {#if post_firstRow2}
      <img class="w-1/2" src={post_firstRow2} alt="{fullName} post" />
    {/if}
  </div>
</div>
