<script context="module">
  import { checkIfLoggedTrue } from "$lib/utils.js";
  import { browser } from "$app/env";

  export async function load({ page }) {
    const username = page.params.username;
    if (browser) {
      return {
        props: {
          isLogged: checkIfLoggedTrue(page.params.username), //check if username encoded in jwt match with the page param
          username: username,
        },
      };
    }
  }
</script>

<script>
  import { BACKEND_HOST } from "$lib/envVar";
  import { goto } from "$app/navigation";
  export let username, isLogged;
  let files,
    input,
    notLoggedError = false,
    serverError = false,
    imgBase64 = null;

  async function uploadImage(data) {
    //convert Blob to byte array
    var bytes = new Uint8Array(data.length / 2);
    for (var i = 0; i < data.length; i += 2) {
      bytes[i / 2] = parseInt(data.substring(i, i + 2), 16);
    }

    //create and append uploaded image to a multiform/form-data object
    let formData = new FormData();
    formData.append("post", files[0], username);

    //send file to backend
    const res = await fetch(BACKEND_HOST + "/uploadPost", {
      method: "POST",
      body: formData,
    });
    if (res.status == 200) {
      goto("../" + username);
    } else serverError = true; //unhandled error, just retry to login
  }

  async function imageIntoBase64IntoBlob(image) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgBase64 = e.target.result;
      uploadImage(e.target.result);
    };
    reader.readAsDataURL(image);
  }

  function uploadButtonHandler() {
    if (isLogged) {
      //checks if you're logged, if so posts data
      imageIntoBase64IntoBlob(files[0]);
    } else notLoggedError = true; //otherwise just ask to login
  }

  const previewImage = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      imgBase64 = e.target.result;
    };
  };
</script>

<svelte:head>
  <title>touchy - new post</title>
</svelte:head>

<div class="relative">
  <div class="font-sans">
    <div class="flex h-screen justify-center items-center">
      <button
        class="w-[110px] h-10 text-sm rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer 
               bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold"
        on:click={uploadButtonHandler}>Upload image</button
      >
      <label
        class="w-[150px] h-10 flex flex-col items-center py-2 rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer 
               bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold"
      >
        <span class="text-center xt-white text-sm">Select an image</span>
        <input
          type="file"
          name="post"
          bind:files
          bind:this={input}
          on:change={(e) => previewImage(e)}
          class="hidden"
        />
      </label>
      <button
        class="w-[100px] h-10 text-sm rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer 
               bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold"
        on:click={() => {
          input.value = "";
          imgBase64 = null;
        }}>Reset image</button
      >
      {#if notLoggedError}
        <a
          href="../login"
          class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
          >Error, please log in and retry</a
        >
      {/if}
      {#if serverError}
        <span
          class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1"
          >Error, please retry later</span
        >
      {/if}
      {#if imgBase64}
        <img
          src={imgBase64}
          class="w-[128px] h-[128px] p-8"
          alt="Selected pic preview"
        />
      {/if}
    </div>
  </div>
</div>
