<script context="module">
  import { getCookie, checkIfLoggedTrue } from '$lib/utils.js'
  import { browser } from '$app/env';
  export async function load() { 
    if (browser){
      let user_info = JSON.parse(getCookie('TouchyProfile')) 
      let isLogged = checkIfLoggedTrue(getCookie('TouchyTokens'), user_info.email)
      return { 
        props: { 
          isLogged: isLogged,
          user_info: user_info 
        } 
      }
    }
  }
  
</script>

<script>
  import { BACKEND_HOST } from '$lib/envVar';
  import { goto } from '$app/navigation';
  export let user_info, isLogged, imgBase64
  let files, input, notLoggedError = false, previewImage = false, serverError = false
  async function uploadImage (data) {
    var bytes = new Uint8Array(data.length / 2);
    for (var i = 0; i < data.length; i += 2) {
      bytes[i / 2] = parseInt(data.substring(i, i + 2), 16);
    }
    let formData = new FormData();
    formData.append('post', files[0], user_info.username); //*
    const res = await fetch(BACKEND_HOST+'/uploadPost', {
      method: 'POST',
      body: formData
    });
    console.log(res.status)
    if (res.status == 200) {
      goto("../profile/"+user_info.username)
    } else serverError = true
  };
  async function imageIntoBase64IntoBlob (image) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgBase64 = e.target.result
      uploadImage(e.target.result);
    };
    reader.readAsDataURL(image);
  };
  function tryToUpload () {
    if (isLogged) {
      imageIntoBase64IntoBlob(files[0])
    } else notLoggedError = true
  }
  const onFileSelected =(e)=>{
  let image = e.target.files[0];
  let reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = e => {
          imgBase64 = e.target.result
      };
  }
</script>


<div class="relative">
    <div class="font-sans">
      <div class="flex h-screen justify-center items-center">
        <button class="w-[110px] h-10 text-sm rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold" on:click={tryToUpload}>Upload image</button>
        <label class="w-[150px] h-10 flex flex-col items-center py-2 rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold">
          <span class="text-center xt-white text-sm">Select an image</span>
          <input type="file" name="post" bind:files bind:this={input} on:change={(e)=>onFileSelected(e)} class="hidden" />  
        </label>
        <button class="w-[100px] h-10 text-sm rounded-md shadow-md tracking-wide border border-gray-900 border-2 cursor-pointer bg-gray-900 hover:bg-white hover:text-gray-900 text-white ease-linear transition-all duration-150 font-sans subpixel-antialiased font-bold" on:click={() => {input.value = ''; imgBase64 = null}}>Reset image</button>
        {#if notLoggedError }
          <a href="../login" class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">Error, please log in and retry</a>  
        {/if}
        {#if notLoggedError }
          <span class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">Error, please retry later</span>  
        {/if}
        {#if imgBase64}
          <img src={imgBase64} class="w-[128px] h-[128px] rounded-full p-8" alt="Selected pic preview"/>
        {/if}
      </div>
    </div>

</div>