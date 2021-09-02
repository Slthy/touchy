<!--Needs come css stuff-->
<script context="module">
  export async function load({ page }) { 
    const username = page.params.username
    return {
      props: {
        username: username
      }
    }
  }
</script>

<script>
  export let username
</script>

<svelte:head>
	<title>touchy - user not found</title>
</svelte:head>

<h1>404 - {username} not found</h1>